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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	let _dataLoaded = false;
	let _dataLoadError = '';
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
		career: null,
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
		} catch {
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
			data.information = await loadData('information');
			data.about = await loadData('about');
			data.career = await loadData('career');
			data.projects = await loadData('projects');

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
				_dataLoadError = 'Could not load main data';
				return false;
			}
		} catch (error) {
			_dataLoadError = error instanceof Error ? error.message : 'Unknown error';
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
				projects: $t('chatbot.projectsFollowUp'),
				skills: $t('chatbot.skillsFollowUp'),
				languages: $t('chatbot.languagesFollowUp'),
				certifications: $t('chatbot.certificationsFollowUp'),
				experience: $t('chatbot.experienceFollowUp')
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
			if (
				doc.match(
					'(hola|hello|hi|hey|saludos|buenos días|good morning|buenas tardes|good afternoon|buenas noches|good evening)'
				).found
			) {
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
			if (
				doc.match(
					'(qué (puedo|puedes|podemos) (preguntar|hacer)|que (sabes|puedes) hacer|what can (i|you) (do|ask)|ayuda|help)'
				).found
			) {
				return getRandomResponse('help');
			}

			// INFORMATIVE QUESTIONS

			if (
				doc.match(
					'(quien es|cuéntame (sobre|acerca de)|háblame de|who is|tell me about|acerca|sobre) (adrian|adrián|él|el|him)'
				).found
			) {
				if (data.about && data.information) {
					const name = data.information.name || '';
					const job = data.information.job || $t('profile.job');
					const description = data.about.description?.split('\n')[0] || '';
					return personalize(getRandomResponse('aboutPerson', { name, job, description }));
				}
			}

			if (doc.match('(nombre|name|who are you|quien eres)').found) {
				return data.information?.name || '';
			}

			if (doc.match('(contact|email|correo|mail)').found) {
				addToMentioned('contact');
				return personalize(
					getRandomResponse('contactInfo', {
						email: data.information?.email || ''
					})
				);
			}

			if (doc.match('(where|dónde|location|ubicación|vive|live)').found) {
				return personalize(
					getRandomResponse('location', {
						location: data.information?.location || ''
					})
				);
			}

			if (doc.match('(trabajo actual|current job|job|empresa|company|trabaja|work)').found) {
				addToMentioned('experience');
				const job = data.information?.currentJob;
				if (job) {
					return personalize(getRandomResponse('currentJob', { company: job.label, url: job.url }));
				}
				return getRandomResponse('defaultJob');
			}

			if (doc.match('(about|sobre|descripción|description)').found) {
				const description = data.about?.description;
				if (description) {
					return personalize(
						getRandomResponse('aboutDescription', {
							description: description.split('\n')[0]
						})
					);
				}
				return getRandomResponse('defaultAbout');
			}

			if (doc.match('(skills|habilidades|technologies|tecnologías|sabe hacer|can do)').found) {
				addToMentioned('skills');
				const skills = data.skills?.skills || [];
				if (skills.length > 0) {
					const topSkills = skills
						.slice(0, 6)
						.map((skill: { name: string }) => skill.name)
						.join(', ');
					return personalize(getRandomResponse('topSkills', { skills: topSkills }));
				}
				return getRandomResponse('defaultSkills');
			}

			if (doc.match('(lenguajes|programming|programación|code|código)').found) {
				addToMentioned('programming');
				const languages = data.informatic?.programming || [];
				if (languages.length > 0) {
					const langList = languages
						.slice(0, 6)
						.map((l: { name: string }) => l.name)
						.join(', ');
					return personalize(getRandomResponse('programmingLanguages', { languages: langList }));
				}
				return getRandomResponse('defaultProgramming');
			}

			if (doc.match('(proyecto|proyectos|project|projects)').found) {
				try {
					const relevantProjects = data.projects?.relevant?.projects || [];
					const personalProjects = data.projects?.personal?.projects || [];
					const professionalProjects = data.projects?.professional?.projects || [];
					const allProjects = [...relevantProjects, ...personalProjects, ...professionalProjects];

					if (allProjects.length > 0) {
						const shuffledProjects = [...allProjects].sort(() => 0.5 - Math.random());
						const selectedProjects = shuffledProjects.slice(0, 3);
						const projectsList = selectedProjects.map((p: { name: string }) => p.name).join(', ');
						const randomSelector = Math.random();

						if (randomSelector < 0.33) {
							return personalize(
								getRandomResponse('projects', {
									count: String(allProjects.length),
									projects: projectsList
								})
							);
						}

						if (randomSelector < 0.66) {
							return personalize(getRandomResponse('featuredProjects', { projects: projectsList }));
						}

						const randomProject = shuffledProjects[0];
						return personalize(
							getRandomResponse('singleProject', {
								name: randomProject.name,
								description: randomProject.description
							})
						);
					}
				} catch (error) {
					console.error('Error processing projects question:', error);
				}

				return getRandomResponse('defaultProjects');
			}

			if (
				doc.match('(languages|idiomas|lenguajes)').found &&
				!doc.match('(programming|programación|code|código)').found
			) {
				addToMentioned('languages');
				const languages = data.languages?.languages || [];
				if (languages.length > 0) {
					const languagesList = languages.map((l: Language) => `${l.name} (${l.level})`).join(', ');
					return personalize(getRandomResponse('languages', { languages: languagesList }));
				}
				return getRandomResponse('defaultLanguages');
			}

			if (doc.match('(certificates|certifications|certificados|certificaciones)').found) {
				addToMentioned('certifications');
				const certificationsByIssuer = data.certifications?.certifications || {};
				const certs = Object.values(certificationsByIssuer).flat() as Array<{ name: string }>;
				if (certs.length > 0) {
					const certList = certs
						.slice(0, 3)
						.map((cert) => cert.name)
						.join(', ');
					return personalize(
						getRandomResponse('certifications', { count: String(certs.length), certs: certList })
					);
				}
				return getRandomResponse('defaultCertifications');
			}

			if (doc.match('(career|careera|experience|experiencia|trabajos|jobs)').found) {
				addToMentioned('experience');
				const workSteps = (data.career?.steps || []).filter(
					(step: { type: string }) => step.type === 'work'
				);
				const lastJob = workSteps[workSteps.length - 1];
				if (lastJob) {
					return personalize(
						getRandomResponse('currentPosition', {
							company: lastJob.where,
							position: lastJob.what
						})
					);
				}
				return getRandomResponse('defaultPosition');
			}

			// PERSONALITY QUESTIONS

			// Interests, hobbies
			if (
				doc.match(
					'(hobbies|interests|intereses|pasatiempos|likes|gustos|what do you (like|enjoy)|qué te gusta)'
				).found
			) {
				return personalize(getRandomResponse('hobbies'));
			}

			// Aspirations, goals
			if (
				doc.match('(goals|aspirations|objetivos|metas|aspiras|quieres|want to|futuro|future)').found
			) {
				return personalize(getRandomResponse('goals'));
			}

			// Motivation, inspiration
			if (
				doc.match(
					'(motivation|motivación|inspires|inspira|drives|why did you|por qué (decidiste|escogiste))'
				).found
			) {
				return personalize(getRandomResponse('motivation'));
			}

			// Philosophy, approach
			if (
				doc.match(
					'(methodology|metodología|approach|enfoque|philosophy|filosofía|how do you|cómo (abordas|enfocas))'
				).found
			) {
				return personalize(getRandomResponse('approach'));
			}

			// Keyword search if no specific match was found
			const keywords = normalizedQuestion.split(/\s+/).filter((word) => word.length > 3);
			for (const keyword of keywords) {
				if (data.about?.description?.toLowerCase().includes(keyword)) {
					return data.about.description.split('\n')[0];
				}

				if (data.skills?.skills) {
					for (const category of data.skills.skills) {
						if (category.name.toLowerCase().includes(keyword)) {
							return personalize(getRandomResponse('skillCategory', { category: category.name }));
						}
					}
				}

				const projectBuckets = [
					...(data.projects?.relevant?.projects || []),
					...(data.projects?.personal?.projects || []),
					...(data.projects?.professional?.projects || [])
				];

				for (const project of projectBuckets) {
					if (
						project.name.toLowerCase().includes(keyword) ||
						(project.description && project.description.toLowerCase().includes(keyword))
					) {
						return personalize(
							getRandomResponse('projectDescription', {
								name: project.name,
								description: project.description
							})
						);
					}
				}
			}

			// Contextual follow-up suggestion if we have history
			if (conversationContext.lastTopic && conversationContext.questionCount > 1) {
				// Occasionally suggest related topics based on conversation history
				const suggestions: Record<string, string> = {
					projects: getRandomResponse('suggestSkills'),
					skills: getRandomResponse('suggestProjects'),
					languages: getRandomResponse('suggestCertifications'),
					certifications: getRandomResponse('suggestExperience'),
					experience: getRandomResponse('suggestContact'),
					contact: getRandomResponse('suggestBackground')
				};

				const topic = conversationContext.lastTopic;
				if (topic && suggestions[topic] && Math.random() > 0.7) {
					return suggestions[topic];
				}
			}

			// Default response
			return getRandomResponse('defaultResponse');
		} catch {
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
			_dataLoaded = await loadAllData();

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
					text: $t('chatbot.loadError', {
						values: { error: error instanceof Error ? error.message : 'Unknown' }
					}),
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
		{#each messages as message, i (i)}
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
