export default class YandexMap {
  constructor() {
    this.map = null;
    this.timeout = null;
    this.key = 'c18bb71d-7fc3-458d-8970-f1899081dd8b';
  }

  render() {
    const { head } = document;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${this.key}&lang=en_RU&ns=ymaps_en`;
    head.appendChild(script);
  }

  draw(latitude, longitude, domElementId) {
    /* eslint-disable */
    if (typeof ymaps_en === 'undefined') {
      /* eslint-enable */
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.draw.bind(this, latitude, longitude, domElementId), 300);
      return;
    }

    if (this.isRendered()) {
      this.move(latitude, longitude);
    } else {
      this.init(latitude, longitude, domElementId);
    }
  }

  init(latitude, longitude, domElementId) {
    /* eslint-disable */
    ymaps_en.ready(() => {
      this.map = new ymaps_en.Map(domElementId, {
        center: [latitude, longitude],
        zoom: 11,
      });
    });
    /* eslint-enable */
  }

  move(latitude, longitude) {
    this.map.setCenter([latitude, longitude]);
  }

  isRendered() {
    return this.map !== null;
  }
}
