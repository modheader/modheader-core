<script>
  import { mdiCheckboxMarkedCircle, mdiCheckboxBlankCircle } from '@mdi/js';
  import MdiIcon from './MdiIcon.svelte';
  import { selectedProfile } from '../js/profile.js';

  export let profile;

  $: isActive = profile.alwaysOn || profile === $selectedProfile;
</script>

<span class="profile-badge-icon-container" style="background: {profile.backgroundColor}">
  <span class="profile-badge-icon-text" style="color: {profile.textColor}">
    {profile.shortTitle}
  </span>
  <MdiIcon
    class="profile-badge-status"
    size="12"
    icon={isActive ? mdiCheckboxMarkedCircle : mdiCheckboxBlankCircle}
    color={isActive ? 'green' : 'red'}
  />
</span>
