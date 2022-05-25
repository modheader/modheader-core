<script>
  import Tab, { Label as TabLabel } from '@smui/tab';
  import Button, { Label } from '@smui/button';
  import TabBar from '@smui/tab-bar';
  import { mdiContentSave, mdiClose } from '@mdi/js';
  import ColorPicker from './svelte-picker/Picker.svelte';
  import BaseDialog from './BaseDialog.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import { PRIMARY_COLOR } from '../js/constants.js';
  import { selectedProfile, updateProfile } from '../js/profile.js';

  const TABS = [
    { label: 'Background', value: 'backgroundColor' },
    { label: 'Text Color', value: 'textColor' }
  ];
  let dialogVisible;
  let shortTitle;
  let backgroundColor;
  let textColor;
  let shortTitleTextfield;
  let activeTab = TABS[0];

  export function show() {
    backgroundColor = $selectedProfile.backgroundColor;
    textColor = $selectedProfile.textColor;
    shortTitle = $selectedProfile.shortTitle;
    dialogVisible = true;
    shortTitleTextfield.focus();
  }
</script>

{#if dialogVisible}
  <BaseDialog bind:open={dialogVisible} title="Profile badge">
    <div>
      Change badge text:
      <span class="profile-badge-preview" style="background: {backgroundColor}">
        <input
          class="profile-badge-preview-text"
          bind:this={shortTitleTextfield}
          bind:value={shortTitle}
          style="color: {textColor}"
          type="text"
          maxlength="1"
        />
      </span>
    </div>

    <TabBar tabs={TABS} let:tab bind:active={activeTab}>
      <Tab {tab}>
        <TabLabel>{tab.label}</TabLabel>
      </Tab>
    </TabBar>
    <div class="color-picker-container">
      {#if activeTab.value === 'backgroundColor'}
        <ColorPicker
          startColor={$selectedProfile.backgroundColor}
          on:colorchange={(event) => {
            const rgbString = event.detail.hex;
            if (rgbString !== backgroundColor) {
              backgroundColor = rgbString;
            }
          }}
        />
      {:else}
        <ColorPicker
          startColor={$selectedProfile.textColor}
          on:colorchange={(event) => {
            const rgbString = event.detail.hex;
            if (rgbString !== textColor) {
              textColor = rgbString;
            }
          }}
        />
      {/if}
    </div>
    <svelte:fragment slot="footer">
      <Button on:click={() => (dialogVisible = false)}>
        <MdiIcon size="24" icon={mdiClose} color={PRIMARY_COLOR} />
        <Label class="ml-small">Cancel</Label>
      </Button>
      <Button
        on:click={() => {
          updateProfile({
            shortTitle,
            backgroundColor,
            textColor
          });
          dialogVisible = false;
        }}
      >
        <MdiIcon size="24" icon={mdiContentSave} color={PRIMARY_COLOR} />
        <Label class="ml-small">Save</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}

<style module>
  .color-picker-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }

  .profile-badge-preview-text {
    background: none;
    border: none;
    color: white;
    outline: none;
    padding-left: 6px;
    font-size: 20px;
    width: 24px;
  }

  .profile-badge-preview {
    border-radius: 50%;
    display: inline-block;
    width: 24px;
    height: 24px;
  }
</style>
