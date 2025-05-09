<script lang="ts">
  import { onMount } from 'svelte';
  import { loadData, calculateAge } from '../../helpers';
  import { locale } from '$lib/i18n/i18n';
  import { t } from '$lib/i18n/i18n';
  import Icon from '$lib/components/Icon.svelte';
  import { sendEmail } from '$lib/api';

  interface ProfileProps {
    initialTab: 'information' | 'about' | 'carrer'| 'projects' | 'languages' | 'skills' | 'informatic' | 'certifications' | 'contact' | 'reviews' | 'complementary';
  }

  export let initialTab: ProfileProps['initialTab'] = 'information';

  // Interfaces for certifications
  interface Certification {
    name: string;
    issuer: string;
    date: string;
    expires?: string;
    url: string;
    icon: string;
    important?: boolean;
  }

  interface CertificationData {
    certifications: Record<string, Certification[]>;
  }

  // State to store loaded data
  let information: any = null;
  let about: any = null;
  let carrer: any = null;
  let projects: any = null;
  let languages: any = null;
  let skills: any = null;
  let informatic: any = null;
  let certifications: CertificationData | null = null;
  let contact: any = null;
  let reviews: any = null;
  let complementary: any = null;

  // State for the active menu
  let activeMenu = initialTab;

  // Form data
  let contactForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  };

  let formSubmitting = false;
  let formSuccess = false;
  let formError = false;
  let errorMessage = '';

  // Function to load all data
  async function loadAllData() {
    information = await loadData('information');
    about = await loadData('about');
    carrer = await loadData('carrer');
    projects = await loadData('projects');
    languages = await loadData('languages');
    skills = await loadData('skills');
    informatic = await loadData('informatic');
    certifications = await loadData('certifications');
    contact = await loadData('contact');
    reviews = await loadData('reviews');
    complementary = await loadData('complementary');
  }

  // Function to change the active menu
  function setActiveMenu(menu: ProfileProps['initialTab']) {
    activeMenu = menu;
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  }

  // Function to generate Google Maps URL
  function generateMapUrl(coordinates: any) {
    if (!coordinates) return '';
    const { lat, lng, location } = coordinates;
    const language = $locale;
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=12&maptype=roadmap&language=${language}`;
  }

  onMount(() => {
    loadAllData();
    
    // Suscribirse a cambios de idioma para recargar los datos
    const unsubscribe = locale.subscribe(() => {
      loadAllData();
    });
    
    return () => {
      // Limpieza al desmontar el componente
      unsubscribe();
    };
  });

  function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			//
		}
	}

  // Handle form submission
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    formSubmitting = true;
    formSuccess = false;
    formError = false;
    
    try {
      // Call the API function to send the email
      const response = await sendEmail(
        contactForm.name,
        contactForm.message,
        contactForm.email,
        contactForm.phone,
        contactForm.company
      );
      
      if (response.success) {
        formSuccess = true;
        // Reset form
        contactForm = {
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        };
      } else {
        formError = true;
        errorMessage = response.message || $t('profile.errorSending');
      }
    } catch (error) {
      formError = true;
      errorMessage = $t('profile.errorSending');
      console.error('Error sending email:', error);
    } finally {
      formSubmitting = false;
    }
  };
</script>

<div class="profile-container">
  <div class="sidebar">
    <div class="menu-header">
      <span>borrageiros</span>
    </div>
    <div class="menu-items">
      <div 
        class="menu-item {activeMenu === 'information' ? 'active' : ''}" 
        on:click={() => setActiveMenu('information')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_information" size="18" />
        <span>{$t('profile.information')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'about' ? 'active' : ''}" 
        on:click={() => setActiveMenu('about')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_about" size="18" />
        <span>{$t('profile.about')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'carrer' ? 'active' : ''}" 
        on:click={() => setActiveMenu('carrer')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_carrer" size="18" />
        <span>{$t('profile.carrer')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'projects' ? 'active' : ''}" 
        on:click={() => setActiveMenu('projects')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_projects" size="18" />
        <span>{$t('profile.projects')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'languages' ? 'active' : ''}" 
        on:click={() => setActiveMenu('languages')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_languages" size="18" />
        <span>{$t('profile.languages')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'skills' ? 'active' : ''}" 
        on:click={() => setActiveMenu('skills')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_skills" size="18" />
        <span>{$t('profile.skills')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'informatic' ? 'active' : ''}" 
        on:click={() => setActiveMenu('informatic')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_informatic" size="18" />
        <span>{$t('profile.informatic')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'certifications' ? 'active' : ''}" 
        on:click={() => setActiveMenu('certifications')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_certifications" size="18" />
        <span>{$t('profile.certifications')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'contact' ? 'active' : ''}" 
        on:click={() => setActiveMenu('contact')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_contact" size="18" />
        <span>{$t('profile.contact')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'reviews' ? 'active' : ''}" 
        on:click={() => setActiveMenu('reviews')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_reviews" size="18" />
        <span>{$t('profile.reviews')}</span>
      </div>
      <div 
        class="menu-item {activeMenu === 'complementary' ? 'active' : ''}" 
        on:click={() => setActiveMenu('complementary')}
        on:keydown={handleKeydown}
        role="button"
        tabindex="0"
      >
        <Icon name="profile_complementary" size="18" />
        <span>{$t('profile.complementary')}</span>
      </div>
    </div>
  </div>
  
  <div class="content-area">
    {#if activeMenu === 'information' && information}
      <div class="information-section">
        <h2 class="section-title">
          <Icon name="profile_information" size="22" />
          <span>{$t('profile.information')}</span>
        </h2>
        
        <div class="info-cards-container">
          <div class="personal-info-card">
            <div class="photo-container">
              <img src={information.photo} alt="Profile" />
            </div>
            <div class="info-content">
              <h1 class="person-name">{information.name}</h1>
              
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">{$t('profile.age')}</div>
                  <div class="info-value">{calculateAge(information.birthDate)}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">{$t('profile.country')}</div>
                  <div class="info-value">{information.country}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">{$t('profile.job')}</div>
                  <div class="info-value">{information.job}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">{$t('profile.currentJob')}</div>
                  <div class="info-value">
                    <a href={information.currentJob.url} target="_blank" rel="noopener noreferrer" class="info-link">
                      {information.currentJob.label}
                    </a>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">{$t('profile.phone')}</div>
                  <div class="info-value">{information.phone}</div>
                </div>
                
                <div class="info-item">
                  <div class="info-label">{$t('profile.location')}</div>
                  <div class="info-value">{information.location}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">{$t('profile.email')}</div>
                  <div class="info-value">{information.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="map-section">
          <h2 class="section-title">
            <Icon name="map-pin" size="22" />
            <span>{$t('profile.location')}</span>
          </h2>
          <div class="map-container">
            <iframe
              title="Location"
              width="100%"
              height="600"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              referrerpolicy="no-referrer-when-downgrade"
              loading="lazy"
              allowfullscreen
              src={information && information.coordinates ? generateMapUrl(information.coordinates) : ''}
            >
            </iframe>
          </div>
        </div>
      </div>
    {:else if activeMenu === 'about' && about}
      <div class="about-section">
        <h2>
          <Icon name="profile_about" size="22" />
          <span>{about.title}</span>
        </h2>
        
        <div class="about-layout">
          <div class="top-row">
            <div class="description-container">
              <div class="about-card description-card">
                <p class="description">
                  {#each about.description.split('\n') as paragraph, index}
                    {paragraph}
                    {#if index < about.description.split('\n').length - 1}
                      <br />
                    {/if}
                  {/each}
                </p>
              </div>
            </div>
            
            <div class="about-cards-container">
              <div class="about-card interests-card">
                <div class="about-card-header">
                  <Icon name="heart" size="22" />
                  <h3>{$t('profile.interests')}</h3>
                </div>
                <div class="about-card-content">
                  <ul class="interests-list">
                    {#each about.interests as interest}
                      <li>
                        <div class="interest-item">
                          <div class="interest-bullet"></div>
                          <span>{interest}</span>
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              
              <div class="about-card goals-card">
                <div class="about-card-header">
                  <Icon name="target" size="22" />
                  <h3>{$t('profile.professionalGoals')}</h3>
                </div>
                <div class="about-card-content">
                  <ul class="goals-list">
                    {#each about.professionalGoals as goal}
                      <li>
                        <div class="goal-item">
                          <div class="goal-bullet"></div>
                          <span>{goal}</span>
                        </div>
                      </li>
                    {/each}
                    {#if about.professionalGoals && about.professionalGoals.length < 5}
                      {#each Array(5 - about.professionalGoals.length) as _}
                        <li class="spacer-item"></li>
                      {/each}
                    {/if}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bottom-row">
            <div class="about-card description-card full-width">
              <p class="description">
                {#each about.description2 ? about.description2.split('\n') : [] as paragraph, index}
                  {paragraph}
                  {#if index < (about.description2 ? about.description2.split('\n').length - 1 : 0)}
                    <br />
                  {/if}
                {/each}
              </p>
            </div>
          </div>
        </div>
      </div>
    {:else if activeMenu === 'carrer' && carrer}
      <div class="carrer-section">
        <h2>
          <Icon name="profile_carrer" size="22" />
          <span>{$t('profile.carrer')}</span>
        </h2>
        
        <div class="timeline-container">
          {#each carrer.steps as entry, index}
            <div class="timeline-item {index % 2 === 0 ? 'left' : 'right'}">
              <div class="timeline-marker">
                <div class="timeline-icon {entry.type === 'school' ? 'school' : 'work'}">
                  <Icon name={entry.type === 'school' ? 'school' : 'briefcase'} size="18" />
                </div>
              </div>
              <a href={entry.url} target="_blank" rel="noopener noreferrer" class="timeline-content-link">
                <div class="timeline-content">
                  <div class="timeline-header">
                    <h3 class="timeline-title">
                      {entry.where}
                    </h3>
                    <span class="timeline-date">{entry.from} - {entry.to}</span>
                  </div>
                  <div class="timeline-body">
                    <p>{entry.what}</p>
                  </div>
                </div>
              </a>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeMenu === 'projects' && projects}
      <div class="projects-section">
        <h2>
          <Icon name="profile_projects" size="22" />
          <span>{$t('profile.projects')}</span>
        </h2>
        
        <div class="projects-container">
          {#if projects.relevant && projects.relevant.projects.length > 0}
            <h2 class="project-category-title">{projects.relevant.title}</h2>
            <div class="projects-list">
              {#each projects.relevant.projects as project}
                <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-card-link">
                  <div class="project-card">
                    <div class="project-image">
                      <img src={project.image} alt={project.name} />
                    </div>
                    <div class="project-details">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
          
          {#if projects.personal && projects.personal.projects.length > 0}
            <h2 class="project-category-title">{projects.personal.title}</h2>
            <div class="projects-list">
              {#each projects.personal.projects as project}
                <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-card-link">
                  <div class="project-card">
                    <div class="project-image">
                      <img src={project.image} alt={project.name} />
                    </div>
                    <div class="project-details">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
          
          {#if projects.professional && projects.professional.projects.length > 0}
            <h2 class="project-category-title">{projects.professional.title}</h2>
            <div class="projects-list">
              {#each projects.professional.projects as project}
                <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-card-link">
                  <div class="project-card">
                    <div class="project-image">
                      <img src={project.image} alt={project.name} />
                    </div>
                    <div class="project-details">
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {:else if activeMenu === 'languages' && languages}
      <div class="languages-section">
        <h2>
          <Icon name="profile_languages" size="22" />
          <span>{$t('profile.languages')}</span>
        </h2>
        <div class="languages-grid">
          {#each languages.languages as language}
            <div class="language-card">
              <div class="language-card-header">
                <h3 class="language-name">{language.name}</h3>
                <span class="language-level">{language.level}</span>
              </div>
              
              <div class="language-skills-grid">
                <div class="skill-factor-card">
                  <div class="skill-factor-title">{$t('profile.oralComprehension')}</div>
                  <div class="skill-factor-progress">
                    <div class="progress-circle">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle class="progress-circle-bg" cx="40" cy="40" r="35" />
                        <circle class="progress-circle-fill" cx="40" cy="40" r="35" 
                          stroke-dasharray="{2 * Math.PI * 35 * language.skills.oral_comprehension / 100} {2 * Math.PI * 35}" />
                      </svg>
                      <span class="progress-circle-text">{language.skills.oral_comprehension}%</span>
                    </div>
                  </div>
                </div>
                
                <div class="skill-factor-card">
                  <div class="skill-factor-title">{$t('profile.speaking')}</div>
                  <div class="skill-factor-progress">
                    <div class="progress-circle">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle class="progress-circle-bg" cx="40" cy="40" r="35" />
                        <circle class="progress-circle-fill" cx="40" cy="40" r="35" 
                          stroke-dasharray="{2 * Math.PI * 35 * language.skills.speaking / 100} {2 * Math.PI * 35}" />
                      </svg>
                      <span class="progress-circle-text">{language.skills.speaking}%</span>
                    </div>
                  </div>
                </div>
                
                <div class="skill-factor-card">
                  <div class="skill-factor-title">{$t('profile.readingComprehension')}</div>
                  <div class="skill-factor-progress">
                    <div class="progress-circle">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle class="progress-circle-bg" cx="40" cy="40" r="35" />
                        <circle class="progress-circle-fill" cx="40" cy="40" r="35" 
                          stroke-dasharray="{2 * Math.PI * 35 * language.skills.reading_comprehension / 100} {2 * Math.PI * 35}" />
                      </svg>
                      <span class="progress-circle-text">{language.skills.reading_comprehension}%</span>
                    </div>
                  </div>
                </div>
                
                <div class="skill-factor-card">
                  <div class="skill-factor-title">{$t('profile.writing')}</div>
                  <div class="skill-factor-progress">
                    <div class="progress-circle">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle class="progress-circle-bg" cx="40" cy="40" r="35" />
                        <circle class="progress-circle-fill" cx="40" cy="40" r="35" 
                          stroke-dasharray="{2 * Math.PI * 35 * language.skills.writing / 100} {2 * Math.PI * 35}" />
                      </svg>
                      <span class="progress-circle-text">{language.skills.writing}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeMenu === 'skills' && skills}
      <div class="skills-section">
        <h2>
          <Icon name="profile_skills" size="22" />
          <span>{$t('profile.skills')}</span>
        </h2>
        <div class="skills-grid">
          {#each skills.skills as skill}
            <div class="skill-card">
              <div class="skill-card-header">
                <h3 class="skill-name">{skill.name}</h3>
                <span class="skill-percentage">{skill.percentage}%</span>
              </div>
              
              <div class="skill-progress-container">
                <div class="progress-bar">
                  <div class="progress" style="width: {skill.percentage}%"></div>
                </div>
              </div>
              
              <div class="skill-tags">
                {#each skill.items as item}
                  <span class="skill-tag">{item}</span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeMenu === 'informatic' && informatic}
      <div class="informatic-section">
        <h2>
          <Icon name="profile_informatic" size="22" />
          <span>{$t('profile.programmingLanguages')}</span>
        </h2>
        <div class="informatic-grid">
          {#each informatic.programming as item}
            <div class="informatic-card">
              <div class="informatic-icon">
                <div class="icon-placeholder">{item.icon.charAt(0).toUpperCase()}</div>
              </div>
              <div class="informatic-details">
                <div class="informatic-header">
                  <div class="informatic-name">{item.name}</div>
                  <div class="informatic-level">{item.level}</div>
                </div>
                <div class="progress-bar">
                  <div class="progress" style="width: {item.percentage}%"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <h2>
          <Icon name="tool" size="22" />
          <span>{$t('profile.softwareTools')}</span>
        </h2>
        <div class="informatic-grid">
          {#each informatic.software as item}
            <div class="informatic-card">
              <div class="informatic-icon">
                <div class="icon-placeholder">{item.icon.charAt(0).toUpperCase()}</div>
              </div>
              <div class="informatic-details">
                <div class="informatic-header">
                  <div class="informatic-name">{item.name}</div>
                  <div class="informatic-level">{item.level}</div>
                </div>
                <div class="progress-bar">
                  <div class="progress" style="width: {item.percentage}%"></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeMenu === 'certifications' && certifications}
      <div class="certifications-section">
        <h2>
          <Icon name="profile_certifications" size="22" />
          <span>{$t('profile.certifications')}</span>
        </h2>
        
        {#if certifications.certifications}
          {#each Object.entries(certifications.certifications) as [company, companyCerts]}
            <div class="company-certifications">
              <h3 class="company-title">{company}</h3>
              <div class="certifications-grid">
                {#each companyCerts as cert}
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" class="certification-card-link {cert.important ? 'important-cert' : ''}">
                    <div class="certification-card {cert.important ? 'important-cert' : ''}">
                      <div class="certification-icon">
                        <img src={cert.icon} alt={cert.name} />
                      </div>
                      <div class="certification-details">
                        <h3 class="certification-name">{cert.name}</h3>
                        <div class="certification-meta">
                          <div class="certification-date">
                            <Icon name="calendar" size="14" />
                            <span>{cert.date}</span>
                          </div>
                          {#if cert.expires}
                            <div class="certification-expires">
                              <Icon name="clock" size="14" />
                              <span>{$t('profile.expires')}: {cert.expires}</span>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {:else if activeMenu === 'contact' && contact}
      <div class="contact-section">
        <h2>
          <Icon name="profile_contact" size="22" />
          <span>{$t('profile.contact')}</span>
        </h2>
        
        <div class="contact-container">
          <div class="contact-form-container">
            <h3>{$t('profile.contactForm')}</h3>
            <form class="contact-form" on:submit={handleSubmit}>
              
              {#if formError}
                <div class="form-message error">
                  <Icon name="alert-circle" size="16" />
                  <span>{errorMessage}</span>
                </div>
              {/if}

              {#if formSuccess}
                <div class="form-message success">
                  <Icon name="check-circle" size="16" />
                  <span>{$t('profile.messageSent')}</span>
                </div>
              {/if}
              
              <div class="form-group">
                <label for="name">{$t('profile.name')} *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={$t('profile.namePlaceholder')}
                  bind:value={contactForm.name}
                />
              </div>
              
              <div class="form-group">
                <label for="email">{$t('profile.email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder={$t('profile.emailPlaceholder')}
                  bind:value={contactForm.email}
                />
              </div>
              
              <div class="form-group">
                <label for="phone">{$t('profile.phone')}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder={$t('profile.phonePlaceholder')}
                  bind:value={contactForm.phone}
                />
              </div>
              
              <div class="form-group">
                <label for="company">{$t('profile.company')}</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  placeholder={$t('profile.companyPlaceholder')}
                  bind:value={contactForm.company}
                />
              </div>
              
              <div class="form-group">
                <label for="message">{$t('profile.message')} *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="6" 
                  required 
                  placeholder={$t('profile.messagePlaceholder')}
                  bind:value={contactForm.message}
                ></textarea>
              </div>
              
              <div class="form-footer">
                <p class="required-fields">{$t('profile.requiredFields')}</p>
                <button type="submit" class="send-button" disabled={formSubmitting}>
                  <Icon name="send" size="16" />
                  <span>{formSubmitting ? $t('profile.sending') : $t('profile.send')}</span>
                </button>
              </div>
            </form>
          </div>
          
          <div class="social-links-container">
            <h3>{$t('profile.socialNetworks')}</h3>
            {#each contact.rrss as rrss}
              <div class="social-links">
                <a href={rrss.url} target="_blank" rel="noopener noreferrer" class="social-link">
                  <div class="social-icon" style="background-color: {rrss.color};">
                    <Icon name={rrss.icon} viewBox={rrss.viewBox} size="24" />
                  </div>
                  <span>{rrss.name}</span>
                </a>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else if activeMenu === 'reviews' && reviews}
      <div class="reviews-section">
        <h2>
          <Icon name="profile_reviews" size="22" />
          <span>{$t('profile.reviews')}</span>
        </h2>
        <div class="chat-container">
          {#each reviews.reviews as review, index}
            <div class="chat-message {index % 2 === 0 ? 'chat-received' : 'chat-sent'}">
              <div class="message-avatar">
                <img src={review.avatar} alt={review.name} />
              </div>
              <div class="message-content">
                <div class="message-header">
                  <a href={review.url} target="_blank" rel="noopener noreferrer">
                    <span class="message-name">{review.name}</span>
                    <span class="message-job">{review.job}</span>
                  </div>
                <div class="message-bubble">
                  <p>{review.review}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeMenu === 'complementary' && complementary}
      <div class="complementary-section">
        {#each complementary.complementary as section}
          <div class="complementary-block">
            <h2>
              <Icon name="profile_complementary" size="22" />
              <span>{section.title}</span>
            </h2>
            <ul class="complementary-list">
              {#each section.items as item}
                {#if typeof item === 'string'}
                  <li>{item}</li>
                {:else}
                  <li class="project-item">
                    <h3 class="project-name">{item.name}</h3>
                    <p class="project-description">
                      {#each item.description.split('\n') as paragraph, index}
                        {paragraph}
                        {#if index < item.description.split('\n').length - 1}
                          <br />
                        {/if}
                      {/each}
                    </p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" class="project-link">{$t('profile.viewProject')}</a>
                  </li>
                {/if}
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {:else}
      <div class="loading">
        <span>{$t('profile.loading')}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--window-bg);
    color: var(--text-primary);
    overflow: hidden;
  }
  
  .sidebar {
    width: 220px;
    background-color: var(--window-header);
    border-right: 1px solid var(--taskbar-active);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-header);
  }
  
  .sidebar::-webkit-scrollbar {
    width: 8px;
  }
  
  .sidebar::-webkit-scrollbar-track {
    background: var(--window-header);
  }
  
  .sidebar::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--window-header);
  }
  
  .sidebar::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .menu-header {
    padding: 15px;
    font-size: 16px;
    font-weight: bold;
    color: var(--text-primary);
    padding-bottom: 12px;
    padding-top: 12px;
  }
  
  .menu-items {
    display: flex;
    flex-direction: column;
  }
  
  .menu-item {
    padding: 12px 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .menu-item:hover {
    background-color: var(--taskbar-hover);
  }
  
  .menu-item.active {
    background-color: var(--win-accent);
    color: white;
  }
  
  .content-area {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-bg);
  }
  
  .content-area::-webkit-scrollbar {
    width: 10px;
  }
  
  .content-area::-webkit-scrollbar-track {
    background: var(--window-bg);
    border-radius: 4px;
  }
  
  .content-area::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 4px;
    border: 2px solid var(--window-bg);
  }
  
  .content-area::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  /* Information section styles */
  .information-section {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .section-title {
    color: var(--win-accent);
    margin: 0 0 15px 0;
    font-size: 22px;
  }
  
  .info-cards-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .personal-info-card {
    display: flex;
    gap: 25px;
    background-color: var(--window-header);
    border-radius: 10px;
    padding: 25px;
    box-shadow: var(--shadow-light);
    transition: box-shadow 0.3s;
  }
  
  .personal-info-card:hover {
    box-shadow: var(--shadow-medium);
  }
  
  .photo-container {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--win-accent);
    flex-shrink: 0;
  }
  
  .photo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .person-name {
    color: var(--win-accent);
    margin: 0 0 10px 0;
    font-size: 28px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .info-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .info-value {
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  .info-link {
    color: var(--win-accent);
    text-decoration: none;
  }
  
  .info-link:hover {
    text-decoration: underline;
  }
  
  .map-container {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-light);
  }
  
  /* About section styles */
  .about-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 0 10px;
  }
  
  .about-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .about-section h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .about-layout {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }
  
  .top-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    align-items: start;
  }
  
  .bottom-row {
    width: 100%;
  }
  
  .full-width {
    width: 100%;
  }
  
  .description-container {
    height: 100%;
  }
  
  .description-card {
    padding: 0;
    height: 100%;
    border-left: 4px solid var(--win-accent);
  }
  
  .description {
    line-height: 1.6;
    color: var(--text-primary);
    padding: 20px;
    margin: 0;
  }
  
  .about-cards-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    height: 100%;
  }
  
  .about-card {
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }
  
  .about-card.goals-card {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .goals-card .about-card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .goals-card .goals-list {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .about-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }
  
  .about-card-header {
    background-color: var(--taskbar-active);
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--taskbar-active);
  }
  
  .interests-card .about-card-header {
    background-color: rgba(236, 64, 122, 0.2);
    color: #ec407a;
  }
  
  .goals-card .about-card-header {
    background-color: rgba(33, 150, 243, 0.2);
    color: #2196f3;
  }
  
  .about-card-content {
    flex: 1;
    padding: 15px;
  }
  
  .interests-list, .goals-list {
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-primary);
  }
  
  .interests-list li, .goals-list li {
    margin-bottom: 12px;
  }
  
  .interest-item, .goal-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  
  .interest-bullet, .goal-bullet {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }
  
  .interest-bullet {
    background-color: #ec407a;
  }
  
  .goal-bullet {
    background-color: #2196f3;
  }
  
  .spacer-item {
    flex: 1;
    min-height: 20px;
  }
  
  @media (max-width: 768px) {
    .about-layout {
      grid-template-columns: 1fr;
    }
    
    .about-cards-container {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
  }
  
  /* Languages and Skills styles */
  .languages-section, .skills-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .languages-section h2, .skills-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
  }
  
  .language-name, .skill-name {
    font-weight: 600;
  }
  
  .progress-bar {
    height: 8px;
    background-color: var(--taskbar-hover);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
  }
  
  .progress {
    height: 100%;
    background-color: var(--win-accent);
    border-radius: 4px;
  }
  
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
  }
  
  .skill-tag {
    background-color: var(--taskbar-active);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.85em;
    color: var(--text-primary);
    transition: background-color 0.2s;
  }
  
  /* Informatic section styles */
  .informatic-section {
    padding: 0 10px;
  }
  
  .informatic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    margin: 20px 0 30px 0;
  }
  
  .informatic-card {
    display: flex;
    gap: 15px;
    padding: 15px;
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    color: var(--text-primary);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .informatic-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  .informatic-icon {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--win-accent);
    color: white;
    flex-shrink: 0;
  }
  
  .icon-placeholder {
    font-size: 22px;
    font-weight: bold;
  }
  
  .informatic-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .informatic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .informatic-name {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-primary);
  }
  
  .informatic-level {
    font-size: 0.85em;
    color: var(--text-secondary);
    background-color: var(--taskbar-active);
    padding: 3px 8px;
    border-radius: 4px;
  }
  
  /* Certifications section styles */
  .certifications-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .certifications-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
  }
  
  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .certification-card-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    display: block;
  }
  
  .certification-card-link.important-cert {
    grid-column: span 2;
  }
  
  .certification-card {
    display: flex;
    gap: 15px;
    padding: 15px;
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    color: var(--text-primary);
    transition: transform 0.2s, box-shadow 0.2s;
    border-left: 4px solid transparent;
  }
  
  .certification-card.important-cert {
    padding: 20px;
    border-left: 4px solid var(--win-accent);
  }
  
  .certification-card:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-medium);
    border-left: 4px solid var(--win-accent);
  }
  
  .certification-card.important-cert:hover {
    transform: translateY(-5px);
    border-left: 4px solid var(--win-accent);
  }
  
  .certification-icon img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
  
  .certification-card.important-cert .certification-icon img {
    width: 60px;
    height: 60px;
  }
  
  .certification-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .certification-name {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
  }
  
  .certification-date {
    color: var(--text-secondary);
  }

  .company-certifications {
    margin-bottom: 30px;
  }
  
  .company-title {
    color: var(--win-accent);
    font-size: 18px;
    margin: 25px 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--taskbar-active);
  }
  
  /* Complementary section styles */
  .complementary-section {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  .complementary-block {
    margin-bottom: 20px;
  }
  
  .complementary-block h2 {
    color: var(--win-accent);
    margin: 0 0 15px 0;
    font-size: 22px;
  }
  
  .complementary-list {
    margin: 0;
    padding-left: 20px;
    color: var(--text-primary);
  }
  
  .complementary-list li {
    margin-bottom: 8px;
  }
  
  .project-item {
    margin-bottom: 20px;
  }
  
  .project-name {
    margin: 0;
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .project-description {
    margin: 5px 0;
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .project-link {
    color: var(--win-accent);
    text-decoration: none;
    font-size: 14px;
  }
  
  .project-link:hover {
    text-decoration: underline;
  }
  
  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    color: var(--text-secondary);
  }

  /* Languages styles */
  .languages-section {
    padding: 0 10px;
  }

  .languages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }

  .language-card {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .language-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }

  .language-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--taskbar-active);
  }

  .language-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--win-accent);
    margin: 0;
  }

  .language-level {
    color: var(--text-secondary);
    font-size: 0.9rem;
    background-color: var(--taskbar-active);
    padding: 4px 8px;
    border-radius: 4px;
  }

  .language-skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .skill-factor-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .skill-factor-title {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 10px;
    min-height: 36px;
    display: flex;
    align-items: center;
  }

  .skill-factor-progress {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .progress-circle {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .progress-circle-bg {
    fill: none;
    stroke: var(--taskbar-active);
    stroke-width: 4;
  }

  .progress-circle-fill {
    fill: none;
    stroke: var(--win-accent);
    stroke-width: 4;
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dasharray 0.3s;
  }

  .progress-circle-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Skills section styles */
  .skills-section {
    padding: 0 10px;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    margin-top: 20px;
  }

  .skill-card {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .skill-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }

  .skill-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--taskbar-active);
  }

  .skill-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--win-accent);
    margin: 0;
  }

  .skill-percentage {
    color: var(--text-secondary);
    font-size: 0.9rem;
    background-color: var(--taskbar-active);
    padding: 4px 8px;
    border-radius: 4px;
  }

  .skill-progress-container {
    width: 100%;
  }

  /* Projects section styles */
  .projects-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 0 10px;
  }
  
  .projects-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .projects-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 100px;
  }
  
  .project-card-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    display: block;
  }
  
  .project-card {
    background-color: var(--window-header);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    border-left: 4px solid transparent;
  }
  
  .project-card:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-medium);
    border-left: 4px solid var(--win-accent);
  }
  
  .project-image {
    width: 220px;
    min-width: 220px;
    height: 140px;
    overflow: hidden;
  }
  
  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  .project-card:hover .project-image img {
    transform: scale(1.05);
  }
  
  .project-details {
    padding: 15px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .project-details h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    color: var(--win-accent);
  }
  
  .project-details p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-primary);
  }
  
  .project-category-title {
    color: var(--text-secondary);
    font-size: 18px;
    margin: 25px 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--taskbar-active);
  }
  
  @media (max-width: 700px) {
    .project-card {
      flex-direction: column;
    }
    
    .project-image {
      width: 100%;
      height: 180px;
    }
    
    .project-card:hover {
      transform: translateY(-5px);
      border-left: none;
      border-top: 4px solid var(--win-accent);
    }
  }

  /* Contact section styles */
  .contact-section {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 0 10px;
  }
  
  .contact-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  
  .contact-form-container, .social-links-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
  }
  
  .contact-form-container h3, .social-links-container h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-size: 18px;
    border-bottom: 1px solid var(--taskbar-hover);
    padding-bottom: 10px;
  }
  
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .form-group label {
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .form-group input, .form-group textarea {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid var(--taskbar-hover);
    background-color: var(--taskbar-bg);
    color: var(--text-primary);
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .form-group input:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--win-accent);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  
  .required-fields {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .send-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: var(--win-accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .send-button:hover {
    background-color: var(--win-start-hover);
  }
  
  .form-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    margin-top: 15px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-message.success {
    background-color: rgba(16, 137, 62, 0.1);
    color: var(--alert-success);
    border: 1px solid var(--alert-success);
  }
  
  .form-message.error {
    background-color: rgba(232, 17, 35, 0.1);
    color: var(--alert-error);
    border: 1px solid var(--alert-error);
  }
  
  /* Social links styles */
  .social-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 10px;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--taskbar-bg);
    color: var(--text-primary);
    text-decoration: none;
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .social-link:hover {
    background-color: var(--taskbar-hover);
    transform: translateX(5px);
  }
  
  .social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  @media (max-width: 768px) {
    .contact-container {
      grid-template-columns: 1fr;
    }
  }

  /* Reviews section styles - chat style */
  .reviews-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
  }
  
  .reviews-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .chat-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .chat-message {
    display: flex;
    gap: 12px;
    max-width: 80%;
  }
  
  .chat-received {
    align-self: flex-start;
  }
  
  .chat-sent {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .message-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .message-header {
    padding: 0 8px;
  }

  .message-header a {
    text-decoration: none;
    color: var(--text-primary);
  }
  
  .message-name {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .message-job {
    font-size: 0.7rem;
    color: var(--text-secondary);
  }
  
  .chat-received .message-name {
    color: var(--win-accent);
  }
  
  .chat-sent .message-name {
    color: #4caf50;
  }
  
  .message-bubble {
    background-color: var(--taskbar-bg);
    padding: 10px 12px;
    border-radius: 12px;
    position: relative;
  }
  
  .chat-received .message-bubble {
    border-top-left-radius: 4px;
    background-color: var(--taskbar-active);
  }
  
  .chat-sent .message-bubble {
    border-top-right-radius: 4px;
    background-color: var(--win-accent);
    color: white;
  }
  
  .message-bubble p {
    margin: 0;
    line-height: 1.4;
    font-size: 0.95rem;
  }

  /* Carrer Timeline styles */
  .carrer-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
  }
  
  .carrer-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .timeline-container {
    position: relative;
    margin: 20px auto;
    padding: 20px 0;
    max-width: 900px;
  }
  
  .timeline-container::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    margin-left: -1px;
    background-color: var(--taskbar-active);
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 50px;
    width: 50%;
    box-sizing: border-box;
  }
  
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  
  .timeline-item.left {
    float: left;
    padding-right: 40px;
    clear: both;
  }
  
  .timeline-item.right {
    float: right;
    padding-left: 40px;
    clear: both;
  }
  
  .timeline-marker {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .timeline-item.left .timeline-marker {
    right: -20px;
  }
  
  .timeline-item.right .timeline-marker {
    left: -20px;
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--win-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 1;
    box-shadow: 0 0 0 4px var(--window-bg);
  }
  
  .timeline-icon.school {
    background-color: #4caf50;
  }
  
  .timeline-icon.work {
    background-color: #2196f3;
  }

  .timeline-content-link {
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
  }
  
  .timeline-content {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  
  .timeline-item.left .timeline-content {
    border-right: 4px solid transparent;
  }
  
  .timeline-item.right .timeline-content {
    border-left: 4px solid transparent;
  }
  
  .timeline-item.left .timeline-content-link:hover .timeline-content {
    transform: translateX(-5px);
    box-shadow: var(--shadow-medium);
    border-right: 4px solid var(--win-accent);
  }
  
  .timeline-item.right .timeline-content-link:hover .timeline-content {
    transform: translateX(5px);
    box-shadow: var(--shadow-medium);
    border-left: 4px solid var(--win-accent);
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .timeline-title {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }
  
  .timeline-date {
    color: var(--text-secondary);
    font-size: 0.9rem;
    background-color: var(--taskbar-active);
    padding: 3px 8px;
    border-radius: 4px;
  }
  
  .timeline-body {
    color: var(--text-primary);
  }
  
  .timeline-body p {
    margin: 0;
    line-height: 1.5;
  }
  
  /* Flechas o triángulos para los elementos de la línea del tiempo */
  .timeline-item.left .timeline-content::after {
    content: '';
    position: absolute;
    top: 10px;
    right: -10px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid var(--window-header);
  }
  
  .timeline-item.right .timeline-content::after {
    content: '';
    position: absolute;
    top: 10px;
    left: -10px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid var(--window-header);
  }
  
  /* Clearfix para los elementos flotantes */
  .timeline-container::after {
    content: "";
    display: table;
    clear: both;
  }
  
  @media (max-width: 768px) {
    .timeline-container::before {
      left: 20px;
    }
    
    .timeline-item {
      width: 100%;
      padding-left: 60px;
      padding-right: 0;
    }
    
    .timeline-item.left, 
    .timeline-item.right {
      float: none;
      clear: both;
      padding-left: 60px;
      padding-right: 0;
    }
    
    .timeline-item.left .timeline-marker,
    .timeline-item.right .timeline-marker {
      left: 0;
      right: auto;
    }
    
    .timeline-item.left .timeline-content::after,
    .timeline-item.right .timeline-content::after {
      left: -10px;
      right: auto;
      border-right: 10px solid var(--window-header);
      border-left: 0;
    }
    
    .timeline-item.left .timeline-content-link:hover .timeline-content,
    .timeline-item.right .timeline-content-link:hover .timeline-content {
      transform: translateX(5px);
      border-left: 4px solid var(--win-accent);
      border-right: none;
    }
  }
</style>