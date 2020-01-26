export default async (latitude, longitude, units, locale) => {
  const urlFirstPart = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/fcab73b3004eb90c0323cf53b2cdf1a2/';
  const url = `${urlFirstPart}${latitude},${longitude}?units=${units}&lang=${locale}`;
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      data = await response.json();
    } else {
      // eslint-disable-next-line no-console
      console.log(`HTTP weatherApi error: ${response.status}`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error weatherApi message: ', e.message);
  }

  return data;
};
