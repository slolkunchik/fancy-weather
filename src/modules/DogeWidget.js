export default class DogeWidget {
  constructor() {
    this.appId = 'app';
    this.timeout = null;
    this.enabled = true;
    this.id = 'dogeWidget';
    this.temperature = 0;
    this.colors = [
      '#0066FF', '#FF3399', '#33CC33', '#FFFF99', '#FFFF75', '#8533FF',
      '#33D6FF', '#FF5CFF', '#19D1A3', '#FF4719', '#197519', '#6699FF', '#4747D1',
      '#D1D1E0', '#FF5050', '#FFFFF0', '#CC99FF', '#66E0C2', '#FF4DFF', '#00CCFF',
    ];
  }

  getId() {
    return this.id;
  }

  onWeatherChange(event) {
    clearTimeout(this.timeout);
    this.temperature = event.data.temp;
    this.timeout = setTimeout(() => {
      if (this.enabled) {
        const html = `<span class="phrase" style="font-family:'Comic Sans MS', 'Comic Sans', cursive;
          position: absolute; left: ${Math.random() * 70}%; top: ${Math.random() * 100}%;
          font-size: ${Math.max(1, (Math.random() * 1 + 0.8))}em; 
          color: ${this.getColor()};"> ${this.getPhrase()} </span>`;

        document.getElementById('fancy_weather').insertAdjacentHTML('beforeend', html);
      }

      const phrases = document.querySelectorAll('.phrase');

      if (phrases.length > 8 || (!this.enabled && phrases.length > 0)) {
        phrases[0].remove();
      }

      this.onWeatherChange(event);
    }, 2000 * Math.random() + 1000);
  }

  render() {
    const hours = new Date().getHours();
    const timeOfDay = hours >= 7 && hours < 22 ? 'd' : 'n';

    return `<div id="${this.id}" class="${this.id}" style="cursor: pointer">
      <img class="dogImg" width="50" height="50" src='http://dogeweather.com/img/doge/01${timeOfDay}.png' alt="dog"></div>`;
  }

  getColor() {
    const i = Math.floor(Math.random() * this.colors.length);
    return this.colors[i];
  }

  getPhrase() {
    const t = this.temperature;
    let set;
    switch (true) {
      case t > -15 && t <= -7:
        set = ['icy', 'winter', 'chill', 'crisp', 'brrrrr', 'cool'];
        break;
      case t > -7 && t <= 0:
        set = ['icy', 'frost', 'numb', 'shiver', 'brrr', 'chilly', 'snowflake', 'powder'];
        break;
      case t > 0 && t <= 10:
        set = ['chilly', 'concern', 'coat', 'frosty', 'brr', 'uh oh'];
        break;
      case t > 20 && t <= 30:
        set = ['heat', 'warmth', 'climate', 'sweating', 'balmy', 'nice day'];
        break;
      case t > 30:
        set = ['boiling', 'bake', 'melt', 'dying', 'suffer', 'global warming'];
        break;
      default:
        set = ['concern', 'celcius', 'moderate', 'mild', 'okay', 'medium', 'cool', 'whatever'];
        break;
    }

    const simple = ['such weather', 'much doge', 'wow', 'so wow', 'doge'];
    const complex = ['wow', 'so wow', 'such', 'so', 'very'];

    const i = Math.floor(Math.random() * simple.length);
    const setI = Math.floor(Math.random() * set.length);

    return Math.random() > 0.5 ? simple[i] : `${complex[i]} ${set[setI]}`;
  }

  initEventListeners() {
    document.getElementById(this.id)
      .addEventListener('click', (e) => {
        this.enabled = !this.enabled;
        e.target.parentElement.classList.toggle('disableDog');
      });
  }

  getSubscribedEvents() {
    return {
      onWeatherChange: this.onWeatherChange.bind(this),
    };
  }
}
