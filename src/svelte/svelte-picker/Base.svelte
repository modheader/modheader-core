<script>
  import { onMount, createEventDispatcher } from 'svelte';

  let className = '';
  export { className as class };

  export let startColor = '#ff0000';

  onMount(() => {
    document.addEventListener('mouseup', mouseUp);
    document.addEventListener('touchend', mouseUp);
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('touchmove', touchMove);
    document.addEventListener('touchstart', killMouseEvents);
    document.addEventListener('mousedown', killTouchEvents);
    setStartColor();
  });

  // DOM
  let colorSquarePicker;
  let colorSquareEvent;
  let alphaPicker;
  let alphaEvent;
  let huePicker;
  let hueEvent;
  let colorSquare;

  const dispatch = createEventDispatcher();
  let tracked;
  let h = 1;
  let s = 1;
  let v = 1;
  let a = 1;
  let r = 255;
  let g = 0;
  let b = 0;
  let hexValue = '#ff0000';

  function setStartColor() {
    let hex = startColor.replace('#', '');
    if (hex.length !== 6 && hex.length !== 3 && !hex.match(/([^A-F0-9])/gi)) {
      throw new Error(`Invalid property value startColor ${startColor}`);
    }
    let hexFiltered = '';
    if (hex.length === 3)
      hex.split('').forEach((c) => {
        hexFiltered += c + c;
      });
    else hexFiltered = hex;
    hexValue = hexFiltered;
    r = parseInt(hexFiltered.substring(0, 2), 16);
    g = parseInt(hexFiltered.substring(2, 4), 16);
    b = parseInt(hexFiltered.substring(4, 6), 16);
    rgbToHSV(r, g, b, true);
    updateCsPicker();
    updateHuePicker();
  }

  function killMouseEvents() {
    colorSquareEvent.removeEventListener('mousedown', csDown);
    hueEvent.removeEventListener('mousedown', hueDown);
    document.removeEventListener('mouseup', mouseUp);
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('touchstart', killMouseEvents);
    document.removeEventListener('mousedown', killTouchEvents);
  }

  function killTouchEvents() {
    colorSquareEvent.removeEventListener('touchstart', csDownTouch);
    hueEvent.removeEventListener('touchstart', hueDownTouch);
    document.removeEventListener('touchend', mouseUp);
    document.removeEventListener('touchmove', touchMove);
    document.removeEventListener('touchstart', killMouseEvents);
    document.removeEventListener('mousedown', killTouchEvents);
  }

  function updateCsPicker() {
    let xPercentage = s * 100;
    let yPercentage = (1 - v) * 100;
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
  }

  function updateHuePicker() {
    let xPercentage = h * 100;
    huePicker.style.left = xPercentage + '%';
  }

  function colorChangeCallback() {
    dispatch('colorchange', {
      r: r,
      g: g,
      b: b,
      a: a
    });
  }

  function mouseMove(event) {
    if (tracked) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let trackedPos = tracked.getBoundingClientRect();
      let xPercentage, yPercentage;
      switch (tracked) {
        case colorSquareEvent:
          xPercentage = ((mouseX - trackedPos.x) / 240) * 100;
          yPercentage = ((mouseY - trackedPos.y) / 160) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          yPercentage > 100 ? (yPercentage = 100) : yPercentage < 0 ? (yPercentage = 0) : null;
          yPercentage = yPercentage.toFixed(2);
          xPercentage = xPercentage.toFixed(2);
          colorSquarePicker.style.top = yPercentage + '%';
          colorSquarePicker.style.left = xPercentage + '%';
          s = xPercentage / 100;
          v = 1 - yPercentage / 100;
          colorChange();
          break;
        case hueEvent:
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          xPercentage = xPercentage.toFixed(2);
          huePicker.style.left = xPercentage + '%';
          h = xPercentage / 100;
          hueChange();
          break;
        case alphaEvent:
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          xPercentage = xPercentage.toFixed(2);
          alphaPicker.style.left = xPercentage + '%';
          a = xPercentage / 100;
          colorChange();
          break;
      }
    }
  }

  function touchMove(event) {
    if (tracked) {
      let mouseX = event.touches[0].clientX;
      let mouseY = event.touches[0].clientY;
      let trackedPos = tracked.getBoundingClientRect();
      let xPercentage, yPercentage;
      switch (tracked) {
        case colorSquareEvent:
          xPercentage = ((mouseX - trackedPos.x) / 240) * 100;
          yPercentage = ((mouseY - trackedPos.y) / 160) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          yPercentage > 100 ? (yPercentage = 100) : yPercentage < 0 ? (yPercentage = 0) : null;
          yPercentage = yPercentage.toFixed(2);
          xPercentage = xPercentage.toFixed(2);
          colorSquarePicker.style.top = yPercentage + '%';
          colorSquarePicker.style.left = xPercentage + '%';
          s = xPercentage / 100;
          v = 1 - yPercentage / 100;
          colorChange();
          break;
        case hueEvent:
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          xPercentage = xPercentage.toFixed(2);
          huePicker.style.left = xPercentage + '%';
          h = xPercentage / 100;
          hueChange();
          break;
        case alphaEvent:
          xPercentage = ((mouseX - 10 - trackedPos.x) / 220) * 100;
          xPercentage > 100 ? (xPercentage = 100) : xPercentage < 0 ? (xPercentage = 0) : null;
          xPercentage = xPercentage.toFixed(2);
          alphaPicker.style.left = xPercentage + '%';
          a = xPercentage / 100;
          colorChange();
          break;
      }
    }
  }

  function csDown(event) {
    tracked = event.currentTarget;
    let xPercentage = ((event.offsetX + 1) / 240) * 100;
    let yPercentage = ((event.offsetY + 1) / 160) * 100;
    yPercentage = yPercentage.toFixed(2);
    xPercentage = xPercentage.toFixed(2);
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
    s = xPercentage / 100;
    v = 1 - yPercentage / 100;
    colorChange();
  }

  function csDownTouch(event) {
    tracked = event.currentTarget;
    let rect = event.target.getBoundingClientRect();
    let offsetX = event.targetTouches[0].clientX - rect.left;
    let offsetY = event.targetTouches[0].clientY - rect.top;
    let xPercentage = ((offsetX + 1) / 240) * 100;
    let yPercentage = ((offsetY + 1) / 160) * 100;
    yPercentage = yPercentage.toFixed(2);
    xPercentage = xPercentage.toFixed(2);
    colorSquarePicker.style.top = yPercentage + '%';
    colorSquarePicker.style.left = xPercentage + '%';
    s = xPercentage / 100;
    v = 1 - yPercentage / 100;
    colorChange();
  }

  function mouseUp() {
    tracked = null;
  }

  function hueDown(event) {
    tracked = event.currentTarget;
    let xPercentage = ((event.offsetX - 9) / 220) * 100;
    xPercentage = xPercentage.toFixed(2);
    huePicker.style.left = xPercentage + '%';
    h = xPercentage / 100;
    hueChange();
  }

  function hueDownTouch(event) {
    tracked = event.currentTarget;
    let rect = event.target.getBoundingClientRect();
    let offsetX = event.targetTouches[0].clientX - rect.left;
    let xPercentage = ((offsetX - 9) / 220) * 100;
    xPercentage = xPercentage.toFixed(2);
    huePicker.style.left = xPercentage + '%';
    h = xPercentage / 100;
    hueChange();
  }

  function hueChange() {
    let rgb = hsvToRgb(h, 1, 1);
    colorSquare.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`;
    colorChange();
  }

  function colorChange() {
    let rgb = hsvToRgb(h, s, v);
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    hexValue = RGBAToHex();
    colorChangeCallback();
  }

  //Math algorithms
  function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function RGBAToHex() {
    let rHex = r.toString(16);
    let gHex = g.toString(16);
    let bHex = b.toString(16);

    if (rHex.length === 1) rHex = '0' + rHex;
    if (gHex.length === 1) gHex = '0' + gHex;
    if (bHex.length === 1) bHex = '0' + bHex;

    return ('#' + rHex + gHex + bHex).toUpperCase();
  }

  function rgbToHSV(r, g, b, update) {
    let rperc, gperc, bperc, max, min, diff, pr, hnew, snew, vnew;
    rperc = r / 255;
    gperc = g / 255;
    bperc = b / 255;
    max = Math.max(rperc, gperc, bperc);
    min = Math.min(rperc, gperc, bperc);
    diff = max - min;

    vnew = max;
    vnew === 0 ? (snew = 0) : (snew = diff / max);

    for (let i = 0; i < 3; i++) {
      if ([rperc, gperc, bperc][i] === max) {
        pr = i;
        break;
      }
    }
    if (diff === 0) {
      hnew = 0;
      if (update) {
        h = hnew;
        s = snew;
        v = vnew;
        hueChange();
        return;
      } else {
        return { h: hnew, s: snew, v: vnew };
      }
    } else {
      switch (pr) {
        case 0:
          hnew = (60 * (((gperc - bperc) / diff) % 6)) / 360;
          break;
        case 1:
          hnew = (60 * ((bperc - rperc) / diff + 2)) / 360;
          break;
        case 2:
          hnew = (60 * ((rperc - gperc) / diff + 4)) / 360;
          break;
      }
      if (hnew < 0) hnew += 6;
    }

    if (update) {
      h = hnew;
      s = snew;
      v = vnew;
      hueChange();
    } else {
      return { h: hnew, s: snew, v: vnew };
    }
  }
</script>

<div class="main-container {className}">
  <div bind:this={colorSquare} class="colorsquare size">
    <div class="saturation-gradient">
      <div class="value-gradient">
        <div bind:this={colorSquarePicker} class="colorsquare-picker" />
        <div
          bind:this={colorSquareEvent}
          class="colorsquare-event"
          on:mousedown={csDown}
          on:touchstart={csDownTouch}
        />
      </div>
    </div>
  </div>

  <div class="hue-selector">
    <div bind:this={huePicker} class="hue-picker" />
    <div
      bind:this={hueEvent}
      class="hue-event"
      on:mousedown={hueDown}
      on:touchstart={hueDownTouch}
    />
  </div>
</div>
