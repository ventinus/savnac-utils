// Local dependency functions and constants
// ________________________________________________________
import {forEach} from 'lodash'

const CONSTANTS = {
  ADD: 'add',
  REMOVE: 'remove',
  ADD_EVENT_LISTENER: 'addEventListener',
  REMOVE_EVENT_LISTENER: 'removeEventListener'
};

export const mobileRE = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i;

// Accepts a string and returns it with the first letter capitalized
export const capitalizeFirstLetter = (string) => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

// Consolidates looping over set of element to add or remove and event listener
export const addRemoveEvent = function(action, els, eventName, callback, options) {
  forEach(els, el => el[action](eventName, callback, options))
  return els;
}

// Consolidates looping over set of element to add or remove a class
export const addRemoveClass = (action, els, className) => {
  forEach(els, el => el.classList[action](className))

  return els;
}

// Toggles the class or an element
export const toggleSingleClass = (el, className) => {
  let { ADD, REMOVE } = CONSTANTS;
  let action = el.classList.contains(className) ? REMOVE : ADD;
  el.classList[action](className);
  return el;
}


// Core Build of exports
// ________________________________________________________


/**
 * Adds an event listener to a selection of elements
 *
 * @param  {DOM Elements} Collection of elements
 * @param  {String} Event type to bind to
 * @param  {Function} Callback to execute when event occurs
 * @param  {Boolean} bindIndex Passes the index to the callback
 * @param  {Object} Options to pass to addEventListener
 * @return {DOM Elements}
 */
export const addEvent = (els, eventName, callback, options = {}) => {
  return addRemoveEvent(CONSTANTS.ADD_EVENT_LISTENER, els, eventName, callback, options);
}

/**
 * Removes an event listener to a selection of elements
 *
 * @param  {DOM Elements} Collection of elements
 * @param  {String} Event type to unbind to
 * @param  {Function} Callback to unbind
 * @param  {Boolean} bindIndex Passes the index to the callback
 * @param  {Object} Options to pass to removeEventListener
 * @return {DOM Elements}
 */
export const removeEvent = (els, eventName, callback, options = {}) => {
  return addRemoveEvent(CONSTANTS.REMOVE_EVENT_LISTENER, els, eventName, callback, options);
}

/**
 * Adds a class to a set of elements
 *
 * @param  {DOM Elements} Element collection to add a class to
 * @param  {String} Class desired to add
 * @return {DOM Elements}
 */
export const addClass = (els, className) => {
  return addRemoveClass(CONSTANTS.ADD, els, className);
}

/**
 * Removes a class from a set of elements
 *
 * @param  {DOM Elements} Element collection to remove class from
 * @param  {String} Class desired to remove
 * @return {DOM Elements}
 */
export const removeClass = (els, className) => {
  return addRemoveClass(CONSTANTS.REMOVE, els, className);
}

/**
 * Toggles the class of an element or a collection of DOM elements
 *
 * @param  {DOM Element(s)} Element or collection of elements to toggleClass
 * @param  {String} Class to toggle on each element
 * @return {DOM Elements}
 */
export const toggleClass = (els, className) => {
  if (!els.length) {
    toggleSingleClass(els, className);
  } else {
    for (let i = els.length - 1; i >= 0; i--) {
      toggleSingleClass(els[i], className);
    }
  }

  return els;
}

/**
 * Checks if at least one element in a group has a particular class.
 *
 * @param  {DOM Element} els Element or elements to test for class
 * @param  {String} targetClass Class name to check on
 * @return {Boolean} returns true or false
 */
export const checkForClass = (els, targetClass) => {
  for (let i = els.length - 1; i >= 0; i--) {
    if (els[i].classList.contains(targetClass)) return true;
  }

  return false;
}

/**
 * Finds the index of an element in a collection of elements.
 * Returns -1 in the event the element is not found.
 *
 * @param  {DOM Elements} Collection of elements to search through
 * @param  {DOM Element} Element to find the index of
 * @return {Integer}
 */
