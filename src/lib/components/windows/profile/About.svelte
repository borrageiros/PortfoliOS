<script lang="ts">
  import Icon from '$lib/components/Icon.svelte';
  import { t } from '$lib/i18n/i18n';
  export let about: any;

  export let isMobileVersion = false;
</script>

<div class="about-section" class:mobile={isMobileVersion}>
  <h2 class:mobile={isMobileVersion}>
    <Icon name="profile_about" size="22" />
    <span>{about.title}</span>
  </h2>
  
  <div class="about-layout" class:mobile={isMobileVersion}>
    <div class="top-row" class:mobile={isMobileVersion}>
      <div class="description-container" class:mobile={isMobileVersion}>
        <div class="about-card description-card" class:mobile={isMobileVersion}>
          <p class="description" class:mobile={isMobileVersion}>
            {#each about.description.split('\n') as paragraph, index}
              {paragraph}
              {#if index < about.description.split('\n').length - 1}
                <br />
              {/if}
            {/each}
          </p>
        </div>
      </div>
      
      <div class="about-cards-container" class:mobile={isMobileVersion}>
        <div class="about-card interests-card" class:mobile={isMobileVersion}>
          <div class="about-card-header" class:mobile={isMobileVersion}>
            <Icon name="heart" size="22" />
            <h3 class:mobile={isMobileVersion}>{$t('profile.interests')}</h3>
          </div>
          <div class="about-card-content" class:mobile={isMobileVersion}>
            <ul class="interests-list" class:mobile={isMobileVersion}>
              {#each about.interests as interest}
                <li class:mobile={isMobileVersion}>
                  <div class="interest-item" class:mobile={isMobileVersion}>
                    <div class="interest-bullet" class:mobile={isMobileVersion}></div>
                    <span>{interest}</span>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </div>
        
        <div class="about-card goals-card" class:mobile={isMobileVersion}>
          <div class="about-card-header" class:mobile={isMobileVersion}>
            <Icon name="target" size="22" />
            <h3 class:mobile={isMobileVersion}>{$t('profile.professionalGoals')}</h3>
          </div>
          <div class="about-card-content" class:mobile={isMobileVersion}>
            <ul class="goals-list" class:mobile={isMobileVersion}>
              {#each about.professionalGoals as goal}
                <li class:mobile={isMobileVersion}>
                  <div class="goal-item" class:mobile={isMobileVersion}>
                    <div class="goal-bullet" class:mobile={isMobileVersion}></div>
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
    
    <div class="bottom-row" class:mobile={isMobileVersion}>
      <div class="about-card description-card full-width description2-card" class:mobile={isMobileVersion}>
        <p class="description" class:mobile={isMobileVersion}>
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

<style>
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

  .about-section.mobile {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 10px;
    margin-bottom: 30px;
  }

  .about-section.mobile h2 {
    color: var(--win-accent);
    margin: 0 0 10px 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .about-section.mobile h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-primary);
  }
  
  .top-row.mobile {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .about-card.mobile {
    background-color: var(--window-header);
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .about-card.mobile:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
  }

  .description-card.mobile {
    padding: 16px;
    border-left: 4px solid var(--win-accent);
  }

  .description.mobile {
    line-height: 1.6;
    color: var(--text-primary);
    margin: 0;
    padding: 0;
  }

  .about-card-header.mobile {
    background-color: var(--taskbar-active);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--taskbar-active);
  }

  .interests-card.mobile .about-card-header {
    background-color: rgba(236, 64, 122, 0.2);
    color: #ec407a;
  }

  .goals-card.mobile .about-card-header {
    background-color: rgba(33, 150, 243, 0.2);
    color: #2196f3;
  }

  .description2-card.mobile {
    border-left: 4px solid var(--win-accent);
  }

  .about-card-content.mobile {
    padding: 16px;
  }

  .interests-list.mobile, .goals-list.mobile {
    margin: 0;
    padding: 0;
    list-style: none;
    color: var(--text-primary);
  }

  .interests-list.mobile li, .goals-list.mobile li {
    margin-bottom: 12px;
  }

  .interest-item.mobile, .goal-item.mobile {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .interest-bullet.mobile, .goal-bullet.mobile {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }

  .interest-bullet.mobile {
    background-color: #ec407a;
  }

  .goal-bullet.mobile {
    background-color: #2196f3;
  }
</style>