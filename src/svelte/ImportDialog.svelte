<script>
  import lodashIsEmpty from 'lodash/isEmpty.js';
  import lodashIsArray from 'lodash/isArray.js';
  import Button, { Label } from '@smui/button';
  import { mdiFileImport, mdiCheck } from '@mdi/js';
  import Textfield from '@smui/textfield';
  import {
    api,
    constants,
    dialog,
    profile,
    toast,
    userAgent,
    BaseDialog,
    MdiIcon
  } from '@modheader/core';

  const { showImportDialog } = dialog;

  let importText = '';
  let uploadFileInput;

  async function done() {
    try {
      const importedProfiles = await api.parseProfile({ data: importText });
      profile.importProfiles(importedProfiles);
      showImportDialog.set(false);
    } catch (err) {
      toast.showMessage('Failed to import profiles. Please double check your exported profile.');
    }
  }

  function loadFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const importText = event.target.result;
      let importedProfiles = JSON.parse(importText);
      if (!lodashIsArray(importedProfiles)) {
        importedProfiles = [importedProfiles];
      }
      profile.importProfiles(importedProfiles);
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
      {#if userAgent.isChromiumBasedBrowser()}
        <!-- Opening the file would close the popup in Firefox, so we can't support it. -->
        <input
          bind:this={uploadFileInput}
          type="file"
          class="hidden"
          on:change={(e) => loadFile(e.target.files[0])}
        />
        <Button on:click={() => uploadFileInput.click()}>
          <MdiIcon size="24" icon={mdiFileImport} color={constants.PRIMARY_COLOR} />
          <Label class="ml-small">Load from file</Label>
        </Button>
      {/if}
      <Button disabled={lodashIsEmpty(importText)} on:click={() => done()}>
        <MdiIcon
          size="24"
          icon={mdiCheck}
          color={lodashIsEmpty(importText) ? constants.DISABLED_COLOR : constants.PRIMARY_COLOR}
        />
        <Label class="ml-small">Import</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}

<style module>
  .extra-large-textarea {
    width: 400px;
    height: 250px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
