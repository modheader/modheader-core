<script>
  import { mdiFileQuestion } from '@mdi/js';
  import { selectedProfile } from '../js/profile.js';
  import { getActiveTab, getTab } from '../js/tabs.js';
  import Chip from './Chip.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import { createEventDispatcher } from 'svelte';

  const MAX_TITLE_LENGTH = 30;
  const dispatch = createEventDispatcher();
  export let filter;

  async function useCurrentTab() {
    const tab = await getActiveTab();
    filter.tabId = tab.id;
    dispatchChange();
  }

  function shortTitle(title) {
    if (title.length > MAX_TITLE_LENGTH) {
      return title.slice(0, MAX_TITLE_LENGTH) + '...';
    }
    return title;
  }

  function dispatchChange() {
    dispatch('change');
  }
</script>

<div class="data-table-cell flex-grow inline-filter-row">
  {#await getTab(filter.tabId) then tab}
    <Chip fieldName="single-tab" tooltip="Filter by current tab" on:click={() => useCurrentTab()}>
      Use current tab
    </Chip>
    {#if tab.favIconUrl}
      <img
        src={tab.favIconUrl}
        class="vertical-align-text-bottom mx-1"
        width="18"
        height="18"
        alt={tab.title}
      />
    {:else}
      <MdiIcon class="vertical-align-text-bottom" icon={mdiFileQuestion} size="18" color="#888" />
    {/if}
    {#if $selectedProfile.hideComment}
      <span>{shortTitle(tab.title || tab.url || 'Unknown tab')}</span>
    {/if}`
  {:catch error}
    <Chip fieldName="single-tab" tooltip="Filter by current tab" on:click={() => useCurrentTab()}>
      Use current tab
    </Chip>
    <span class="mx-1">Tab no longer exists.</span>
  {/await}
</div>
