<script>
  import lodashIsEmpty from 'lodash/isEmpty.js';
  import lodashIsArray from 'lodash/isArray.js';
  import Button, { Label } from '@smui/button';
  import { mdiFileImport, mdiCheck } from '@mdi/js';
  import Textfield from '@smui/textfield';
  import BaseDialog from './BaseDialog.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import * as api from '../js/api.js';
  import { DISABLED_COLOR, PRIMARY_COLOR } from '../js/constants.js';
  import { showImportDialog } from '../js/dialog.js';
  import { importProfiles } from '../js/profile.js';
  import { showMessage } from '../js/toast.js';
  import { isChromiumBasedBrowser } from '../js/user-agent.js';

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
</script>

{#if $showImportDialog}
  <BaseDialog bind:open={$showImportDialog} title="Import profile">
    <div>Enter the URL / JSON encoded profile here to import.</div>
    <Textfield textarea class="extra-large-textarea" input$rows="40" bind:value={importText} />
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
          <Label class="ml-small">Load from file</Label>
        </Button>
      {/if}
      <Button disabled={lodashIsEmpty(importText)} on:click={() => done()}>
        <MdiIcon
          size="24"
          icon={mdiCheck}
          color={lodashIsEmpty(importText) ? DISABLED_COLOR : PRIMARY_COLOR}
        />
        <Label class="ml-small">Import</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}
