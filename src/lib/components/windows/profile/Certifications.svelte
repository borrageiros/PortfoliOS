<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';

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

  export let certifications: CertificationData;
</script>

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

<style>
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
</style>