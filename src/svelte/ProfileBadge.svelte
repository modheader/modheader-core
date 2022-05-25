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

<style module>
  .profile-badge-icon-container {
    color: white;
    font-size: 16px;
    border: 2px solid white;
    border-radius: 50%;
    margin: 10px 4px;
    width: 24px;
    min-width: 24px;
    height: 24px;
  }

  .profile-badge-icon-text {
    margin-top: 1px;
    width: 24px;
    display: flex;
    justify-content: center;
  }

  .profile-badge-status {
    background-color: white;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
