<script>
  import '$lib/styles/global.css';
  import '$lib/styles/theme.css';
  import { onMount } from 'svelte';
  import { theme } from '$lib/theme/theme';

  onMount(() => {
    const currentTheme = $theme;
    document.documentElement.classList.add(`${currentTheme}-theme`);
  });
</script>

<slot />
