const rgb2hex = ({r, g, b}) => {
  let rhex = r.toString(16);
  let ghex = g.toString(16);
  let bhex = b.toString(16);
  if(rhex.length === 1) rhex = "0" + rhex;
  if(ghex.length === 1) ghex = "0" + ghex;
  if(bhex.length === 1) bhex = "0" + bhex;
  return `#${rhex}${ghex}${bhex}`;
}

export {rgb2hex}