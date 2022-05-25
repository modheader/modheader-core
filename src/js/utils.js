export function takeRight(v) {
  const s = v.toString();
  return s.length > 0 ? s[s.length - 1] : '0';
}

export function swap(arr, index1, index2) {
  const newArr = [...arr];
  const temp = newArr[index1];
  newArr[index1] = newArr[index2];
  newArr[index2] = temp;
  return newArr;
}

export function filterEnabled(rows) {
  let output = [];
  if (rows) {
    for (const row of rows) {
      // Overrides the header if it is enabled and its name is not empty.
      if (row.enabled && row.name) {
        output.push(row);
      }
    }
  }
  return output;
}
