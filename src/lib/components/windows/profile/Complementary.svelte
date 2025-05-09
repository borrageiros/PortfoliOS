<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  export let complementary: any;

</script>

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

<style>
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
</style>