export const elementIndex = (els, element) => {
  for (let i = els.length - 1; i >= 0; i--) {
    if (els[i] === element) return i;
  }

  return -1;
  // return [...els].indexOf(element);
  // causes error in IE11: Object doesn't support property or method 'from'
}

/**
 * Determines the correct event that corresponds with CSS transitionend or animationend.
 * The argument can only be 'transition' or 'animation'. Returns false if none found.
 *
 * @param  {String} property CSS property to get browser-specific event
 * @return {String}
 */
export const getCssEndEvent = (property) => {
  if (property !== 'transition' && property !== 'animation')
    throw new Error('Property needs to be either transtion or animation');

  let o;
  let el = document.createElement('fakeelement');
  let options = {};
  let capitalizedProperty = capitalizeFirstLetter(property);
  options[`${property}`] = `${property}end`;
  options[`O${capitalizedProperty}`] = `o${capitalizedProperty}End`;
  options[`${capitalizedProperty}`] = `${property}end`;
  options[`${capitalizedProperty}`] = `webkit${capitalizedProperty}End`;

  for (o in options) {
    if (options.hasOwnProperty(o) && el.style[o] !== undefined) {
      return options[o];
    }
  }
  return false;
}

/**
 * Determines the correct CSS prefix for the browser for use such as checking
 * against the windows computed stylesheet. Has only been tested to work
 * with transform but wont abort with others.
 *
 * @param  {String} property Base CSS property
 * @return {String}
 */
export const getCssPrefix = (property) => {
  if (property !== 'transform')
    console.warn(`${property} has not been thoroughly tested. If correct, add to the list of verifieds.`)

  let o;
  let el = document.createElement('fakeelement');
  let options = {};
  let capitalizedProperty = capitalizeFirstLetter(property);
  options[`${property}`] = `${property}`;
  options[`O${capitalizedProperty}`] = `o${capitalizedProperty}`;
  options[`${capitalizedProperty}`] = `${property}`;
  options[`${capitalizedProperty}`] = `webkit${capitalizedProperty}`;

  for (o in options) {
    if (options.hasOwnProperty(o) && el.style[o] !== undefined) {
      return options[o];
    }
  }
  return false;
}

/**
 * Traverses up the DOM tree to find a parent element by checking the
 * id/classList of the parentElement against the targetSelector. Returns -1
 * if none found.
 *
 * @param  {DOM Element} startElement Starting element to start the search from
 * @param  {String} targetSelector Id/Class name to find the parentElement by.
 *                  Be sure to use '#' or '.' at the beginning.
 * @return {DOM Element} Found parent element
 */
export const findParentElement = (startElement, targetSelector) => {
  let parentElement = startElement.parentElement;
  let type = targetSelector.charAt(0);
  let name = targetSelector.slice(1);

  if (type !== '#' && type !== '.') {
    throw new Error('targetSelector needs to start with a "#" or "."');
  }

  if (!parentElement) {
    return -1;
  } else {
    if (type === '#' && parentElement.id === name) {
      return parentElement;
    } else if (type === '.' && parentElement.classList.contains(name)) {
      return parentElement;
    }
  }

  return findParentElement(parentElement, targetSelector);
}

/**
 * Using the selector, drills down through all the children to check if nestedTarget is
 * a child of the selector. Useful for layerd click events.
 *
 * @param  {DOM Element} selector     'parent element' to start search from
 * @param  {DOM Element} nestedTarget element to search for under selector
 * @return {Boolean}                  result of if nestedTarget is a child or not
 */
// export const isNestedElement = (selector, nestedTarget) => {}

/**
 * Checks browser and returns true is IE 11
 *
 * @return {Boolean}
 */
export const isIE11 = () => {
  return !(window.ActiveXObject) && "ActiveXObject" in window ? true : false;
}

/**
 * Checks if the device is an android device
 *
 * @return {Boolean}
 */
export const isAndroid = () => {
  return navigator.userAgent.match(/Android/i) ? true : false;
}

