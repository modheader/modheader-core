<script>
  export let size;
  export let icon;
  export let color;
  export let alt = '';
  let clazz = '';
  export { clazz as class };
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  class="mdi-icon {clazz || ''}"
  fill={color}
  {alt}
  viewBox="0 0 24 24"
>
  <path d={icon} />
</svg>
