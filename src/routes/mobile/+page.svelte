<script lang="ts">
  import { onMount } from 'svelte';
  import { loadData } from '$lib/helpers';
  import { theme } from '$lib/theme/theme';
  import { locale } from '$lib/i18n/i18n';
  import { t } from '$lib/i18n/i18n';
  import Icon from '$lib/components/Icon.svelte';
  import { sendEmail } from '$lib/api';
  import { profileItems, type ProfileProps } from '$lib/interfaces/profileItems';
  import Information from '$lib/components/windows/profile/Information.svelte';
  import About from '$lib/components/windows/profile/About.svelte';
  import Carrer from '$lib/components/windows/profile/Carrer.svelte';
  import Projects from '$lib/components/windows/profile/Projects.svelte';
  import Languages from '$lib/components/windows/profile/Languages.svelte';
  import Skills from '$lib/components/windows/profile/Skills.svelte';
  import Informatic from '$lib/components/windows/profile/Informatic.svelte';
  import Certifications from '$lib/components/windows/profile/Certifications.svelte';
  import Contact from '$lib/components/windows/profile/Contact.svelte';
  import Reviews from '$lib/components/windows/profile/Reviews.svelte';
  import Complementary from '$lib/components/windows/profile/Complementary.svelte';

  export let initialTab: ProfileProps['initialTab'] = 'information';

  // State to store loaded data
  let information: any = null;
  let about: any = null;
  let projects: any = null;
  let languages: any = null;
  let skills: any = null;
  let informatic: any = null;
  let certifications: any = null;
  let contact: any = null;
  let reviews: any = null;
  let complementary: any = null;
  let carrer: any = null;

  // State for the active menu
  let activeMenu = initialTab;
  
  // State for the collapsible menu
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
    menuOpen = false; // Close menu when selecting an option
  }
  
  // Function to show/hide the menu
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
    
    // Subscribe to language changes to reload data
    const unsubscribe = locale.subscribe(() => {
      loadAllData();
    });
    
    return () => {
      // Cleanup when unmounting the component
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
      <span>{information && information.alias || ''}</span>
    </div>
    <div class="menu-items">
      {#each profileItems as item}
        <div 
          class="menu-item {activeMenu === item.id ? 'active' : ''}" 
          on:click={() => setActiveMenu(item.id as ProfileProps['initialTab'])}
          on:keydown={handleKeydown}
          role="button"
          tabindex="0"
        >
          <Icon name={item.icon} size="18" />
          <span>{$t(item.label)}</span>
        </div>
      {/each}
      
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
      <Information {information} isMobileVersion={true}/>
    {:else if activeMenu === 'about' && about}
      <About {about} isMobileVersion={true}/>
    {:else if activeMenu === 'carrer' && carrer}
      <Carrer {carrer} isMobileVersion={true}/>
    {:else if activeMenu === 'projects' && projects}
        <Projects {projects} isMobileVersion={true}/>
    {:else if activeMenu === 'languages' && languages}
      <Languages {languages} />
    {:else if activeMenu === 'skills' && skills}
      <Skills {skills} />
    {:else if activeMenu === 'informatic' && informatic}
      <Informatic {informatic} />
    {:else if activeMenu === 'certifications' && certifications}
      <Certifications {certifications} />
    {:else if activeMenu === 'contact' && contact}
      <Contact {contact} />
    {:else if activeMenu === 'reviews' && reviews}
      <Reviews {reviews} isMobileVersion={true}/>
    {:else if activeMenu === 'complementary' && complementary}
      <Complementary {complementary} />
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
    padding-bottom: 60px;
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
</style>