<script>
  import Dialog, { Title, Content } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import { mdiClose } from '@mdi/js';
  import MdiIcon from './MdiIcon.svelte';

  export let open = false;
  export let showCloseButton = true;
  export let title;
  export let largeDialog = false;
  let dialog;
</script>

<Dialog
  bind:open
  bind:this={dialog}
  container$class={largeDialog ? 'large-dialog' : undefined}
  surface$class={largeDialog ? 'large-dialog' : undefined}
>
  <Title>
    {title}
    {#if showCloseButton}
      <IconButton class="dialog-close-button" on:click={() => dialog.setOpen(false)}>
        <MdiIcon size="32" icon={mdiClose} color="#888" />
      </IconButton>
    {/if}
  </Title>
  <Content>
    <slot />
  </Content>

  <div class="mdc-dialog__actions">
    <slot name="footer" />
  </div>
</Dialog>
