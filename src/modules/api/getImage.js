export default async (season, time, curWeather) => {
  const searchString = `${season}%20${time}%20${curWeather}`;
  const accessKey = '0a05128f1dd0d0d3409291461f91c8b5e0f3a4ac5c7d67f70421da86d88c9129';
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${searchString}&client_id=${accessKey}`;
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      data = await response.json();
    } else {
      // eslint-disable-next-line no-console
      console.log(`HTTP imageApi error: ${response.status}`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error imageApi message: ', e.message);
  }
  return data;
};
