<script>
  import MdiIcon from './MdiIcon.svelte';
  import { buttonColor } from '../js/profile.js';
  import { mdiAccountCircle } from '@mdi/js';

  export let picture;
  export let size = 48;
</script>

{#if picture}
  <img src={picture} style="border-radius: 50%" width={size} height={size} alt="" />
{:else}
  <MdiIcon icon={mdiAccountCircle} {size} color={$buttonColor} />
{/if}
