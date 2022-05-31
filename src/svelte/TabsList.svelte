<script>
  import { mdiFileQuestion } from '@mdi/js';
  import { selectedProfile } from '../js/profile.js';
  import MdiIcon from './MdiIcon.svelte';

  export let tabs;

  $: maxTabs = $selectedProfile.hideComment ? 6 : 3;
</script>

{#each tabs.slice(0, maxTabs) as tab}
  {#if tab.favIconUrl}
    <img
      src={tab.favIconUrl}
      class="vertical-align-text-bottom me-1"
      width="18"
      height="18"
      alt={tab.title}
    />
  {:else}
    <MdiIcon
      class="vertical-align-text-bottom"
      icon={mdiFileQuestion}
      alt={tab.title}
      size="18"
      color="#888"
    />
  {/if}
{/each}
{#if tabs.length > maxTabs}
  <span>
    {#if $selectedProfile.hideComment}
      and {tabs.length - maxTabs} more...
    {:else}
      +{tabs.length - maxTabs}...
    {/if}
  </span>
{/if}
