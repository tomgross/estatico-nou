/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import EventDelegate from 'dom-delegate';
import namespace from './namespace';

/** Demo modules * */
import SkipLinks from '../../../demo/modules/skiplinks/skiplinks';
import SlideShow from '../../../demo/modules/slideshow/slideshow';
/* autoinsertmodulereference */ // eslint-disable-line

class App {
  constructor() {
    // Module instances
    window[namespace].modules = {};

    this.initEvents = [];

    // Module registry - mapping module name (used in data-init) to module Class
    this.modules = {};
    this.modules.slideshow = SlideShow;
    this.modules.skiplinks = SkipLinks;
		/* autoinsertmodule */ // eslint-disable-line

    // expose initModule function
    window[namespace].helpers.initModule = this.initModule;
  }

  start() {
    this.registerModules();
    this.initModuleInitialiser();
  }

  initModule(moduleName, element) {
    const Module = window[namespace].modules[moduleName].Class;
    const metaData = element.dataset[`${moduleName}Data`] || {};
    const metaOptions = element.dataset[`${moduleName}Options`] || {};
    const moduleInstance = new Module(element, metaData, metaOptions);

    window[namespace].modules[moduleName].instances[moduleInstance.uuid] = moduleInstance;
    element.dataset[`${moduleName}Instance`] = moduleInstance;
  }

  registerModules() {
    [].slice.call(document.querySelectorAll('[data-init]')).forEach((element) => {
      const modules = element.dataset['init'].split(' ');

      modules.forEach((moduleName) => {
        this.registerModule(moduleName);
      });
    });
  }

  registerModule(moduleName) {
    if (!window[namespace].modules[moduleName] && this.modules[moduleName]) {
      const Module = this.modules[moduleName];

      window[namespace].modules[moduleName] = {
        initEvents: Module.initEvents,
        events: Module.events,
        instances: {},
        Class: Module,
      };

      this.initEvents = this.initEvents.concat(Module.initEvents);

      // Remove duplicates from initEvents
      this.initEvents = [...new Set(this.initEvents)];
    }
  }

  isRegistered(moduleName) {
    return window[namespace].modules[moduleName];
  }

  isInitialised(element, moduleName) {
    // jQuery 3 does not allow kebab-case in data() when retrieving whole data object https://jquery.com/upgrade-guide/3.0/#breaking-change-data-names-containing-dashes
    return element.dataset[`${moduleName}Instance`];
  }

  isInitEvent(eventType, moduleName) {
    return window[namespace].modules[moduleName].initEvents.indexOf(eventType) !== -1;
  }

  initModules(event) {
    [].slice.call(document.querySelectorAll('[data-init]')).forEach((element) => {
       const modules = element.dataset['init'].split(' ');

      modules.forEach((moduleName) => {
        if (this.isRegistered(moduleName)
            && !this.isInitialised(element, moduleName)
            && this.isInitEvent(event.type, moduleName)) {
          this.initModule(moduleName, element);
        }
      });
    });
  }

  initModuleInitialiser() {
    if (!this.initEvents.length) {
      return;
    }

    const eventDelegate = new EventDelegate(document);

    this.initEvents.forEach((event) => {
      eventDelegate.on(event, this.initModules.bind(this))
    });
  }
}

export default App;
