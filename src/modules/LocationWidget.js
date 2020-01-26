import Event from './Event';
import countries from '../resources/names.json';
import getLocation from './api/getLocation';
import getGeoCoordinates from './api/getGeoCoordinates';
import getGeoCode from './api/getGeoCode';

export default class LocationWidget {
  constructor(dispatcher, storage) {
    this.locale = storage.getLocale() || 'EN';
    this.place = '';
    this.id = 'locationWidget';
    this.dispatcher = dispatcher;
    this.timeZone = undefined;
    this.localization = {
      EN: {
        day: ['Sun', 'Mon', 'Tue', 'Wen', 'Th', 'Fri', 'Sat'],
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      },
      RU: {
        day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        month: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'],
      },
      BE: {
        day: ['Нд', 'Пн', 'Аў', 'Ср', 'Чц', 'Пт', 'Сб'],
        month: ['Студзеня', 'Лютага', 'Сакавіка', 'Красавіка', 'Мая', 'Чэрвеня', 'Ліпеня', 'Жніўня', 'Верасня', 'Кастрычніка', 'Лістапада', 'Снежня'],
      },
    };
  }

  getId() {
    return this.id;
  }

  init() {
    (async () => {
      await this.resolvePosition();
    })();
    setTimeout(() => {
      this.dispatcher.dispatch(new Event('onMinutePassed'));
    }, 1000 * 60);
  }

  render() {
    const options = { timeZone: this.timeZone };
    const dt = new Date(new Date().toLocaleString('en-US', options));
    return `<div class="location">${this.place}</div>
    <div><p class="date">${this.localization[this.locale].day[dt.getDay()]} ${dt.getDate()}
    ${this.localization[this.locale].month[dt.getMonth()]}
    ${(`0${dt.getHours()}`).slice(-2)}:${(`0${dt.getMinutes()}`).slice(-2)}</p></div>`;
  }

  getSubscribedEvents() {
    return {
      onChangePlace: this.onChangePlace.bind(this),
      onChangeLocale: this.onChangeLocale.bind(this),
      onMinutePassed: this.onMinutePassed.bind(this),
      onSearchRequest: this.onSearchRequest.bind(this),
    };
  }

  onChangePlace(event) {
    const widget = document.getElementById(this.id);
    this.place = event.data.placeName;
    this.timeZone = event.data.timeZone;
    widget.innerHTML = this.render();
  }

  onMinutePassed() {
    const widget = document.getElementById(this.id);
    widget.innerHTML = this.render();
    this.timeout = setTimeout(() => {
      this.dispatcher.dispatch(new Event('onMinutePassed'));
    }, 1000 * 60);
  }

  onChangeLocale(event) {
    const widget = document.getElementById(this.id);
    this.locale = event.data.value;
    if (this.place) {
      (async () => {
        await this.onSearchRequest(new Event('onSearchRequest', { value: this.place, skipImageChange: true }));
      })();
    }
    widget.innerHTML = this.render();
  }

  async resolvePosition() {
    const coordinatesValues = await getGeoCoordinates();
    const locationValues = await getLocation();
    const place = `${locationValues.city}, ${countries[locationValues.country]}`;
    const searchCoords = await getGeoCode(place, this.locale.toLowerCase());

    this.setPlaceName(searchCoords.results[0].components);

    const eventData = {
      placeName: this.place,
      latitude: coordinatesValues.coords.latitude,
      longitude: coordinatesValues.coords.longitude,
      timeZone: locationValues.timezone,
    };

    this.dispatcher.dispatch(new Event('onChangePlace', eventData));
  }

  async onSearchRequest(event) {
    const searchCoords = await getGeoCode(event.data.value, this.locale.toLowerCase());
    this.setPlaceName(searchCoords.results[0].components);
    const eventData = {
      placeName: this.place,
      latitude: searchCoords.results[0].geometry.lat,
      longitude: searchCoords.results[0].geometry.lng,
      timeZone: searchCoords.results[0].annotations.timezone.name,
      skipImageChange: event.data.skipImageChange,
    };
    this.dispatcher.dispatch(new Event('onChangePlace', eventData));
  }

  setPlaceName(placeData) {
    let city = placeData.city || placeData.county || placeData.state;
    if (!city) {
      city = '';
    } else {
      city += ', ';
    }
    const { country } = placeData;
    this.place = `${city}${country}`;
  }
}
