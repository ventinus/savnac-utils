(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

// Local dependency functions and constants
// ________________________________________________________
var CONSTANTS = {
  ADD: 'add',
  REMOVE: 'remove',
  ADD_EVENT_LISTENER: 'addEventListener',
  REMOVE_EVENT_LISTENER: 'removeEventListener'
};

var mobileRE = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i;

var forEach = function forEach(array, callback, scope) {
  var j = array.length;
  for (var i = 0; i < j; i++) {
    callback.call(scope, array[i], i); // passes back stuff we need
  }
};

// Accepts a string and returns it with the first letter capitalized
var capitalizeFirstLetter = function capitalizeFirstLetter(string) {
  return '' + string.charAt(0).toUpperCase() + string.slice(1);
};

// Gets the current timestamp
var _now = Date.now || function () {
  return new Date().getTime();
};

// Consolidates looping over set of element to add or remove and event listener
var addRemoveEvent = function addRemoveEvent(action, els, eventName, callback, options) {
  forEach(els, function (el) {
    return el[action](eventName, callback, options);
  });
  return els;
};

// Consolidates looping over set of element to add or remove a class
var addRemoveClass = function addRemoveClass(action, els, className) {
  forEach(els, function (el) {
    return el.classList[action](className);
  });

  return els;
};

// Toggles the class or an element
var toggleSingleClass = function toggleSingleClass(el, className) {
  var ADD = CONSTANTS.ADD,
      REMOVE = CONSTANTS.REMOVE;

  var action = el.classList.contains(className) ? REMOVE : ADD;
  el.classList[action](className);
  return el;
};

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
var addEvent = function addEvent(els, eventName, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return addRemoveEvent(CONSTANTS.ADD_EVENT_LISTENER, els, eventName, callback, options);
};

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
var removeEvent = function removeEvent(els, eventName, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return addRemoveEvent(CONSTANTS.REMOVE_EVENT_LISTENER, els, eventName, callback, options);
};

/**
 * Adds a class to a set of elements
 *
 * @param  {DOM Elements} Element collection to add a class to
 * @param  {String} Class desired to add
 * @return {DOM Elements}
 */
var addClass = function addClass(els, className) {
  return addRemoveClass(CONSTANTS.ADD, els, className);
};

/**
 * Removes a class from a set of elements
 *
 * @param  {DOM Elements} Element collection to remove class from
 * @param  {String} Class desired to remove
 * @return {DOM Elements}
 */
var removeClass = function removeClass(els, className) {
  return addRemoveClass(CONSTANTS.REMOVE, els, className);
};

/**
 * Toggles the class of an element or a collection of DOM elements
 *
 * @param  {DOM Element(s)} Element or collection of elements to toggleClass
 * @param  {String} Class to toggle on each element
 * @return {DOM Elements}
 */
var toggleClass = function toggleClass(els, className) {
  if (!els.length) {
    toggleSingleClass(els, className);
  } else {
    for (var i = els.length - 1; i >= 0; i--) {
      toggleSingleClass(els[i], className);
    }
  }

  return els;
};

/**
 * Checks if at least one element in a group has a particular class.
 *
 * @param  {DOM Element} els Element or elements to test for class
 * @param  {String} targetClass Class name to check on
 * @return {Boolean} returns true or false
 */
var checkForClass = function checkForClass(els, targetClass) {
  for (var i = els.length - 1; i >= 0; i--) {
    if (els[i].classList.contains(targetClass)) return true;
  }

  return false;
};

/**
 * Finds the index of an element in a collection of elements.
 * Returns -1 in the event the element is not found.
 *
 * @param  {DOM Elements} Collection of elements to search through
 * @param  {DOM Element} Element to find the index of
 * @return {Integer}
 */
var elementIndex = function elementIndex(els, element) {
  for (var i = els.length - 1; i >= 0; i--) {
    if (els[i] === element) return i;
  }

  return -1;
  // return [...els].indexOf(element);
  // causes error in IE11: Object doesn't support property or method 'from'
};

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered.
 * Source: https://davidwalsh.name/javascript-debounce-function (also Underscore.js)
 *
 * @param  {Function} func Function to execute once from a repeated event
 * @param  {Number} wait Triggers the function after N milliseconds
 * @param  {Boolean} immmediate If true, triggers the function on the leading edge instead of the trailing
 * @return {Function}
 */
var debounce = function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

/**
 * Limits the rate of executions for a recurring event.
 * Returns a function, that, when invoked, will only be
 * triggered at most once during a given window of time.
 * Normally, the throttled function will run as much as
 * it can, without ever going more than once per wait
 * duration; but if you’d like to disable the execution
 * on the leading edge, pass {leading: false}. To disable
 * execution on the trailing edge, ditto.
 * Source: http://underscorejs.org/docs/underscore.html
 *
 * @param  {Function} func  Function to execute
 * @param  {Number} wait    Time between executions
 * @param  {Object} options Options to pass to the throttle function
 * @return {Function}       Throttled function
 */
var throttle = function throttle(func, wait, options) {
  var context = void 0,
      args = void 0,
      result = void 0;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function later() {
    previous = options.leading === false ? 0 : _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function () {
    var now = _now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

/**
 * Determines the correct event that corresponds with CSS transitionend or animationend.
 * The argument can only be 'transition' or 'animation'. Returns false if none found.
 *
 * @param  {String} property CSS property to get browser-specific event
 * @return {String}
 */
var getCssEndEvent = function getCssEndEvent(property) {
  if (property !== 'transition' && property !== 'animation') throw new Error('Property needs to be either transtion or animation');

  var o = void 0;
  var el = document.createElement('fakeelement');
  var options = {};
  var capitalizedProperty = capitalizeFirstLetter(property);
  options['' + property] = property + 'end';
  options['O' + capitalizedProperty] = 'o' + capitalizedProperty + 'End';
  options['' + capitalizedProperty] = property + 'end';
  options['' + capitalizedProperty] = 'webkit' + capitalizedProperty + 'End';

  for (o in options) {
    if (options.hasOwnProperty(o) && el.style[o] !== undefined) {
      return options[o];
    }
  }
  return false;
};

/**
 * Determines the correct CSS prefix for the browser for use such as checking
 * against the windows computed stylesheet. Has only been tested to work
 * with transform but wont abort with others.
 *
 * @param  {String} property Base CSS property
 * @return {String}
 */
var getCssPrefix = function getCssPrefix(property) {
  if (property !== 'transform') console.warn(property + ' has not been thoroughly tested. If correct, add to the list of verifieds.');

  var o = void 0;
  var el = document.createElement('fakeelement');
  var options = {};
  var capitalizedProperty = capitalizeFirstLetter(property);
  options['' + property] = '' + property;
  options['O' + capitalizedProperty] = 'o' + capitalizedProperty;
  options['' + capitalizedProperty] = '' + property;
  options['' + capitalizedProperty] = 'webkit' + capitalizedProperty;

  for (o in options) {
    if (options.hasOwnProperty(o) && el.style[o] !== undefined) {
      return options[o];
    }
  }
  return false;
};

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
var findParentElement = function findParentElement(startElement, targetSelector) {
  var parentElement = startElement.parentElement;
  var type = targetSelector.charAt(0);
  var name = targetSelector.slice(1);

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
};

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
var isIE11 = function isIE11() {
  return !window.ActiveXObject && "ActiveXObject" in window ? true : false;
};

/**
 * Checks if the device is an android device
 *
 * @return {Boolean}
 */
var isAndroid = function isAndroid() {
  return navigator.userAgent.match(/Android/i) ? true : false;
};

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
var controller = function controller()
// windowLoadModules = {},
// options = {}
{
  var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = {
    isEnabled: false,
    // isWindowLoadEnabled: false,
    modules: modules
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

  var initModuleSet = function initModuleSet(moduleGroup) {
    for (var module in props[moduleGroup]) {
      if (props[moduleGroup].hasOwnProperty(module)) {
        // check if module is a function which means it hasn't been created
        // since modules return an object, they become objects with methods
        if (!props[moduleGroup][module].init) props[moduleGroup][module] = props[moduleGroup][module]();
        props[moduleGroup][module].init();
      }
    }

    return;
  };

  // const initWindowLoad = () => {
  //   initModuleSet('windowLoadModules');
  //   options.onWindowLoadInit();
  //   props.isWindowLoadEnabled = true;
  //   return;
  // }

  var enable = function enable() {
    if (props.isEnabled) return;

    initModuleSet('modules');

    // options.onEnable();

    props.isEnabled = true;

    return;
  };

  var disable = function disable(deep) {
    if (!props.isEnabled) return;

    var action = deep ? 'destroy' : 'disable';

    for (var module in props.modules) {
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
  };

  var destroy = function destroy() {
    disable(true);

    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        props[key] = null;
      }
    }
  };

  var init = function init() {
    // options.onInit();
    enable();
    return;
  };

  return {
    init: init,
    // initWindowLoad,
    enable: enable,
    disable: disable,
    destroy: destroy,
    modules: props.modules
    // modules: mergeModules
  };
};

/**
 * Checks if the browser event listener supports the passive option, a newer feature
 *
 * @return {Boolean}
 */
var supportsPassive = function supportsPassive() {
  var supportPassive = false;
  // create options object with a getter to see if its passive property is accessed
  var opts = Object.defineProperty && Object.defineProperty({}, 'passive', { get: function get$$1() {
      supportPassive = true;
    } });
  // create a throwaway element & event and (synchronously) test out our options
  document.addEventListener('test', function () {}, opts);
  return supportPassive;
};

/**
 * Takes an object and a string of the key to remove from the object, returning a new object.
 * Similar to lodash omit but only shallow and doesnt accept an array of keys to omit (yet).
 *
 * @param  {Object}          obj The object to remove key from
 * @param  {String or Array} key The key(s) to remove
 * @return {Object}              The original object without the key that was removed
 */
var omit = function omit() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments[1];

  var isArray = Array.isArray(key);
  return Object.keys(obj).reduce(function (acc, cur) {
    if (isArray && key.includes(cur) || cur === key) {
      return acc;
    } else {
      return Object.assign({}, acc, defineProperty({}, cur, obj[cur]));
    }
  }, {});
};

exports.mobileRE = mobileRE;
exports.forEach = forEach;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports._now = _now;
exports.addRemoveEvent = addRemoveEvent;
exports.addRemoveClass = addRemoveClass;
exports.toggleSingleClass = toggleSingleClass;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.checkForClass = checkForClass;
exports.elementIndex = elementIndex;
exports.debounce = debounce;
exports.throttle = throttle;
exports.getCssEndEvent = getCssEndEvent;
exports.getCssPrefix = getCssPrefix;
exports.findParentElement = findParentElement;
exports.isIE11 = isIE11;
exports.isAndroid = isAndroid;
exports.controller = controller;
exports.supportsPassive = supportsPassive;
exports.omit = omit;

})));