/**
 * Creates a JS controller with our typical rails pattern. All arguments are optional
 * but it would be useless if there weren't any. Options will eventually
 * include potential callbacks to execute at different points of the
 * controller lifecycle
 *
 * @param  {Object} modules           Collection of modules (optional)
 * @param  {Object} windowLoadModules Collection of modules to execute on windowLoad (optional)
 * @param  {Object} options           Various callbacks to execute throughout lifecycle
 * @return {Object}                   Publicly exposed functions
 */
export const controller = (
  modules = {}
  // windowLoadModules = {},
  // options = {}
) => {
  let props = {
    isEnabled: false,
    // isWindowLoadEnabled: false,
    modules: modules,
    // windowLoadModules: windowLoadModules
  };

  // Verify options are passed correctly and combine with default options
  // options = Object.assign({}, {
  //   onCreation: () => {},
  //   onInit: () => {},
  //   onWindowLoadInit: () => {},
  //   onEnable: () => {},
  //   onDisable: () => {}
  // }, options);

  // options.onCreation();

  // const mergeModules = () => { return Object.assign({}, props.modules, props.windowLoadModules); }

  const initModuleSet = (moduleGroup) => {
    for (let module in props[moduleGroup]) {
      if (props[moduleGroup].hasOwnProperty(module)) {
        // check if module is a function which means it hasn't been created
        // since modules return an object, they become objects with methods
        if (!props[moduleGroup][module].init) props[moduleGroup][module] = props[moduleGroup][module]();
        props[moduleGroup][module].init();
      }
    }

    return;
  }

  // const initWindowLoad = () => {
  //   initModuleSet('windowLoadModules');
  //   options.onWindowLoadInit();
  //   props.isWindowLoadEnabled = true;
  //   return;
  // }

  const enable = () => {
    if (props.isEnabled) return;

    initModuleSet('modules');

    // options.onEnable();

    props.isEnabled = true;

    return;
  }

  const disable = (deep) => {
    if (!props.isEnabled) return;

    const action = deep ? 'destroy' : 'disable'

    for (let module in props.modules) {
      if (props.modules.hasOwnProperty(module)) {
        props.modules[module][action]();
      }
    }

    // if (props.isWindowLoadEnabled) {
    //   for (let module in props.windowLoadModules) {
    //     if (props.windowLoadModules.hasOwnProperty(module)) {
    //       props.windowLoadModules[module].disable();
    //     }
    //   }
    // }

    // options.onDisable();

    props.isEnabled = false;
    // props.isWindowLoadEnabled = false;

    return;
  }

  const destroy = () => {
    disable(true)

    for (let key in props) {
      if (props.hasOwnProperty(key)) {
        props[key] = null
      }
    }
  }

  const init = () => {
    // options.onInit();
    enable();
    return;
  }

  return {
    init,
    // initWindowLoad,
    enable,
    disable,
    destroy,
    modules: props.modules
    // modules: mergeModules
  };
}

/**
 * Checks if the browser event listener supports the passive option, a newer feature
 *
 * @return {Boolean}
 */
export const supportsPassive = () => {
  let supportPassive = false;
  // create options object with a getter to see if its passive property is accessed
  let opts = Object.defineProperty && Object.defineProperty({}, 'passive', { get: function(){ supportPassive = true }});
  // create a throwaway element & event and (synchronously) test out our options
  document.addEventListener('test', function() {}, opts);
  return supportPassive;
}

/**
 * Given a number, can calculate the type of time to the future. e.g. 30 days from now => fromNow(30).days()
 *
 * @param  {Number} future Amount to calculate from now
 * @return {Date}   javascript date object
 */
export const fromNow = future => {
  const today = new Date()

  return {
    years() {
      return new Date(today.getFullYear() + future, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes())
    },
    months() {
      return new Date(today.getFullYear(), today.getMonth() + future, today.getDate(), today.getHours(), today.getMinutes())
    },
    days() {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() + future, today.getHours(), today.getMinutes())
    },
    hours() {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + future, today.getMinutes())
    },
    minutes() {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes() + future)
    }
  }
}
