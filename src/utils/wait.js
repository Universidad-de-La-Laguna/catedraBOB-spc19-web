export const waitFor = (ms) =>
  new Promise((res, _) => {
    setTimeout(res, ms);
  });
