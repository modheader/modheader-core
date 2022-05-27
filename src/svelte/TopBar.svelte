<script>
  import TopAppBar, { Row, Section } from '@smui/top-app-bar';
  import Snackbar, { Actions, Label } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';
  import Button from '@smui/button';
  import { mdiShare, mdiUndo } from '@mdi/js';
  import MdiIcon from './MdiIcon.svelte';
  import ProfileBadgeDialog from './ProfileBadgeDialog.svelte';
  import TopBarPauseButton from './TopBarPauseButton.svelte';
  import TopBarSignInButton from './TopBarSignInButton.svelte';
  import { selectedProfile, updateProfile, buttonColor } from '../js/profile.js';
  import { canUndoChange } from '../js/change-stack.js';
  import { undo, isPaused } from '../js/datasource.js';
  import { showExportDialog } from '../js/dialog.js';
  import { requireSignInForExport } from '../js/identity.js';

  let pauseSnackbar;
  let profileBadgeDialog;

  $: {
    if (pauseSnackbar) {
      if ($isPaused) {
        pauseSnackbar.open();
      } else {
        pauseSnackbar.close();
      }
    }
  }
</script>

<ProfileBadgeDialog bind:this={profileBadgeDialog} />

<TopAppBar
  variant="fixed"
  dense
  class="top-bar"
  style="background-color: {$selectedProfile.backgroundColor};"
>
  <Row>
    <Section>
      <IconButton
        dense
        class="top-bar-profile-badge-icon"
        on:click={() => {
          profileBadgeDialog.show();
        }}
        title="Change profile badge"
      >
        <span class="top-bar-profile-badge" style="background: {$selectedProfile.backgroundColor}">
          <span class="top-bar-profile-badge-text" style="color: {$selectedProfile.textColor}">
            {$selectedProfile.shortTitle}
          </span>
        </span>
      </IconButton>

      <input
        class="mdc-text-field__input profile-title"
        style="color: {$selectedProfile.textColor}"
        value={$selectedProfile.title}
        on:input={(event) => updateProfile({ title: event.target.value })}
      />
    </Section>
    <Section align="end">
      {#if $canUndoChange}
        <IconButton dense on:click={() => undo()} title="Undo">
          <MdiIcon size="24" icon={mdiUndo} color={$buttonColor} />
        </IconButton>
      {/if}
      <slot name="add-button" />
      <TopBarPauseButton />
      <IconButton
        dense
        on:click={() => {
          if (requireSignInForExport()) {
            showExportDialog.set(true);
          }
        }}
        title="Export / share profile"
      >
        <MdiIcon size="24" icon={mdiShare} color={$buttonColor} />
      </IconButton>
      <TopBarSignInButton />
      <slot name="more-button" />
    </Section>
  </Row>
</TopAppBar>

<Snackbar timeoutMs={10000} bind:this={pauseSnackbar}>
  <Label>{process.env.PRODUCT_NAME} is Paused</Label>
  <Actions>
    <Button on:click={() => isPaused.set(false)}>Resume</Button>
  </Actions>
</Snackbar>
