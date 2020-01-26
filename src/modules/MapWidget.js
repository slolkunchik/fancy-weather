export default class MapWidget {
  constructor(mapApi, storage) {
    this.id = 'mapWidget';
    this.mapApi = mapApi;
    this.latitude = '';
    this.longitude = '';
    this.locale = storage.getLocale() || 'EN';
    this.localization = {
      EN: {
        lat: 'Latitude',
        lng: 'Longitude',
      },
      RU: {
        lat: 'Широта',
        lng: 'Долгота',
      },
      BE: {
        lat: 'Шырата',
        lng: 'Даўгата',
      },
    };
  }

  getId() {
    return this.id;
  }

  init() {
    this.mapApi.render();
  }

  render() {
    const coords = this.renderCoords();
    return `<div class="map" id="map"></div><div class="coords">${coords}</div>`;
  }

  getSubscribedEvents() {
    return {
      onChangePlace: this.onChangePlace.bind(this),
      onChangeLocale: this.onChangeLocale.bind(this),
    };
  }

  onChangePlace(event) {
    this.latitude = event.data.latitude;
    this.longitude = event.data.longitude;
    const widget = document.getElementById(this.id);
    widget.lastElementChild.innerHTML = this.renderCoords();
    this.mapApi.draw(this.latitude, this.longitude, 'map');
  }

  onChangeLocale(event) {
    const widget = document.getElementById(this.id);
    this.locale = event.data.value;
    widget.firstElementChild.nextElementSibling.innerHTML = this.renderCoords();
  }

  renderCoords() {
    const latitudeDeg = Math.trunc(this.latitude);
    const longitudeDeg = Math.trunc(this.longitude);
    const latitude = `${latitudeDeg}&deg; ${Math.round((this.latitude - latitudeDeg) * 60)}'`;
    const longitude = `${longitudeDeg}&deg; ${Math.round((this.longitude - longitudeDeg) * 60)}'`;
    return `<p class="coords-item">${this.localization[this.locale].lat}: ${latitude}</p>
            <p class="coords-item">${this.localization[this.locale].lng}: ${longitude}</p>`;
  }
}
