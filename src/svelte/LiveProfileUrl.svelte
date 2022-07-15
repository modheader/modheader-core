<script>
  import Textfield from '@smui/textfield';
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import MdiIcon from './MdiIcon.svelte';
  import { mdiHelpCircle, mdiReload, mdiClose, mdiPause, mdiPlay, mdiPen } from '@mdi/js';
  import { openUrl } from '../js/tabs.js';
  import { setupLiveProfileUrlDialog } from '../js/dialog.js';
  import { updateProfile } from '../js/profile.js';
  import { PRIMARY_COLOR } from '../js/constants.js';
  import { Status, reloadLiveProfile } from '../js/profile-sync.js';

  export let profile;
</script>

{#if profile.liveProfileUrl}
  <div class="mx-1 mt-2">
    <div class="d-flex">
      <Textfield
        variant="outlined"
        label="Auto-sync profile URL:"
        class="flex-grow"
        value={profile.liveProfileUrl}
        input$readonly
      />
      <IconButton on:click={() => setupLiveProfileUrlDialog.set(true)}>
        <MdiIcon size="24" icon={mdiPen} color={PRIMARY_COLOR} />
      </IconButton>
    </div>
    <div class="d-flex mt-1">
      <Button
        on:click={async () => {
          const updatedProfile = await reloadLiveProfile(profile);
          if (updatedProfile) {
            updateProfile(updatedProfile);
          }
        }}
        variant="raised"
        class="me-1"
      >
        <MdiIcon size="24" icon={mdiReload} color="#fff" />
        <Label class="ml-small">Sync</Label>
      </Button>
      {#if profile.liveProfileStatus === Status.ACTIVE}
        <Button
          on:click={() => updateProfile({ liveProfileStatus: Status.PAUSED })}
          variant="raised"
          class="me-1"
          color="secondary"
        >
          <MdiIcon size="24" icon={mdiPause} color="#fff" />
          <Label class="ml-small">Pause</Label>
        </Button>
      {:else}
        <Button
          on:click={() => updateProfile({ liveProfileStatus: Status.ACTIVE })}
          variant="raised"
          class="me-1"
          color="secondary"
        >
          <MdiIcon size="24" icon={mdiPlay} color="#fff" />
          <Label class="ml-small">Resume</Label>
        </Button>
      {/if}
      <Button
        on:click={() => updateProfile({ liveProfileUrl: undefined })}
        variant="raised"
        class="me-1"
        color="secondary"
      >
        <MdiIcon size="24" icon={mdiClose} color="#fff" />
        <Label class="ml-small">Stop</Label>
      </Button>
      <Button
        on:click={() =>
          // TODO(hao): Update URL
          openUrl({ url: 'https://docs.modheader.com/profiles/sharing-and-import' })}
        variant="raised"
        color="secondary"
      >
        <MdiIcon size="24" icon={mdiHelpCircle} color="#fff" />
        <Label class="ml-small">Help</Label>
      </Button>
    </div>
    {#if profile.liveProfileLastSyncTimestamp}
      <div class="mt-1">
        Last sync time: {new Date(profile.liveProfileLastSyncTimestamp).toLocaleString()}
      </div>
    {/if}

    <div class="mt-1">
      {#if profile.liveProfileStatus === Status.ACTIVE}
        Profile auto-sync is on. Changes may be overridden in the next auto-sync.
      {:else}
        Profile auto-sync is off. Click "Resume" to restart auto-sync.
      {/if}
    </div>
  </div>
{/if}
