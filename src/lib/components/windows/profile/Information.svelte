<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  import { locale } from '$lib/i18n/i18n';
  export let information: any;

  export let isMobileVersion = false;

  function calculateAge(dateString: string): number {
    // Format expected: dd/mm/yyyy
    const [day, month, year] = dateString.split('/').map(Number);
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  function generateMapUrl(coordinates: any) {
    if (!coordinates) return '';
    const { lat, lng, location } = coordinates;
    const language = $locale;
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=12&maptype=roadmap&language=${language}`;
  }
</script>

<div class="information-section">
  <h2 class="section-title">
    <Icon name="profile_information" size="22" />
    <span>{$t('profile.information')}</span>
  </h2>
  
  <div class="info-cards-container">
    <div class="personal-info-card" class:mobile={isMobileVersion}>
      <div class="photo-container" class:mobile={isMobileVersion}>
        <img src={information.photo} alt="Profile" />
      </div>
      <div class="info-content" class:mobile={isMobileVersion}>
        <h1 class="person-name" class:mobile={isMobileVersion}>{information.name}</h1>
        
        <div class="info-grid" class:mobile={isMobileVersion}>
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.age')}</div>
            <div class="info-value">{calculateAge(information.birthDate)}</div>
          </div>
          
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.country')}</div>
            <div class="info-value">{information.country}</div>
          </div>
          
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.job')}</div>
            <div class="info-value">{information.job}</div>
          </div>
          
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.currentJob')}</div>
            <div class="info-value">
              <a href={information.currentJob.url} target="_blank" rel="noopener noreferrer" class="info-link">
                {information.currentJob.label}
              </a>
            </div>
          </div>
          
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.phone')}</div>
            <div class="info-value">{information.phone}</div>
          </div>
          
          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.location')}</div>
            <div class="info-value">{information.location}</div>
          </div>

          <div class="info-item" class:mobile={isMobileVersion}>
            <div class="info-label">{$t('profile.email')}</div>
            <div class="info-value">{information.email}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {#if !isMobileVersion}
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
  {/if}
</div>

<style>
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
  
  /* Phone version styles */
  .personal-info-card.mobile {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .photo-container.mobile {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--win-accent);
    margin: 0 auto;
  }
  
  .info-content.mobile {
    flex: 1;
  }
  
  .person-name.mobile {
    color: var(--win-accent);
    text-align: center;
    margin: 0 0 16px 0;
    font-size: 1.5rem;
  }
  
  .info-grid.mobile {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-item.mobile {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  @media (min-width: 600px) {
    .personal-info-card.mobile {
      flex-direction: row;
    }
    
    .photo-container.mobile {
      margin: 0;
    }
    
    .person-name.mobile {
      text-align: left;
    }
    
    .info-grid.mobile {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style> 