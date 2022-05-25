<script>
  import Button, { Label } from '@smui/button';
  import { signIn } from '../js/identity.js';
  import { requireSignInForExportDialog, showExportJsonDialog } from '../js/dialog.js';
  import BaseDialog from './BaseDialog.svelte';
</script>

{#if $requireSignInForExportDialog}
  <BaseDialog bind:open={$requireSignInForExportDialog} title="Sign in required">
    <p>
      Sign in to export / share profile URLs. This allows you to have better control over who can
      access your shared profile URLs.
    </p>
    <p>Alternatively, you can also export your profiles as JSON.</p>

    <svelte:fragment slot="footer">
      <Button
        on:click={() => {
          requireSignInForExportDialog.set(false);
          showExportJsonDialog.set(true);
        }}
      >
        <Label class="ml-small">Export JSON</Label>
      </Button>
      <Button on:click={() => signIn()} variant="raised">
        <Label class="ml-small">SignIn</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}
