<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  export let informatic: any;

</script>

<div class="informatic-section">
  <h2 class="informatic-title">
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
            <div class="informatic-level">{item.level} - {item.percentage}%</div>
          </div>
          <div class="progress-bar">
            <div class="progress" style="width: {item.percentage}%"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
  
  <h2 class="informatic-title">
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

<style>
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
  
  .informatic-section {
    padding: 0 10px;
  }

  .informatic-title {
    color: var(--win-accent);
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
</style>