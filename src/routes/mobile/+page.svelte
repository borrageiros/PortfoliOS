<script lang="ts">
  import { onMount } from 'svelte';
  import { loadData, calculateAge } from '$lib/helpers';
  import { theme } from '$lib/theme/theme';
  import { locale } from '$lib/i18n/i18n';
  import { t } from '$lib/i18n/i18n';
  import Icon from '$lib/components/Icon.svelte';
  import { sendEmail } from '$lib/api';

  interface ProfileProps {
    initialTab: 'information' | 'about' | 'projects' | 'languages' | 'skills' | 'informatic' | 'certifications' | 'contact' | 'reviews' | 'complementary' | 'carrer';
  }

  // Interfaces para certificaciones
  interface Certification {
    name: string;
    date: string;
    expires?: string;
    url: string;
    icon: string;
    important?: boolean;
  }

  interface CertificationData {
    certifications: Record<string, Certification[]>;
  }

  export let initialTab: ProfileProps['initialTab'] = 'information';

  // State to store loaded data
  let information: any = null;
  let about: any = null;
  let projects: any = null;
  let languages: any = null;
  let skills: any = null;
  let informatic: any = null;
  let certifications: CertificationData | null = null;
  let contact: any = null;
  let reviews: any = null;
  let complementary: any = null;
  let carrer: any = null;

  // State for the active menu
  let activeMenu = initialTab;
  
  // Estado para el menú colapsable
  let menuOpen = false;
  
  // Modal
  let showWelcomeModal = true;
  let selectedTheme = $theme;
  let selectedLocale = $locale;

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
    projects = await loadData('projects');
    languages = await loadData('languages');
    skills = await loadData('skills');
    informatic = await loadData('informatic');
    certifications = await loadData('certifications');
    contact = await loadData('contact');
    reviews = await loadData('reviews');
    complementary = await loadData('complementary');
    carrer = await loadData('carrer');
  }

  // Function to change the active menu
  function setActiveMenu(menu: ProfileProps['initialTab']) {
    activeMenu = menu;
    menuOpen = false; // Cerrar menú al seleccionar una opción
  }
  
  // Función para mostrar/ocultar el menú
  function toggleMenu() {
    menuOpen = !menuOpen;
  }
  
  // Function to apply theme immediately
  function applyTheme(newTheme: 'light' | 'dark') {
    selectedTheme = newTheme;
    theme.set(newTheme);
  }
  
  // Function to apply locale immediately
  function applyLocale(newLocale: 'en' | 'es') {
    selectedLocale = newLocale;
    locale.set(newLocale);
  }
  
  // Function for closing the modal
  function closeWelcomeModal() {
    showWelcomeModal = false;
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

<div class="mobile-profile">
  {#if showWelcomeModal}
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{$t('mobile.desktopRecommendation.title')}</h2>
        </div>
        <div class="modal-content">
          <div class="modal-icon">
            <Icon name="monitor" size="48" />
          </div>
          <p class="modal-message">{$t('mobile.desktopRecommendation.message')}</p>
          
          <div class="preference-section">
            <h3>{$t('mobile.preferences.language')}</h3>
            <div class="preference-options">
              <button 
                class="preference-option {selectedLocale === 'en' ? 'active' : ''}" 
                on:click={() => applyLocale('en')}
              >
                {$t('mobile.preferences.english')}
              </button>
              <button 
                class="preference-option {selectedLocale === 'es' ? 'active' : ''}" 
                on:click={() => applyLocale('es')}
              >
                {$t('mobile.preferences.spanish')}
              </button>
            </div>
          </div>
          
          <div class="preference-section">
            <h3>{$t('mobile.preferences.theme')}</h3>
            <div class="preference-options">
              <button 
                class="preference-option {selectedTheme === 'light' ? 'active' : ''}" 
                on:click={() => applyTheme('light')}
              >
                <Icon name="sun" size="18" />
                <span>{$t('mobile.preferences.light')}</span>
              </button>
              <button 
                class="preference-option {selectedTheme === 'dark' ? 'active' : ''}" 
                on:click={() => applyTheme('dark')}
              >
                <Icon name="moon" size="18" />
                <span>{$t('mobile.preferences.dark')}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-button primary" on:click={closeWelcomeModal}>{$t('mobile.preferences.continue')}</button>
        </div>
      </div>
    </div>
  {/if}

  <header class="profile-header">
    <button class="menu-button" on:click={toggleMenu} aria-label="Menu">
      <Icon name="menu" size="24" />
    </button>
    <h1>{$t(`profile.${activeMenu}`)}</h1>
  </header>
  
  <div class="sidebar" class:open={menuOpen}>
    <div class="menu-header">
      <button class="menu-close" on:click={toggleMenu} aria-label="Close menu">
        <Icon name="x" size="24" />
      </button>
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
      
      <!-- Divider -->
      <div class="menu-separator"></div>
      
      <!-- Preferences -->
      <div class="preferences-section">
        <!-- Change theme -->
        <div class="preference-title">
          <Icon name="sun" size="18" />
          <span>{$t('mobile.preferences.theme')}</span>
        </div>
        <div class="theme-buttons">
          <button 
            class="theme-button {$theme === 'light' ? 'active' : ''}" 
            on:click={() => applyTheme('light')}
            aria-label="Light theme"
          >
            <Icon name="sun" size="16" />
            <span>{$t('mobile.preferences.light')}</span>
          </button>
          <button 
            class="theme-button {$theme === 'dark' ? 'active' : ''}" 
            on:click={() => applyTheme('dark')}
            aria-label="Dark theme"
          >
            <Icon name="moon" size="16" />
            <span>{$t('mobile.preferences.dark')}</span>
          </button>
        </div>
        
        <!-- Change language -->
        <div class="preference-title">
          <Icon name="globe" size="18" />
          <span>{$t('mobile.preferences.language')}</span>
        </div>
        <div class="language-buttons">
          <button 
            class="language-button {$locale === 'en' ? 'active' : ''}" 
            on:click={() => applyLocale('en')}
            aria-label="English"
          >
            <span>{$t('mobile.preferences.english')}</span>
          </button>
          <button 
            class="language-button {$locale === 'es' ? 'active' : ''}" 
            on:click={() => applyLocale('es')}
            aria-label="Español"
          >
            <span>{$t('mobile.preferences.spanish')}</span>
          </button>
        </div>
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
      </div>
    {:else if activeMenu === 'about' && about}
      <div class="about-section">
        <h2>
          <Icon name="profile_about" size="22" />
          <span>{about.title}</span>
        </h2>
        
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
        
        <div class="about-card interests-card">
          <div class="about-card-header">
            <Icon name="heart" size="18" />
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
        
        {#if about.description2}
          <div class="about-card description-card description2-card">
            <p class="description">
              {#each about.description2.split('\n') as paragraph, index}
                {paragraph}
                {#if index < about.description2.split('\n').length - 1}
                  <br />
                {/if}
              {/each}
            </p>
          </div>
        {/if}
        
        <div class="about-card goals-card">
          <div class="about-card-header">
            <Icon name="target" size="18" />
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
            </ul>
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
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress" style="width: {item.percentage}%"></div>
                  </div>
                  <div class="progress-percentage">{item.percentage}%</div>
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
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress" style="width: {item.percentage}%"></div>
                  </div>
                  <div class="progress-percentage">{item.percentage}%</div>
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
    {:else if activeMenu === 'contact' && contact}
      <div class="contact-section">
        <h2>
          <Icon name="profile_contact" size="22" />
          <span>{$t('profile.contact')}</span>
        </h2>
        
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
                  </a>
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
  
  <!-- Overlay para cerrar el menú cuando está abierto -->
  {#if menuOpen}
    <div class="overlay" on:click={toggleMenu} aria-hidden="true"></div>
  {/if}
</div>

<style>
  .mobile-profile {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--window-bg);
    color: var(--text-primary);
    overflow: hidden;
    position: relative;
  }
  
  .profile-header {
    height: 60px;
    background-color: var(--window-header);
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 2;
    position: sticky;
    top: 0;
  }
  
  .menu-button {
    background: none;
    border: none;
    color: var(--text-primary);
    margin-right: 16px;
    padding: 8px;
    cursor: pointer;
  }
  
  .profile-header h1 {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    background-color: var(--window-header);
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .menu-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    border-bottom: 1px solid var(--border-light);
    color: var(--text-primary);
    font-weight: bold;
  }
  
  .menu-close {
    background: none;
    border: none;
    color: var(--text-primary);
    padding: 8px;
    cursor: pointer;
  }
  
  .menu-items {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
    padding-bottom: 20px;
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-header);
    -webkit-overflow-scrolling: touch;
  }
  
  .menu-items::-webkit-scrollbar {
    width: 6px;
  }
  
  .menu-items::-webkit-scrollbar-track {
    background: var(--window-header);
  }
  
  .menu-items::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 3px;
    border: 1px solid var(--window-header);
  }
  
  .menu-items::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--text-primary);
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
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 60px; /* Espacio adicional al final del contenido */
    scrollbar-width: thin;
    scrollbar-color: var(--taskbar-active) var(--window-bg);
  }
  
  .content-area::-webkit-scrollbar {
    width: 6px;
  }
  
  .content-area::-webkit-scrollbar-track {
    background: var(--window-bg);
  }
  
  .content-area::-webkit-scrollbar-thumb {
    background-color: var(--taskbar-active);
    border-radius: 3px;
    border: 1px solid var(--window-bg);
  }
  
  .content-area::-webkit-scrollbar-thumb:hover {
    background-color: var(--win-accent);
  }
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  /* Card styles */
  .info-cards-container,
  .certifications-grid,
  .informatic-grid,
  .skills-grid,
  .languages-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
  
  .personal-info-card,
  .certification-card,
  .informatic-card,
  .skill-card,
  .language-card {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--shadow-light);
  }
  
  .personal-info-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .photo-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--win-accent);
    margin: 0 auto;
  }
  
  .photo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .info-content {
    flex: 1;
  }
  
  .person-name {
    color: var(--win-accent);
    text-align: center;
    margin: 0 0 16px 0;
    font-size: 1.5rem;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
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
  
  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--win-accent);
    margin: 24px 0 16px 0;
    font-size: 1.3rem;
  }
  
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0 8px 0;
    font-size: 1.1rem;
  }
  
  /* Section-specific styles */
  .certification-card {
    display: flex;
    gap: 12px;
  }
  
  .certification-icon img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
  
  .description {
    line-height: 1.6;
  }
  
  .progress-bar {
    height: 8px;
    background-color: var(--taskbar-hover);
    border-radius: 4px;
    overflow: hidden;
    margin: 8px 0;
  }
  
  .progress {
    height: 100%;
    background-color: var(--win-accent);
    border-radius: 4px;
  }
  
  .language-skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
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
  
  /* Responsive adjustments */
  @media (min-width: 600px) {
    .personal-info-card {
      flex-direction: row;
    }
    
    .photo-container {
      margin: 0;
    }
    
    .person-name {
      text-align: left;
    }
    
    .info-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .informatic-grid,
    .skills-grid,
    .certifications-grid,
    .languages-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }
  
  /* Loading state */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70vh;
    font-size: 1.2rem;
    color: var(--text-secondary);
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .modal-container {
    width: 90%;
    max-width: 420px;
    background-color: var(--window-header);
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-light);
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.3rem;
    color: var(--text-primary);
    display: block;
    text-align: center;
  }
  
  .modal-content {
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .modal-icon {
    color: var(--win-accent);
    margin-bottom: 8px;
  }
  
  .modal-message {
    text-align: center;
    line-height: 1.5;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .modal-footer {
    padding: 16px;
    border-top: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .modal-button {
    padding: 12px 20px;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
    width: 100%;
    text-align: center;
    text-decoration: none;
  }
  
  .modal-button.primary {
    background-color: var(--win-accent);
    color: white;
  }
  
  .preference-section {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .preference-section h3 {
    margin: 0 0 12px 0;
    font-size: 1.1rem;
    color: var(--text-primary);
    display: block;
  }
  
  .preference-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }
  
  .preference-option {
    flex: 1;
    min-width: 80px;
    padding: 10px;
    border: 1px solid var(--border-light);
    border-radius: 6px;
    background-color: transparent;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }
  
  .preference-option.active {
    background-color: var(--win-accent);
    color: white;
    border-color: var(--win-accent);
  }
  
  @media (min-width: 480px) {
    .modal-footer {
      flex-direction: row;
    }
  }
  
  /* Projects section styles */
  .projects-section {
    padding: 0 10px;
  }
  
  .projects-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 60px; /* Espacio adicional al final de la sección de proyectos */
  }
  
  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
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
    flex-direction: column;
    border-left: 4px solid transparent;
  }
  
  .project-card:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-medium);
    border-left: 4px solid var(--win-accent);
  }
  
  .project-image {
    width: 100%;
    height: 160px;
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
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .project-details h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    color: var(--win-accent);
  }
  
  .project-details p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-primary);
  }
  
  .project-category-title {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 20px 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--taskbar-active);
  }
  
  @media (min-width: 600px) {
    .project-card {
      flex-direction: row;
    }
    
    .project-image {
      width: 200px;
      min-width: 200px;
      height: 140px;
    }
  }

  /* Contact section styles */
  .contact-section {
    padding: 0 10px;
    margin-bottom: 60px; /* Espacio adicional al final de la sección de contacto */
  }
  
  .contact-form-container, .social-links-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--shadow-light);
    margin-top: 16px;
    margin-bottom: 16px;
  }
  
  .contact-form-container h3, .social-links-container h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--text-primary);
    font-size: 1.1rem;
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
    flex-direction: column;
    gap: 10px;
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
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
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
    gap: 10px;
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
  
  @media (min-width: 600px) {
    .form-footer {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    
    .send-button {
      width: auto;
    }
  }

  /* Reviews section styles */
  .reviews-section {
    padding: 0 10px;
  }
  
  .chat-container {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
    margin-bottom: 60px; /* Espacio adicional al final de la sección de reviews */
    max-height: none; /* Eliminar la altura máxima que limita el scroll */
    overflow-y: visible; /* Permitir que el contenido se expanda naturalmente */
  }
  
  .chat-message {
    display: flex;
    gap: 12px;
    max-width: 95%;
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

  /* Complementary section styles */
  .complementary-section {
    margin-bottom: 60px; /* Espacio adicional al final de la sección complementaria */
  }

  /* Languages section styles */
  .languages-section {
    padding: 0 10px;
  }

  .language-card {
    text-align: center;
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
    gap: 16px;
    margin-top: 16px;
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
    justify-content: center;
    text-align: center;
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
  }
  
  .progress-circle-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Skills section styles */
  .skills-section {
    padding: 0 10px;
  }
  
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 25px;
    margin-top: 20px;
    margin-bottom: 40px;
    width: 100%;
  }
  
  .skill-card {
    background-color: var(--window-header);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
    white-space: nowrap;
  }
  
  .skill-progress-container {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .progress-bar {
    height: 8px;
    background-color: var(--taskbar-hover);
    border-radius: 4px;
    overflow: hidden;
    margin: 8px 0;
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
    background-color: var(--taskbar-hover);
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 0.85em;
    color: var(--text-primary);
    transition: background-color 0.2s;
    display: inline-block;
  }
  
  .skill-tag:hover {
    background-color: var(--taskbar-active);
  }

  /* Informatic section styles */
  .informatic-section {
    padding: 0 10px;
    margin-bottom: 30px;
  }
  
  .informatic-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 20px 0;
    width: 100%;
  }
  
  .informatic-card {
    display: flex;
    gap: 15px;
    padding: 16px;
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    color: var(--text-primary);
    transition: transform 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
  }
  
  .informatic-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-medium);
  }
  
  .informatic-icon {
    width: 45px;
    height: 45px;
    min-width: 45px;
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
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  
  .informatic-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }
  
  .informatic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
  }
  
  .informatic-name {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-primary);
    margin-right: 8px;
  }
  
  .informatic-level {
    font-size: 0.8rem;
    color: var(--text-secondary);
    background-color: var(--taskbar-active);
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }
  
  .progress-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background-color: var(--taskbar-hover);
    border-radius: 4px;
    overflow: hidden;
    margin: 0;
  }
  
  .progress {
    height: 100%;
    background-color: var(--win-accent);
    border-radius: 4px;
  }
  
  .progress-percentage {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
    min-width: 42px;
    text-align: right;
  }
  
  .informatic-section h2 {
    margin-top: 30px;
    margin-bottom: 15px;
  }
  
  .informatic-section h2:first-child {
    margin-top: 10px;
  }

  /* Certifications section styles */
  .certifications-section {
    padding: 0 10px;
    margin-bottom: 30px;
  }
  
  .certifications-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
  }
  
  .certification-card-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    display: block;
    margin-bottom: 15px;
  }
  
  .certification-card-link.important-cert {
    grid-column: span 2;
  }
  
  .certification-card {
    display: flex;
    gap: 15px;
    padding: 16px;
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    transition: transform 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
    align-items: flex-start;
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
  
  .certification-icon {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .certification-card.important-cert .certification-icon img {
    width: 60px;
    height: 60px;
  }
  
  .certification-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .certification-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .certification-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .certification-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .certification-date,
  .certification-expires {
    font-size: 0.9rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .company-certifications {
    margin-bottom: 30px;
  }
  
  .company-title {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 20px 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--taskbar-active);
  }
  
  @media (min-width: 600px) {
    .certifications-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  .menu-separator {
    height: 1px;
    background-color: var(--border-light);
    margin: 15px 20px;
  }
  
  .preferences-section {
    padding: 0 20px;
    padding-bottom: 30px;
  }
  
  .preference-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 15px;
    margin-bottom: 10px;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .theme-buttons, .language-buttons {
    display: flex;
    gap: 8px;
    width: 100%;
  }
  
  .theme-button, .language-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    background-color: var(--taskbar-bg);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .theme-button.active, .language-button.active {
    background-color: var(--win-accent);
    color: white;
    border-color: var(--win-accent);
  }

  /* Carrer Timeline styles */
  .carrer-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 10px;
    margin-bottom: 60px; /* Espacio adicional al final de la sección */
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
  
  /* Estilos responsivos para la línea de tiempo */
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

  /* About section styles for mobile */
  .about-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 10px;
    margin-bottom: 30px;
  }

  .about-section h2 {
    color: var(--win-accent);
    margin: 0 0 10px 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .about-section h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }

  .about-card {
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .about-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }

  .description-card {
    padding: 16px;
    border-left: 4px solid var(--win-accent);
  }

  .description {
    line-height: 1.6;
    color: var(--text-primary);
    margin: 0;
  }

  .about-card-header {
    background-color: var(--taskbar-active);
    padding: 12px 16px;
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

  .description2-card {
    border-left: 4px solid var(--win-accent);
  }

  .about-card-content {
    padding: 16px;
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
</style>