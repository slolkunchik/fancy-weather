import DogeWidget from '../modules/DogeWidget';
import EventDispatcher from '../modules/EventDispatcher';
import Event from "../modules/Event";
import LocationWidget from "../modules/LocationWidget";

const chai = require('chai');

global.expect = chai.expect;

describe('DogeWidget #constructor', () => {
  it('should assign value for this.id', () => {
    const dog = new DogeWidget();
    expect(dog.id).to.equal('dogeWidget');
  });
});

describe('Event #constructor', () => {
  it('should assign value to name', () => {
    const eventExample = new Event('onClick', '3');
    expect(eventExample.name).to.equal('onClick');
  });

  it('should assign value to data', () => {
    const eventExample = new Event('onClick', '3');
    expect(eventExample.data).to.equal('3');
  });
});

describe('EventDispatcher', () => {
  it('subscribe to events', () => {
    const dispatcher = new EventDispatcher();
    function onClick(value) {
      return value;
    }
    dispatcher.subscribe({ 'onClick': onClick });
    expect(dispatcher.events.onClick[0]).to.equal(onClick);
  });

  it('subscribe to a few events', () => {
    const dispatcher = new EventDispatcher();
    function onClick(value) {
      return value;
    }
    dispatcher.subscribe({onClick: onClick });
    dispatcher.subscribe({onClick: function (data) {
        return data.length;
    }});
    expect(dispatcher.events.onClick.length).to.equal(2);
  });

  it('dispatch events', () => {
    const dispatcher = new EventDispatcher();
    const testData = { value: '123' };
    dispatcher.subscribe({ onClick: function(event) {
      testData.value = event.data.value;
    }});
    dispatcher.dispatch(new Event('onClick',{ 'value' : '321' }));
    expect(testData.value).to.equal('321');
  });
});

describe('LocationWidget', () => {
  it('set this.place to empty string', () => {
    const dispatcher = new EventDispatcher();
    const locwidg = new LocationWidget(dispatcher, {getLocale: function () {
      return false;
    }});
    expect(locwidg.place).to.equal('');
  });

  it('this.place is using city', () => {
    const dispatcher = new EventDispatcher();
    const locwidg = new LocationWidget(dispatcher, {getLocale: function () {
      return false;
    }});
    locwidg.setPlaceName({city:'Minsk', country: 'Belarus'})
    expect(locwidg.place).to.equal('Minsk, Belarus');
  });

  it('this.place works without city', () => {
    const dispatcher = new EventDispatcher();
    const locwidg = new LocationWidget(dispatcher, {getLocale: function () {
      return false;
    }});
    locwidg.setPlaceName({country: 'Belarus'})
    expect(locwidg.place).to.equal('Belarus');
  });

  it('this.place is using state when city doesn\'t exist', () => {
    const dispatcher = new EventDispatcher();
    const locwidg = new LocationWidget(dispatcher, {getLocale: function () {
      return false;
    }});
    locwidg.setPlaceName({state:'MinksState', country: 'Belarus'})
    expect(locwidg.place).to.equal('MinksState, Belarus');
  });
});
