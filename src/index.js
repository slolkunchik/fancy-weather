import FancyWeather from './modules/FancyWeather';
import ToolsetWidget from './modules/ToolsetWidget';
import SearchWidget from './modules/SearchWidget';
import EventDispatcher from './modules/EventDispatcher';
import LocationWidget from './modules/LocationWidget';
import WeatherWidget from './modules/WeatherWidget';
import YandexMap from './modules/api/YandexMap';
import MapWidget from './modules/MapWidget';
import Storage from './modules/Storage';
import DogeWidget from './modules/DogeWidget';

import './style/style.css';

const dispatcher = new EventDispatcher();
const mapApi = new YandexMap();
const storage = new Storage();
dispatcher.subscribe(storage.getSubscribedEvents());

const weather = new FancyWeather(
  [
    [
      new ToolsetWidget(dispatcher, storage),
      new SearchWidget(dispatcher, storage),
    ],
    [
      new LocationWidget(dispatcher, storage),
      new DogeWidget(),
    ],
    [
      new WeatherWidget(dispatcher, storage),
      new MapWidget(mapApi, storage),
    ],
  ],
  dispatcher,
);
weather.render();
