import Event from './Event';
import getImage from './api/getImage';

export default class ToolsetWidget {
  constructor(dispatcher, storage) {
    this.locale = storage.getLocale() || 'EN';
    this.id = 'toolsetWidget';
    this.dispatcher = dispatcher;
    this.units = storage.getUnits() || 'si';
  }

  getId() {
    return this.id;
  }

  getSubscribedEvents() {
    return {
      onImageChange: this.onImageChange.bind(this),
    };
  }

  render() {
    const selected = {
      en: this.locale === 'EN' ? 'selected' : '',
      ru: this.locale === 'RU' ? 'selected' : '',
      be: this.locale === 'BE' ? 'selected' : '',
    };

    const checked = this.units === 'us' ? 'checked' : '';

    return `${'<div class="toolset_widget">'
      + '<input type="button" class="toolset_widget-refresh" value="R"/>'
      + '<select class="toolset_widget-language">'
      + '<option '}${selected.en} value="EN">EN</option>`
      + `<option ${selected.ru} value="RU">RU</option>`
      + `<option ${selected.be} value="BE">BE</option>`
      + '</select>'
      + '<label class="switch">'
      + `<input type="checkbox" id="tempUnit" ${checked}>`
      + '<span class="slider round">'
      + '<span class="on"><sup>o</sup>F</span><span class="off"><sup>o</sup>C</span></span></label>'
      + '</div>';
  }

  initEventListeners() {
    document.getElementById(this.id).addEventListener('change', (e) => {
      if (e.target.tagName === 'SELECT') {
        this.dispatcher.dispatch(new Event('onChangeLocale', { value: e.target.value }));
      }
      if (e.target.tagName === 'INPUT') {
        if (e.target.checked) {
          this.units = 'us';
        } else {
          this.units = 'si';
        }
        this.dispatcher.dispatch(new Event('onUnitChange', { value: this.units }));
      }
    });
    document.getElementById(this.id).addEventListener('click', (e) => {
      if (e.target.classList.contains('toolset_widget-refresh')) {
        this.dispatcher.dispatch(new Event('onImageRequest'));
      }
    });
  }

  onImageChange(weatherData) {
    const seasonMap = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
    const season = seasonMap[new Date(weatherData.data.currently.time * 1000).getMonth()];
    const curWeather = weatherData.data.currently.icon;
    const hours = new Date(weatherData.data.currently.time * 1000).getHours();
    let timeOfDay = '';
    if ((hours >= 6) && (hours < 11)) {
      timeOfDay = 'morning';
    } else if ((hours >= 11) && (hours < 18)) {
      timeOfDay = 'day';
    } else if ((hours >= 18) && (hours < 22)) {
      timeOfDay = 'evening';
    } else {
      timeOfDay = 'night';
    }
    this.resolveImage(season, timeOfDay, curWeather);
  }

  async resolveImage(season, timeOfDay, curWeather) {
    this.imageData = await getImage(season, timeOfDay, curWeather);
    const res = this.imageData;
    if (res instanceof Object) {
      ((imageData) => {
        const image = imageData || '../imgs/bg.png';
        const bkStyle = `linear-gradient(180deg, rgba(8, 15, 26, 0.59) 0%, rgba(17, 17, 46, 0.46) 100%), url("${image}")`;
        document.getElementById('fancy_weather').style.backgroundImage = bkStyle;
      })(res.urls.regular);
    }
  }
}
