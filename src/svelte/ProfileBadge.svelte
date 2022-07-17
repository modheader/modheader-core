<script>
  import { mdiCheckboxMarkedCircle, mdiCheckboxBlankCircle, mdiSync, mdiSyncOff } from '@mdi/js';
  import MdiIcon from './MdiIcon.svelte';
  import { selectedProfile } from '../js/profile.js';
  import { PRIMARY_COLOR } from '../js/constants.js';
  import { Status } from '../js/profile-sync.js';

  export let profile;

  $: isActive = profile.alwaysOn || profile === $selectedProfile;
  $: isAutoSyncActive = profile.liveProfileStatus === Status.ACTIVE;
</script>

<span class="profile-badge-icon-container" style="background: {profile.backgroundColor}">
  <span class="profile-badge-icon-text" style="color: {profile.textColor}">
    {profile.shortTitle}
  </span>
  {#if profile.liveProfileUrl}
    <MdiIcon
      class="profile-badge-autosync-status"
      size="12"
      icon={isAutoSyncActive ? mdiSync : mdiSyncOff}
      color={isAutoSyncActive ? PRIMARY_COLOR : 'red'}
    />
  {/if}
  <MdiIcon
    class="profile-badge-status"
    size="12"
    icon={isActive ? mdiCheckboxMarkedCircle : mdiCheckboxBlankCircle}
    color={isActive ? 'green' : 'red'}
  />
</span>
