<script>
  import Button, { Label } from '@smui/button';
  import lodashIsEqual from 'lodash/isEqual';
  import AutocopyTextfield from './AutocopyTextfield.svelte';
  import BaseDialog from './BaseDialog.svelte';
  import ExportJsonDialog from './ExportJsonDialog.svelte';
  import {
    createProfile as createProfileApi,
    getProfile as getProfileApi,
    updateProfile as updateProfileApi
  } from '../js/api.js';
  import { showExportDialog, showExportJsonDialog } from '../js/dialog.js';
  import { selectedProfile, exportProfile, updateProfile } from '../js/profile.js';
  import { openUrl } from '../js/tabs.js';
  import { showMessage } from '../js/toast.js';

  let exportTextfield;
  let visibilitySummary;
  let showOverrideDialog;
  const keepStyles = true;

  let exportUrl = '';
  let uploading;

  showExportDialog.subscribe(async (isShown) => {
    if (isShown) {
      await onDialogShown();
    }
  });

  async function onDialogShown() {
    exportUrl = 'Generating export URL';
    uploading = true;
    if ($selectedProfile.profileId) {
      try {
        const profileResponse = await getProfileApi({ profileId: $selectedProfile.profileId });
        visibilitySummary = profileResponse.visibilitySummary;
        exportUrl = profileResponse.profileUrl;
        if (
          !lodashIsEqual(profileResponse.profile, exportProfile($selectedProfile, { keepStyles }))
        ) {
          showOverrideDialog = true;
        }
        uploading = false;
        return;
      } catch (err) {
        if (err.statusCode !== 404) {
          exportUrl = 'Failed to retrieve profile from URL. Please try again later.';
          uploading = false;
          return;
        }
      }
    }
    await createProfileUrl();
  }

  async function createProfileUrl() {
    try {
      const profileResponse = await createProfileApi({
        profile: await exportProfile($selectedProfile, { keepStyles })
      });
      updateProfile({ profileId: profileResponse.profileId });
      visibilitySummary = profileResponse.visibilitySummary;
      exportUrl = profileResponse.profileUrl;
    } catch (err) {
      exportUrl = 'Failed to generate export URL';
    } finally {
      uploading = false;
    }
  }

  async function updateExportProfile() {
    uploading = true;
    try {
      const profileResponse = await updateProfileApi({
        profileId: $selectedProfile.profileId,
        profile: await exportProfile($selectedProfile, { keepStyles })
      });
      visibilitySummary = profileResponse.visibilitySummary;
      exportUrl = profileResponse.profileUrl;
    } catch (err) {
      showMessage('Failed to update exported profiles');
    } finally {
      uploading = false;
    }
  }
</script>

{#if $showExportDialog}
  <BaseDialog bind:open={$showExportDialog} title="Share with people">
    <div class="export-dialog-content">
      <AutocopyTextfield
        bind:this={exportTextfield}
        value={exportUrl}
        updating={uploading}
        numRows={2}
      />

      {#if visibilitySummary}
        <div class="caption">{visibilitySummary}</div>
      {/if}

      <Button on:click={() => openUrl({ url: exportUrl })}>
        <Label class="ml-small">Change visibility</Label>
      </Button>
    </div>
    <svelte:fragment slot="footer">
      <Button
        on:click={() => {
          showExportDialog.set(false);
          showExportJsonDialog.set(true);
        }}
      >
        <Label class="ml-small">Export JSON</Label>
      </Button>
      <Button on:click={() => exportTextfield.focus()} variant="raised">
        <Label class="ml-small">Copy URL</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>

  <BaseDialog bind:open={showOverrideDialog} title="Override existing profile?">
    <div class="export-dialog-content">
      <div>
        This profile has already been exported to {exportUrl}. Would you like to create a new
        shareable URL, or override the existing one?
      </div>

      <div>
        <Button on:click={() => openUrl({ url: exportUrl })}>
          <Label class="ml-small">View existing profile</Label>
        </Button>
      </div>
    </div>
    <svelte:fragment slot="footer">
      <Button
        on:click={async () => {
          showOverrideDialog = false;
          await createProfileUrl();
        }}
      >
        <Label>Create new URL</Label>
      </Button>
      <Button
        variant="raised"
        on:click={async () => {
          showOverrideDialog = false;
          await updateExportProfile();
        }}
      >
        <Label>Override profile</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}

<ExportJsonDialog />
