export default async () => {
  const url = 'https://ipinfo.io/json?token=9cfb6fcc12ecc2';
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      data = await response.json();
    } else {
      // eslint-disable-next-line no-console
      console.log(`HTTP location Api error: ${response.status}`);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error location Api message: ', e.message);
  }

  return data;
};
