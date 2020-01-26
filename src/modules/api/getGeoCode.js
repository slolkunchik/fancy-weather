export default async (placeName, lang) => {
  const key = '03430df938994abfa87982d56bd25a3d';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${placeName}&language=${lang}&pretty=1&key=${key}`;
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      data = await response.json();
    } else {
      // eslint-disable-next-line no-console
      console.log(`HTTP geoCodeApi error: ${response.status}`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error geoCodeApi message: ', e.message);
  }
  return data;
};
