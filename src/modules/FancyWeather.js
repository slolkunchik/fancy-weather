export default class FancyWeather {
  constructor(widgets, dispatcher) {
    this.widgets = widgets;
    this.initiolizedWidgets = [];
    this.dispatcher = dispatcher;
  }

  render() {
    document.body.insertAdjacentHTML('beforeend', '<div id="fancy_weather" class="fancy_weather">'
      + '<h1 class="h1">fancy_weather</h1></div>');
    let wholeWidgetHtml = '';

    // init and render each widget one by one
    for (let i = 0; i < this.widgets.length; i += 1) {
      let rowHTML = '<div class="fancy_weather-container_row">';
      for (let j = 0; j < this.widgets[i].length; j += 1) {
        const widget = this.widgets[i][j];
        if (typeof widget.init === 'function') {
          widget.init();
        }
        const id = widget.getId();
        rowHTML += `<div class="fancy_weather-container_cell" id="${id}">${widget.render()}</div>`;
        this.initiolizedWidgets.push(widget);
      }
      rowHTML += '</div>';
      wholeWidgetHtml += rowHTML;
    }
    const baseElement = document.getElementById('fancy_weather');
    baseElement.insertAdjacentHTML('beforeend', wholeWidgetHtml);

    this.initiolizedWidgets.forEach((widget) => {
      if (typeof widget.initEventListeners === 'function') {
        widget.initEventListeners();
      }

      if (typeof widget.getSubscribedEvents === 'function') {
        this.dispatcher.subscribe(widget.getSubscribedEvents());
      }
    });
  }
}
