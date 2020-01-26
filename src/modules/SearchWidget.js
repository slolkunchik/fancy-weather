import Event from './Event';

export default class SearchWidget {
  constructor(dispatcher, storage) {
    this.locale = storage.getLocale() || 'EN';
    this.localization = {
      EN: {
        recognition: 'en-US',
        search: 'Search',
        placeholder: 'City',
      },
      RU: {
        recognition: 'ru-RU',
        search: 'Поиск',
        placeholder: 'Город',
      },
      BE: {
        recognition: 'be-BY',
        search: 'Шукаць',
        placeholder: 'Горад',
      },
    };
    this.id = 'searchWidget';
    this.dispatcher = dispatcher;
  }

  getId() {
    return this.id;
  }

  render() {
    return `<form class="search_form">
      <input class="search_voice" type="button" id="search_voice" value=" ">
      <input class="search_input" type="search" id="search"  placeholder="${this.localization[this.locale].placeholder}">
      <input class="search_submit" type="button" value="${this.localization[this.locale].search}"></form>`;
  }

  initEventListeners() {
    document.getElementById(this.id).addEventListener('click', (e) => {
      if (e.target.classList.contains('search_submit')) {
        const searchValue = document.querySelector('.search_input').value;
        if (searchValue) {
          this.dispatcher.dispatch(new Event('onSearchRequest', { value: searchValue }));
        }
      }
      if (e.target.classList.contains('search_voice')) {
        const { target } = e;
        this.detectVoiceQuery(target);
      }
    });
    document.getElementById(this.id).addEventListener('keydown', (e) => {
      if (e.target.classList.contains('search_input') && e.key === 'Enter') {
        if (e.target.value) {
          this.dispatcher.dispatch(new Event('onSearchRequest', { value: e.target.value }));
        }
        e.preventDefault();
      }
    });
  }

  detectVoiceQuery(target) {
    const SpRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpRecognition();

    function endSpeechRecognition() {
      target.classList.remove('active');
      recognition.stop();
    }

    target.classList.add('active');
    recognition.continuous = false;

    recognition.lang = this.localization[this.locale].recognition;
    recognition.start();

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      document.getElementById('search').value = transcript;
      endSpeechRecognition();
    };

    recognition.onerror = () => {
      endSpeechRecognition();
    };

    recognition.onsoundend = () => {
      endSpeechRecognition();
    };
  }

  getSubscribedEvents() {
    return {
      onChangeLocale: this.onChangeLocale.bind(this),
    };
  }

  onChangeLocale(event) {
    const widget = document.getElementById(this.id);
    this.locale = event.data.value.toUpperCase();
    widget.innerHTML = this.render();
  }
}
