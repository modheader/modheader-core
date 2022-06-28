<script>
  import { createEventDispatcher } from 'svelte';

  function selectText() {
    isFocused = true;
    if (selectAllOnFocus) {
      textField.select();
    }
  }

  export function focus() {
    textField.focus();
  }

  function unfocus() {
    isFocused = false;
  }

  const dispatch = createEventDispatcher();
  export let name;
  // ID to the datalist of items the user can select from
  export let list = undefined;
  // the text displayed when no option is selected
  export let placeholder = undefined;
  export let value;
  export let selectAllOnFocus = false;
  let isFocused = false;
  let textField;
</script>

<label
  class="mdc-text-field smui-text-field--standard mdc-text-field--no-label data-table-cell flex-grow autocomplete-input"
>
  <input
    class="mdc-text-field__input"
    bind:this={textField}
    bind:value
    {name}
    type="text"
    {placeholder}
    {list}
    autocomplete="on"
    on:input={() => dispatch('input')}
    on:change={() => dispatch('change')}
    on:focus={selectText}
    on:blur={unfocus}
  />
  <div
    class="mdc-line-ripple"
    class:mdc-line-ripple--active={isFocused}
    style="transform-origin: 50px center;"
  />
</label>
