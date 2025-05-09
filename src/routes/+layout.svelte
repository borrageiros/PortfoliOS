<script>
  import '$lib/styles/global.css';
  import '$lib/styles/theme.css';
  import { onMount } from 'svelte';
  import { theme } from '$lib/theme/theme';
  import { isMobile } from '$lib/helpers';
  import { goto } from '$app/navigation';

  let previousPath = '';
  let isMobileView = false;

  onMount(() => {
    const currentTheme = $theme;
    document.documentElement.classList.add(`${currentTheme}-theme`);
    
    const handleResize = () => {
      const mobileDetected = isMobile();
      
      if (mobileDetected && !isMobileView) {
        previousPath = window.location.href;
        isMobileView = true;
        goto("/mobile");
      } else if (!mobileDetected && isMobileView) {
        isMobileView = false;
        if (previousPath && !previousPath.includes('/mobile')) {
          goto(previousPath);
        } else {
          goto("/login");
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<slot />
