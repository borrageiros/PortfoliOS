<script lang="ts">
	import { icons } from '$lib/icons';
	
	export let name = '';
	export let size = '24';
	export let strokeWidth = 2;
	export let color = 'currentColor';
	export let className = '';
  export let viewBox = '0 0 24 24';
</script>

<svg
  width={size}
  height={size}
  viewBox={viewBox}
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="feather {className}"
  {...$$restProps}
>
  {@html icons[name]}
</svg>