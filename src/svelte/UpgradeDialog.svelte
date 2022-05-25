<script>
  import Button, { Label } from '@smui/button';
  import { upgrade } from '../js/identity.js';
  import { showUpgradeDialog, upgradeDialogString } from '../js/dialog.js';
  import BaseDialog from './BaseDialog.svelte';
</script>

{#if $showUpgradeDialog}
  <BaseDialog bind:open={$showUpgradeDialog} title="Upgrade required">
    <div>{$upgradeDialogString}</div>
    <svelte:fragment slot="footer">
      <Button on:click={() => upgrade()}>
        <Label class="ml-small">Learn more</Label>
      </Button>
    </svelte:fragment>
  </BaseDialog>
{/if}
