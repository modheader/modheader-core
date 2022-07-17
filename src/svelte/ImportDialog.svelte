<script>
  import lodashIsEmpty from 'lodash/isEmpty.js';
  import lodashIsArray from 'lodash/isArray.js';
  import Button, { Label } from '@smui/button';
  import { mdiFileImport, mdiImport } from '@mdi/js';
  import Textfield from '@smui/textfield';
  import BaseDialog from './BaseDialog.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import LockIcon from './LockIcon.svelte';
  import * as api from '../js/api.js';
  import { DISABLED_COLOR, PRIMARY_COLOR } from '../js/constants.js';
  import { isProUser } from '../js/identity.js';
  import { showUpgradeRequired, showImportDialog } from '../js/dialog.js';
  import { importProfiles } from '../js/profile.js';
  import { showMessage } from '../js/toast.js';
  import { openUrl } from '../js/tabs.js';
  import { isChromiumBasedBrowser } from '../js/user-agent.js';
  import { isLiveProfileUrl, reloadLiveProfile } from '../js/profile-sync.js';

  let importText = '';
  let uploadFileInput;

  async function done() {
    try {
      let importedProfiles;
      if (importText.startsWith('[') || importText.startsWith('{')) {
        importedProfiles = JSON.parse(importText);
        if (!lodashIsArray(importedProfiles)) {
          importedProfiles = [importedProfiles];
        }
      } else {
        importedProfiles = await api.parseProfile({ data: importText });
      }
      await importProfiles(importedProfiles);
      showImportDialog.set(false);
    } catch (err) {
      showMessage('Failed to import profiles. Please double check your exported profile.');
    }
  }

  async function enableAutoSync() {
    const updatedProfile = await reloadLiveProfile({
      liveProfileUrl: importText
    });
    if (updatedProfile) {
      await importProfiles([updatedProfile]);
      showImportDialog.set(false);
    } else {
      showMessage('Failed to import profiles. Please double check your URL and permission.');
    }
  }

  function loadFile(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const importText = event.target.result;
      let importedProfiles = JSON.parse(importText);
      if (!lodashIsArray(importedProfiles)) {
        importedProfiles = [importedProfiles];
      }
      await importProfiles(importedProfiles);
      showImportDialog.set(false);
    };
    reader.readAsText(file, 'utf8');
  }

  $: canImportLive = isLiveProfileUrl(importText);
</script>

{#if $showImportDialog}
  <BaseDialog bind:open={$showImportDialog} title="Import profile">
    <div>Enter the URL / JSON encoded profile here to import.</div>
    <Textfield class="extra-large-textarea" textarea input$rows="40" bind:value={importText} />

    <div class="caption">
      Import with auto-sync to periodically reload the profile from the source profile URL. Only
      import auto-sync profile if you trust the profile URL owner.
    </div>
    <div>
      <Button
        disabled={!canImportLive}
        on:click={() => {
          if ($isProUser) {
            enableAutoSync();
          } else {
            showUpgradeRequired('Upgrade to Pro to import auto-sync profile');
          }
        }}
        variant="raised"
      >
        <MdiIcon size="24" icon={mdiImport} color={canImportLive ? '#fff' : DISABLED_COLOR} />
        <Label class="ml-small">Import with auto-sync</Label>
        <LockIcon />
      </Button>
      <Button
        on:click={() =>
          // TODO(hao): Update URL
          openUrl({ url: 'https://docs.modheader.com/profiles/sharing-and-import' })}
      >
        <MdiIcon size="24" icon={mdiImport} color={PRIMARY_COLOR} />
        <Label class="ml-small">Learn more</Label>
      </Button>
    </div>
    <svelte:fragment slot="footer">
      {#if isChromiumBasedBrowser()}
        <!-- Opening the file would close the popup in Firefox, so we can't support it. -->
        <input
          bind:this={uploadFileInput}
          type="file"
          class="hidden"
          on:change={(e) => loadFile(e.target.files[0])}
        />
        <Button on:click={() => uploadFileInput.click()}>
          <MdiIcon size="24" icon={mdiFileImport} color={PRIMARY_COLOR} />
          <Label class="ml-small">Load file</Label>
        </Button>
      {/if}
      <Button disabled={lodashIsEmpty(importText)} on:click={() => done()}>
        <MdiIcon
          size="24"
          icon={mdiImport}
          color={lodashIsEmpty(importText) ? DISABLED_COLOR : PRIMARY_COLOR}
        />
        <Label class="ml-small">Import</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}
