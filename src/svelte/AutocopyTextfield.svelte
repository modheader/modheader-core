<script>
  import LinearProgress from '@smui/linear-progress';
  import Textfield from '@smui/textfield';
  import { toast } from '@modheader/core';

  export let value;
  export let updating = false;
  export let numRows = 5;

  let textfield;

  export function focus() {
    textfield.focus();
  }

  async function copyExportText(content) {
    textfield.getElement().querySelector('textarea').select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(content);
    } else {
      document.execCommand('copy');
    }
    toast.showMessage('Copied to clipboard!');
  }
</script>

<Textfield
  bind:this={textfield}
  on:focus={() => copyExportText(value)}
  class="export-text-field"
  type="url"
  input$rows={numRows}
  textarea
  readonly
  disabled={updating}
  {value}
/>
{#if updating}
  <LinearProgress indeterminate />
{/if}
