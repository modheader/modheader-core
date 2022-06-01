<script>
  import Bluebird from 'bluebird';
  import { encode } from 'js-base64';
  import Button, { Label } from '@smui/button';
  import FormField from '@smui/form-field';
  import Checkbox from '@smui/checkbox';
  import List, { Meta, Item, Label as ListLabel } from '@smui/list';
  import AutocopyTextfield from './AutocopyTextfield.svelte';
  import BaseDialog from './BaseDialog.svelte';
  import { profiles } from '../js/datasource.js';
  import { showExportJsonDialog } from '../js/dialog.js';
  import { selectedProfile, exportProfile } from '../js/profile.js';

  let selectedProfiles = [];
  let keepStyles = false;
  let exportedText = '';

  showExportJsonDialog.subscribe((show) => {
    if (show) {
      selectedProfiles = [$selectedProfile];
    }
  });

  async function updateExportedText(selectedProfiles, keepStyles) {
    exportedText = JSON.stringify(
      await Bluebird.map(selectedProfiles, (profile) => exportProfile(profile, { keepStyles }))
    );
  }

  $: updateExportedText(selectedProfiles, keepStyles);
</script>

{#if $showExportJsonDialog}
  <BaseDialog bind:open={$showExportJsonDialog} title="Export / share selected profile(s)">
    <div class="export-json-dialog-content">
      <List checklist>
        {#each $profiles as profile}
          <Item>
            <Meta>
              <Checkbox bind:group={selectedProfiles} value={profile} />
            </Meta>
            <ListLabel>{profile.title}</ListLabel>
          </Item>
        {/each}
      </List>

      <AutocopyTextfield value={exportedText} numRows={5} />
    </div>
    <div class="caption">Be careful about sharing sensitive data, e.g. auth token / cookies!</div>

    <div slot="footer">
      <FormField>
        <Checkbox bind:checked={keepStyles} color="secondary" />
        <span slot="label" class="clickable">Export styles</span>
      </FormField>
      {#if $profiles.length > 1}
        <Button on:click={() => (selectedProfiles = [...$profiles])}>
          <Label class="ml-small">Select all</Label>
        </Button>
      {/if}
      {#if selectedProfiles.length === 0}
        <Button disabled>
          <Label class="ml-small">Download JSON</Label>
        </Button>
      {:else}
        <Button
          href="data:application/json;base64,{encode(exportedText)}"
          download="{selectedProfiles.map((p) => p.title).join('+')}.json"
        >
          <Label class="ml-small">Download JSON</Label>
        </Button>
      {/if}
    </div>
  </BaseDialog>
{/if}
