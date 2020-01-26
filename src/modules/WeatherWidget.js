import getWeather from './api/getWeather';
import Event from './Event';

export default class WeatherWidget {
  constructor(dispatcher, storage) {
    this.id = 'weatherWidget';
    this.locale = storage.getLocale() || 'EN';
    this.units = storage.getUnits() || 'si';
    this.latitude = null;
    this.longitude = null;
    this.initLocalization();
    this.dispatcher = dispatcher;
    this.weatherData = {
      currently: {
        apparentTemperature: '',
        humidity: '',
        windSpeed: '',
        summery: '',
        temperature: '',
        icon: '',
      },
    };
  }

  getId() {
    return this.id;
  }

  render() {
    let iconImage = '';
    let dailyWeatherElement = '';

    if (this.weatherData.currently.icon) {
      iconImage = `<img src="https://darksky.net/images/weather-icons/${this.weatherData.currently.icon}.png" 
      alt="weather icon" width="128" height="128">`;
    }
    if (this.weatherData.daily) {
      dailyWeatherElement = this.getDailyWeather();
    }

    const temperatureSI = (this.units === 'si')
      ? Math.round(this.weatherData.currently.temperature)
      : Math.round((this.weatherData.currently.temperature - 32) * (5 / 9));

    this.dispatcher.dispatch(new Event('onWeatherChange', { temp: temperatureSI }));

    return `<div class="weather_temperature">${Math.round(this.weatherData.currently.temperature)}&deg;</div> 
       <div>${iconImage}</div>
       <div class="weather_summary">
        <p class="weather_summary-item">${this.weatherData.currently.summary}</p>
        <p class="weather_summary-item">${this.localization[this.locale].windSpeed}:
            ${this.getWindSpeed()} m/c</p>
        <p class="weather_summary-item">${this.localization[this.locale].apparentTemperature}:
            ${Math.round(this.weatherData.currently.apparentTemperature)}&deg;</p>
        <p class="weather_summary-item">${this.localization[this.locale].humidity}:
            ${Math.round(this.weatherData.currently.humidity * 100)}%</p></div>
       <div class="weather_daily">${dailyWeatherElement}</div>`;
  }

  getSubscribedEvents() {
    return {
      onChangePlace: this.onChangePlace.bind(this),
      onChangeLocale: this.onChangeLocale.bind(this),
      onImageRequest: this.onImageRequest.bind(this),
      onUnitChange: this.onUnitChange.bind(this),
    };
  }

  onUnitChange(event) {
    (async () => {
      this.units = event.data.value;
      const locale = this.locale.toLowerCase();
      await this.resolveWeather(this.latitude, this.longitude, this.units, locale);
      const widget = document.getElementById(this.id);
      widget.innerHTML = this.render();
    })();
  }

  onChangePlace(event) {
    (async () => {
      this.latitude = event.data.latitude;
      this.longitude = event.data.longitude;
      const locale = this.locale.toLowerCase();
      await this.resolveWeather(this.latitude, this.longitude, this.units, locale);
      if (!event.data.skipImageChange) {
        this.dispatcher.dispatch(new Event('onImageChange', this.weatherData));
      }
      const widget = document.getElementById(this.id);
      widget.innerHTML = this.render();
    })();
  }

  onChangeLocale(event) {
    this.locale = event.data.value;
    if (this.latitude) {
      this.onChangePlace(new Event('', {
        latitude: this.latitude,
        longitude: this.longitude,
        skipImageChange: true,
      }));
    } else {
      const widget = document.getElementById(this.id);
      widget.innerHTML = this.render();
    }
  }

  async resolveWeather(latitude, longitude, units, locale) {
    this.weatherData = await getWeather(latitude, longitude, units, locale);
  }

  getDailyWeather() {
    let dailyBlock = '';
    const dailyWeatherData = this.weatherData.daily.data;
    for (let i = 1; i <= 3; i += 1) {
      const day = new Date(dailyWeatherData[i].time * 1000).getDay();
      dailyBlock += `<div class="weather_daily-item">
      <div class="weather_daily-day">${this.localization[this.locale].day[day]}</div>
      <div class="weather_daily-forecast"><div class="weather_daily-temperature">${Math.round((dailyWeatherData[i].temperatureHigh + dailyWeatherData[i].temperatureLow) / 2)}&deg;</div>
      <div><img src="https://darksky.net/images/weather-icons/${dailyWeatherData[i].icon}.png" 
      alt="weather icon" width="60" height="60"></div></div></div>`;
    }
    return dailyBlock;
  }

  onImageRequest() {
    this.dispatcher.dispatch(new Event('onImageChange', this.weatherData));
  }

  initLocalization() {
    this.localization = {
      EN: {
        apparentTemperature: 'Feels like',
        windSpeed: 'Wind',
        humidity: 'Humidity',
        day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      RU: {
        apparentTemperature: 'Ощущается как',
        windSpeed: 'Ветер',
        humidity: 'Влажность',
        day: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      },
      BE: {
        apparentTemperature: 'Адчуваецца як',
        windSpeed: 'Вецер',
        humidity: 'Вільготнасць',
        day: ['Нядзеля', 'Панядзелак', 'Аўторак', 'Серада', 'Чацвер', 'Пятніца', 'Субота'],
      },
    };
  }

  getWindSpeed() {
    const windSpeed = this.units === 'si'
      ? this.weatherData.currently.windSpeed
      : (this.weatherData.currently.windSpeed / 2.237);

    return Math.round(windSpeed);
  }
}
