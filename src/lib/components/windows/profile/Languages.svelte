<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  export let languages: any;

</script>

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

<style>

.languages-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .languages-section h2 {
    color: var(--win-accent);
    margin: 0;
    font-size: 22px;
  }
  
  .language-name {
    font-weight: 600;
  }
  
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
</style>