export default () => new Promise(
  (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 1000 }),
);
