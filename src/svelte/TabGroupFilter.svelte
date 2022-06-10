<script>
  import { getActiveTab, queryTabs } from '../js/tabs.js';
  import Chip from './Chip.svelte';
  import TabsList from './TabsList.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let filter;

  async function useCurrentTabGroup() {
    const tab = await getActiveTab();
    filter.groupId = tab.groupId;
    dispatchChange();
  }

  function dispatchRemove() {
    dispatch('remove');
  }

  function dispatchChange() {
    dispatch('change');
  }
</script>

<div class="data-table-cell flex-grow inline-filter-row">
  {#await queryTabs({ groupId: filter.groupId }) then tabs}
    <Chip fieldName="tab-group" tooltip="Filter by current tab group" on:click={useCurrentTabGroup}
      >Use current tab group</Chip
    >
    {#if tabs.length > 0}
      <TabsList {tabs} />
    {:else}
      <span class="mx-1">Tab group no longer exists</span>
    {/if}
  {/await}
</div>
