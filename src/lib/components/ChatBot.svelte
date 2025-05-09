<script lang="ts">
  import { onMount } from 'svelte';
  import nlp from 'compromise';
  import { locale, t } from '$lib/i18n/i18n';
  import { loadData } from '$lib/helpers';

  // Interfaces for data
  interface Message {
    text: string;
    isUser: boolean;
  }

  interface DataObject {
    [key: string]: any;
  }

  interface Language {
    name: string;
    level: string;
  }
  
  // Component props
  export let hideInput = false; // Hide the input field when using external input
  export let externalText = ''; // Text coming from an external source like the searchbar
  export let onResponse: ((response: string) => void) | null = null; // Optional callback for response
  export let onHistoryUpdate: ((messages: Message[]) => void) | null = null; // Optional callback for history updates

  // Chat state
  let messages: Message[] = [];
  let inputValue = '';
  let isLoading = false;
  let chatContainer: HTMLDivElement;
  let inputElement: HTMLInputElement;
  let dataLoaded = false;
  let dataLoadError = '';
  let conversationContext: {
    lastTopic?: string;
    mentionedTopics: Set<string>;
    questionCount: number;
    userName?: string;
  } = {
    mentionedTopics: new Set(),
    questionCount: 0
  };
  
  // Loaded data
  let data: Record<string, DataObject | null> = {
    about: null,
    information: null,
    skills: null,
    languages: null,
    projects: null,
    certifications: null,
    reviews: null,
    complementary: null,
    carrer: null,
    contact: null,
    informatic: null
  };

  // Watch for external text input changes
  $: if (externalText && externalText.trim() !== '') {
    handleExternalInput(externalText);
    externalText = ''; // Reset after processing
  }

  // Handle text coming from an external input
  async function handleExternalInput(text: string) {
    if (!text.trim()) return;
    
    // Process the external input
    processInput(text);
  }

  // Process any input regardless of source
  async function processInput(text: string) {
    // Add the question to chat
    messages = [...messages, { text, isUser: true }];
    isLoading = true;
    scrollToBottom();
    
    // Notify parent component of history update
    if (onHistoryUpdate) {
      onHistoryUpdate(messages);
    }
    
    try {
      // Increment question counter for context
      conversationContext.questionCount++;
      
      // Extract user name from greeting if present
      const greeting = /(?:me llamo|soy|i am|i'm|my name is) ([A-Za-záéíóúÁÉÍÓÚñÑ]+)/i;
      const nameMatch = text.match(greeting);
      if (nameMatch && nameMatch[1]) {
        conversationContext.userName = nameMatch[1];
      }
      
      // Process the question and generate response
      const response = await processQuestion(text);
      
      // Add response to chat
      messages = [...messages, { text: response, isUser: false }];
      
      // Call response callback if provided
      if (onResponse) {
        onResponse(response);
      }
      
      // Notify parent component of history update
      if (onHistoryUpdate) {
        onHistoryUpdate(messages);
      }
    } catch (error) {
      const errorMessage = $t('chatbot.error');
      messages = [...messages, { text: errorMessage, isUser: false }];
      
      if (onResponse) {
        onResponse(errorMessage);
      }
      
      // Notify parent component of history update
      if (onHistoryUpdate) {
        onHistoryUpdate(messages);
      }
    } finally {
      isLoading = false;
      scrollToBottom();
      
      // Keep focus on input after sending message if not hidden
      if (inputElement && !hideInput) {
        setTimeout(() => {
          inputElement.focus();
        }, 10);
      }
    }
  }

  // Load data using the helper function
  async function loadAllData() {
    try {
      // Load all data
      data.information = await loadData('information');
      data.about = await loadData('about');
      data.carrer = await loadData('carrer');
      
      // Load projects data directly using fetch to get full structure
      try {
        const projectsResponse = await fetch('/data/projects.json');
        if (projectsResponse.ok) {
          data.projects = await projectsResponse.json();
        } else {
          console.error("Failed to load projects data");
        }
      } catch (projectsError) {
        console.error("Error loading projects:", projectsError);
      }
      
      data.languages = await loadData('languages');
      data.skills = await loadData('skills');
      data.informatic = await loadData('informatic');
      data.certifications = await loadData('certifications');
      data.contact = await loadData('contact');
      data.reviews = await loadData('reviews');
      data.complementary = await loadData('complementary');
      
      // Check if main data was loaded
      if (data.information || data.about || data.projects) {
        return true;
      } else {
        dataLoadError = "Could not load main data";
        return false;
      }
    } catch (error) {
      dataLoadError = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }
  
  // Auto scroll to the end of chat
  function scrollToBottom() {
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
    }
  }

  // Check if a topic was recently mentioned to avoid repetition
  function wasMentioned(topic: string): boolean {
    return conversationContext.mentionedTopics.has(topic);
  }
  
  // Add a topic to the mentioned list
  function addToMentioned(topic: string): void {
    conversationContext.lastTopic = topic;
    conversationContext.mentionedTopics.add(topic);
  }
  
  // Get random response variation
  function getRandomResponse(key: string, values?: Record<string, string>): string {
    const responses = [
      $t(`chatbot.${key}`, { values }),
      $t(`chatbot.${key}Alt`, { values }) || $t(`chatbot.${key}`, { values }),
      $t(`chatbot.${key}Alt2`, { values }) || $t(`chatbot.${key}`, { values })
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Add personalization based on context
  function personalize(response: string): string {
    // If we know the user's name, use it occasionally
    if (conversationContext.userName && Math.random() > 0.7) {
      return `${conversationContext.userName}, ${response.charAt(0).toLowerCase() + response.slice(1)}`;
    }
    
    // Add follow-up suggestions based on context
    if (conversationContext.lastTopic && Math.random() > 0.7) {
      const followUps: Record<string, string> = {
        'projects': $t('chatbot.projectsFollowUp'),
        'skills': $t('chatbot.skillsFollowUp'),
        'languages': $t('chatbot.languagesFollowUp'),
        'certifications': $t('chatbot.certificationsFollowUp'),
        'experience': $t('chatbot.experienceFollowUp')
      };
      
      const followUp = followUps[conversationContext.lastTopic];
      if (followUp) {
        return `${response} ${followUp}`;
      }
    }
    
    return response;
  }

  // Process the question and generate a response
  async function processQuestion(question: string): Promise<string> {
    try {
      // Normalize the question
      const normalizedQuestion = question.toLowerCase().trim();
      
      // Create NLP document
      const doc = nlp(normalizedQuestion);
      
      // Detect language (Spanish by default)
      if (doc.match('(in english|english please|speak english)').found) {
        $locale = 'en';
      }

      // BASIC RESPONSES
      
      // Responses to greetings - with variations
      if (doc.match('(hola|hello|hi|hey|saludos|buenos días|good morning|buenas tardes|good afternoon|buenas noches|good evening)').found) {
        // Different greeting based on question count
        if (conversationContext.questionCount <= 1) {
          return getRandomResponse('greeting');
        } else {
          return getRandomResponse('greetingAgain');
        }
      }
      
      // Thanks responses
      if (doc.match('(gracias|thanks|thank you|te agradezco)').found) {
        return getRandomResponse('thanks');
      }
      
      // Goodbye responses
      if (doc.match('(adios|adiós|chao|bye|goodbye|see you|hasta luego)').found) {
        return getRandomResponse('goodbye');
      }
      
      // Responses to questions about what can be asked
      if (doc.match('(qué (puedo|puedes|podemos) (preguntar|hacer)|que (sabes|puedes) hacer|what can (i|you) (do|ask)|ayuda|help)').found) {
        return getRandomResponse('help');
      }
      
      // INFORMATIVE QUESTIONS
      
      // General questions about Adrian
      if (doc.match('(quien es|cuéntame (sobre|acerca de)|háblame de|who is|tell me about|acerca|sobre) (adrian|adrián|él|el|him)').found) {
        if (data.about && data.information) {
          const name = data.information[$locale]?.name || '';
          const job = data.information[$locale]?.job || $t('profile.job');
          const description = data.about[$locale]?.description?.split('\n')[0] || '';
          
          return personalize(getRandomResponse('aboutPerson', { name, job, description }));
        }
      }
      
      // Name detection or personal
      if (doc.match('(nombre|name|who are you|quien eres)').found) {
        return data.information?.[$locale]?.name || '';
      } 
      
      // Contact or email
      if (doc.match('(contact|email|correo|mail)').found) {
        addToMentioned('contact');
        return personalize(getRandomResponse('contactInfo', { 
          email: data.information?.[$locale]?.email || '' 
        }));
      }
      
      // Location
      if (doc.match('(where|dónde|location|ubicación|vive|live)').found) {
        return personalize(getRandomResponse('location', { 
          location: data.information?.[$locale]?.location || '' 
        }));
      }
      
      // Current job
      if (doc.match('(trabajo actual|current job|job|empresa|company|trabaja|work)').found) {
        addToMentioned('experience');
        const job = data.information?.[$locale]?.currentJob;
        if (job) {
          return personalize(getRandomResponse('currentJob', { company: job.label, url: job.url }));
        } else {
          return getRandomResponse('defaultJob');
        }
      }
      
      // About him or description
      if (doc.match('(about|sobre|descripción|description)').found) {
        const description = data.about?.[$locale]?.description;
        if (description) {
          // Return only first paragraph to avoid being too long
          return personalize(getRandomResponse('aboutDescription', { 
            description: description.split('\n')[0]
          }));
        } else {
          return getRandomResponse('defaultAbout');
        }
      }

      // SKILLS
      
      // Skills search
      if (doc.match('(skills|habilidades|technologies|tecnologías|sabe hacer|can do)').found) {
        addToMentioned('skills');
        if (data.skills?.[$locale]?.categories) {
          const categories = data.skills[$locale].categories;
          const skillsList = categories
            .map((cat: { name: string }) => cat.name)
            .join(', ');
          return personalize(getRandomResponse('skills', { skills: skillsList }));
        } else if (data.skills?.[$locale]?.skills) {
          const skills = data.skills[$locale].skills;
          const topSkills = skills.slice(0, 5).map((skill: any) => skill.name).join(', ');
          return personalize(getRandomResponse('topSkills', { skills: topSkills }));
        } else {
          return getRandomResponse('defaultSkills');
        }
      }
      
      // Programming languages search
      if (doc.match('(lenguajes|programming|programación|code|código)').found) {
        addToMentioned('programming');
        if (data.informatic?.[$locale]?.programming) {
          const languages = data.informatic[$locale].programming;
          const langList = languages.slice(0, 5).map((l: any) => l.name).join(', ');
          return personalize(getRandomResponse('programmingLanguages', { languages: langList }));
        } else {
          return getRandomResponse('defaultProgramming');
        }
      }
      
      // PROJECTS
      
      // Questions about projects
      if (doc.match('(proyecto|proyectos|project|projects)').found) {
        // Force showing real project data every time
        try {
          
          // Direct access to data structure without filtering by locale first
          const relevantProjects = 
              data.projects?.[$locale]?.relevant?.projects || 
              data.projects?.es?.relevant?.projects || 
              [];
          
          if (relevantProjects && relevantProjects.length > 0) {
            // Get total projects count across all categories
            let totalCount = 0;
            let allProjects = [];
            
            // Count & collect relevant projects
            totalCount += relevantProjects.length || 0;
            allProjects.push(...relevantProjects);
            
            // Count & collect personal projects
            const personalProjects = 
                data.projects?.[$locale]?.personal?.projects || 
                data.projects?.es?.personal?.projects || 
                [];
            totalCount += personalProjects.length || 0;
            allProjects.push(...personalProjects);
            
            // Count & collect professional projects
            const professionalProjects = 
                data.projects?.[$locale]?.professional?.projects || 
                data.projects?.es?.professional?.projects || 
                [];
            totalCount += professionalProjects.length || 0;
            allProjects.push(...professionalProjects);
            
            // Randomly select 3 different projects to show variety
            const shuffledProjects = [...allProjects].sort(() => 0.5 - Math.random());
            const selectedProjects = shuffledProjects.slice(0, 3);
            const projectsList = selectedProjects.map((p: any) => p.name).join(', ');
            
            // Don't use wasMentioned check to always show real data
            const randomSelector = Math.random();
            if (randomSelector < 0.33) {
              return personalize(getRandomResponse('projects', { 
                count: String(totalCount), 
                projects: projectsList 
              }));
            } else if (randomSelector < 0.66) {
              return personalize(getRandomResponse('featuredProjects', { 
                projects: projectsList 
              }));
            } else {
              // Get a random project to highlight from the full collection
              const randomProject = shuffledProjects[0];
              return personalize(getRandomResponse('singleProject', { 
                name: randomProject.name, 
                description: randomProject.description 
              }));
            }
          }
        } catch (error) {
          console.error("Error processing projects question:", error);
        }
        
        // Fallback to default response if above fails
        return getRandomResponse('defaultProjects');
      }
      
      // LANGUAGES
      
      if (doc.match('(languages|idiomas|lenguajes)').found && !doc.match('(programming|programación|code|código)').found) {
        addToMentioned('languages');
        if (data.languages?.[$locale]?.languages) {
          const languagesList = data.languages[$locale].languages
            .map((l: Language) => `${l.name} (${l.level})`)
            .join(', ');
          return personalize(getRandomResponse('languages', { languages: languagesList }));
        } else {
          return getRandomResponse('defaultLanguages');
        }
      }
      
      // CERTIFICATIONS
      
      if (doc.match('(certificates|certifications|certificados|certificaciones)').found) {
        addToMentioned('certifications');
        if (data.certifications?.[$locale]?.certificates) {
          const certCount = data.certifications[$locale].certificates.length;
          const certList = data.certifications[$locale].certificates
            .slice(0, 3)
            .map((cert: any) => cert.name)
            .join(', ');
            
          return personalize(getRandomResponse('certifications', { count: certCount, certs: certList }));
        } else {
          return getRandomResponse('defaultCertifications');
        }
      }
      
      // EXPERIENCE
      
      if (doc.match('(career|carrera|experience|experiencia|trabajos|jobs)').found) {
        addToMentioned('experience');
        if (data.carrer?.[$locale]?.jobs) {
          const jobs = data.carrer[$locale].jobs || [];
          const lastJob = jobs[0];
          if (lastJob) {
            return personalize(getRandomResponse('currentPosition', { company: lastJob.company, position: lastJob.what }));
          }
        }
        
        return getRandomResponse('defaultPosition');
      }
      
      // PERSONALITY QUESTIONS
      
      // Interests, hobbies
      if (doc.match('(hobbies|interests|intereses|pasatiempos|likes|gustos|what do you (like|enjoy)|qué te gusta)').found) {
        return personalize(getRandomResponse('hobbies'));
      }
      
      // Aspirations, goals
      if (doc.match('(goals|aspirations|objetivos|metas|aspiras|quieres|want to|futuro|future)').found) {
        return personalize(getRandomResponse('goals'));
      }
      
      // Motivation, inspiration
      if (doc.match('(motivation|motivación|inspires|inspira|drives|why did you|por qué (decidiste|escogiste))').found) {
        return personalize(getRandomResponse('motivation'));
      }
      
      // Philosophy, approach
      if (doc.match('(methodology|metodología|approach|enfoque|philosophy|filosofía|how do you|cómo (abordas|enfocas))').found) {
        return personalize(getRandomResponse('approach'));
      }
      
      // Keyword search if no specific match was found
      const keywords = normalizedQuestion.split(/\s+/).filter(word => word.length > 3);
      for (const keyword of keywords) {
        
        // Search in general information
        if (data.about?.[$locale]?.description?.toLowerCase().includes(keyword)) {
          return data.about[$locale].description.split("\n")[0];
        }
        
        // Search in skills
        if (data.skills?.[$locale]?.categories) {
          for (const category of data.skills[$locale].categories) {
            if (category.name.toLowerCase().includes(keyword)) {
              return personalize(getRandomResponse('skillCategory', { category: category.name }));
            }
          }
        }
        
        // Search in projects
        if (data.projects?.[$locale]?.categories) {
          for (const category of data.projects[$locale].categories) {
            for (const project of category.projects || []) {
              if (project.name.toLowerCase().includes(keyword) || 
                  (project.description && project.description.toLowerCase().includes(keyword))) {
                return personalize(getRandomResponse('projectDescription', { name: project.name, description: project.description }));
              }
            }
          }
        }
      }
      
      // Contextual follow-up suggestion if we have history
      if (conversationContext.lastTopic && conversationContext.questionCount > 1) {
        // Occasionally suggest related topics based on conversation history
        const suggestions: Record<string, string> = {
          'projects': getRandomResponse('suggestSkills'),
          'skills': getRandomResponse('suggestProjects'),
          'languages': getRandomResponse('suggestCertifications'),
          'certifications': getRandomResponse('suggestExperience'),
          'experience': getRandomResponse('suggestContact'),
          'contact': getRandomResponse('suggestBackground')
        };
        
        const topic = conversationContext.lastTopic;
        if (topic && suggestions[topic] && Math.random() > 0.7) {
          return suggestions[topic];
        }
      }
      
      // Default response
      return getRandomResponse('defaultResponse');
    } catch (error) {
      return $t('chatbot.error');
    }
  }

  // Handle question submission
  async function handleSubmit() {
    if (!inputValue.trim()) return;
    
    const question = inputValue;
    inputValue = '';
    
    // Process the input
    processInput(question);
  }

  onMount(async () => {
    try {
      dataLoaded = await loadAllData();
      
      // Welcome message
      messages = [
        { 
          text: $t('chatbot.welcome'), 
          isUser: false 
        }
      ];
      
      // Send initial messages to parent if callback provided
      if (onHistoryUpdate) {
        onHistoryUpdate(messages);
      }
    } catch (error) {
      messages = [
        { 
          text: $t('chatbot.loadError', { values: { error: error instanceof Error ? error.message : 'Unknown' } }), 
          isUser: false 
        }
      ];
      
      // Send error message to parent if callback provided
      if (onHistoryUpdate) {
        onHistoryUpdate(messages);
      }
    } finally {
      // Focus input on load if input is visible
      if (inputElement && !hideInput) {
        inputElement.focus();
      }
    }
  });
</script>

<div class="chatbot-container">
  <div class="chat-messages" bind:this={chatContainer}>
    {#each messages as message}
      <div class="message {message.isUser ? 'user-message' : 'bot-message'}">
        <div class="message-content">
          {message.text}
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="message bot-message">
        <div class="message-content">
          <span class="loading-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </div>
      </div>
    {/if}
  </div>
  
  {#if !hideInput}
    <form class="chat-input" on:submit|preventDefault={handleSubmit}>
      <input 
        type="text" 
        bind:value={inputValue} 
        bind:this={inputElement}
        placeholder={$t('chatbot.inputPlaceholder')} 
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !inputValue.trim()}>
        {$t('chatbot.send')}
      </button>
    </form>
  {/if}
</div>

<style>
  .chatbot-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--window-header);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-light);
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .message {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 16px;
    margin-bottom: 8px;
    word-break: break-word;
  }
  
  .user-message {
    background-color: var(--win-accent);
    color: var(--text-primary);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  
  .bot-message {
    background-color: var(--taskbar-active);
    color: var(--text-primary);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  
  .chat-input {
    display: flex;
    padding: 12px;
    background-color: var(--taskbar-bg);
    border-top: var(--border-light);
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: var(--border-light);
    border-radius: 20px;
    margin-right: 8px;
    font-size: 14px;
    background-color: var(--taskbar-hover);
    color: var(--text-primary);
  }
  
  button {
    padding: 8px 16px;
    background-color: var(--win-accent);
    color: var(--text-primary);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .loading-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: var(--text-secondary);
    border-radius: 50%;
    display: inline-block;
    animation: dot-flashing 1s infinite alternate;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes dot-flashing {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
</style>
