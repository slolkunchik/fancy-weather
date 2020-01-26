export default class Storage {
  constructor() {
    this.storage = localStorage;
  }

  getSubscribedEvents() {
    return {
      onChangeLocale: this.saveLocaleToLocalStorage.bind(this),
      onUnitChange: this.saveUnitToLocalStorage.bind(this),
    };
  }

  saveLocaleToLocalStorage(event) {
    this.storage.setItem('locale', event.data.value.toUpperCase());
  }

  saveUnitToLocalStorage(event) {
    this.storage.setItem('unit', event.data.value);
  }

  getUnits() {
    return this.storage.getItem('unit');
  }

  getLocale() {
    return this.storage.getItem('locale');
  }
}
