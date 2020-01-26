export default class EventDispatcher {
  constructor() {
    this.events = {};
  }

  dispatch(event) {
    const eventHandlers = this.events[event.name];
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        handler(event);
      });
    }
  }

  subscribe(subscribeData) {
    Object.keys(subscribeData).forEach((key) => {
      if (this.events[key] === undefined) {
        this.events[key] = [];
      }
      this.events[key].push(subscribeData[key]);
    });
  }
}
