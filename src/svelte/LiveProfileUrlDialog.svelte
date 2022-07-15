<script>
  import Button, { Label } from '@smui/button';
  import Textfield from '@smui/textfield';
  import { mdiImport } from '@mdi/js';
  import BaseDialog from './BaseDialog.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import LockIcon from './LockIcon.svelte';
  import { DISABLED_COLOR } from '../js/constants.js';
  import { isProUser } from '../js/identity.js';
  import { setupLiveProfileUrlDialog, showUpgradeRequired } from '../js/dialog.js';
  import { updateProfile, selectedProfile } from '../js/profile.js';
  import { showMessage } from '../js/toast.js';
  import { reloadLiveProfile } from '../js/profile-sync.js';

  let importText = '';

  async function enableAutoSync() {
    const updatedProfile = await reloadLiveProfile({
      ...$selectedProfile,
      liveProfileUrl: importText
    });
    if (updatedProfile) {
      updateProfile(updatedProfile);
      setupLiveProfileUrlDialog.set(false);
    } else {
      showMessage('Failed to import profiles. Please double check your URL.');
    }
  }

  setupLiveProfileUrlDialog.subscribe((val) => {
    if (val) {
      importText = $selectedProfile.liveProfileUrl;
    }
  });

  $: canImportLive =
    importText && (importText.startsWith('https://') || importText.startsWith('http://'));
</script>

{#if $setupLiveProfileUrlDialog}
  <BaseDialog bind:open={$setupLiveProfileUrlDialog} title="Setup auto-sync profile">
    <Textfield
      bind:value={importText}
      class="mt-1 d-flex"
      variant="outlined"
      label="Auto-sync profile URL:"
    />

    <div class="caption">
      When auto-sync is enabled, the profile will automatically update itself to keep in sync with
      the source profile URL. Only enter the profile URL where you trust the profile URL owner.
    </div>
    <svelte:fragment slot="footer">
      <Button
        disabled={!canImportLive}
        on:click={() => {
          if ($isProUser) {
            enableAutoSync();
          } else {
            showUpgradeRequired('Upgrade to Pro to enable auto-sync profile');
          }
        }}
        variant="raised"
      >
        <MdiIcon size="24" icon={mdiImport} color={canImportLive ? '#fff' : DISABLED_COLOR} />
        <Label class="ml-small">Enable</Label>
        <LockIcon />
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}
