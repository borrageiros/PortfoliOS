<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  export let skills: any;

</script>

<div class="skills-section">
  <h2 class="skills-title">
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

<style>
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

  .skills-section {
    padding: 0 10px;
  }

  .skills-title {
    color: var(--win-accent);
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

</style>