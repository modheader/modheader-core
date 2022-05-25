<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  // colorChange

  import { rgb2hex } from './utils.js';

  import Base from './Base.svelte';

  let base;

  export let startColor;
  let className = '';
  export { className as class };

  let isFirstChange = true;
  const handleChange = ({ detail }) => {
    if (isFirstChange) {
      isFirstChange = false;
      return;
    }
    const color = { ...detail, hex: rgb2hex(detail) };
    dispatch('colorchange', color);
  };
</script>

<Base bind:this={base} class={className} {startColor} on:colorchange={handleChange} />
