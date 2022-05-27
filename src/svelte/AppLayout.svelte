<script>
  import { AppContent } from '@smui/drawer';
  import Snackbar, { Actions, Label as SnackbarLabel } from '@smui/snackbar';
  import IconButton from '@smui/icon-button';
  import Button from '@smui/button';
  import { mdiClose } from '@mdi/js';
  import { onDestroy, onMount } from 'svelte';
  import Drawer from './Drawer.svelte';
  import ExportDialog from './ExportDialog.svelte';
  import ImportDialog from './ImportDialog.svelte';
  import MdiIcon from './MdiIcon.svelte';
  import SignInRequiredDialog from './SignInRequiredDialog.svelte';
  import UpgradeDialog from './UpgradeDialog.svelte';
  import { reloadColorScheme } from '../js/color-scheme.js';
  import { selectedProfile, save } from '../js/profile.js';
  import { undo, init } from '../js/datasource.js';
  import { toastMessage, undoable } from '../js/toast.js';

  let snackbar;
  let snackbarMessage;

  window.addEventListener('unload', save);

  const unsubscribeToastMessage = toastMessage.subscribe((message) => {
    if (snackbar) {
      snackbarMessage = message;
      if (message.length > 0) {
        snackbar.open();
      } else {
        snackbar.close();
      }
    }
  });

  onMount(() => reloadColorScheme());

  onDestroy(unsubscribeToastMessage);
</script>

{#await init() then initResult}
  <Drawer />

  <AppContent class="app-content" style="--separator-color: {$selectedProfile.backgroundColor};">
    <slot />
  </AppContent>

  <ExportDialog />
  <ImportDialog />
  <UpgradeDialog />
  <SignInRequiredDialog />

  <Snackbar timeoutMs={4000} bind:this={snackbar} labelText={snackbarMessage}>
    <SnackbarLabel />
    <Actions>
      {#if $undoable}
        <Button on:click={() => undo()}>Undo</Button>
      {/if}
      <IconButton dense on:click={() => snackbar.close()} title="Dismiss">
        <MdiIcon size="24" icon={mdiClose} color="#888" />
      </IconButton>
    </Actions>
  </Snackbar>
{/await}
