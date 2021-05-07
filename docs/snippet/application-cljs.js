(function () {
'use strict';

// NB: not necessary when using ES6 spread syntax: `[...nodes].map(…)`
function find(node, selector) {
	if(node.substr) { // for convenience
		[selector, node] = [node, selector];
	}
	let nodes = node.querySelectorAll(selector);
	return toArray$1(nodes);
}

function replaceNode(oldNode, ...newNodes) {
	let container = oldNode.parentNode;
	newNodes.forEach(node => {
		container.insertBefore(node, oldNode);
	});
	container.removeChild(oldNode);
}

let { slice } = Array.prototype;
let toArray$1 = items => slice.call(items);

/* eslint-env browser */

// Needed because both "change" and "keyup" are triggered for text
// input fields in Firefox, but only "keyup" is triggered in Chrome
function listenForChange (className, thenDo, valueCache) {
	return event => {
		if (event.target.classList.contains(className)) {
			const input = event.target;
			const name = input && input.getAttribute("name");
			const inputValue = input && input.value;

			// Brauchen unterschiedlichen Wert für den cache für Checkboxen/Radios
			// weil das Element unabhängig vom "checked" den gleichen Wert hat.
			const value = input.checked ? `${inputValue}:checked` : inputValue;

			if (name && valueCache[name] !== value) {
				valueCache[name] = value;
				thenDo(event);
			}
		}
	};
}

function extractContent (el) {
	if (el.childNodes.length) {
		return el.childNodes[0];
	}
	return el.textContent;
}

var alphabet;
var alphabetIndexMap;
var alphabetIndexMapLength = 0;

function isNumberCode(code) {
  return code >= 48 && code <= 57;
}

function naturalCompare(a, b) {
  var lengthA = (a += '').length;
  var lengthB = (b += '').length;
  var aIndex = 0;
  var bIndex = 0;

  while (aIndex < lengthA && bIndex < lengthB) {
    var charCodeA = a.charCodeAt(aIndex);
    var charCodeB = b.charCodeAt(bIndex);

    if (isNumberCode(charCodeA)) {
      if (!isNumberCode(charCodeB)) {
        return charCodeA - charCodeB;
      }

      var numStartA = aIndex;
      var numStartB = bIndex;

      while (charCodeA === 48 && ++numStartA < lengthA) {
        charCodeA = a.charCodeAt(numStartA);
      }
      while (charCodeB === 48 && ++numStartB < lengthB) {
        charCodeB = b.charCodeAt(numStartB);
      }

      var numEndA = numStartA;
      var numEndB = numStartB;

      while (numEndA < lengthA && isNumberCode(a.charCodeAt(numEndA))) {
        ++numEndA;
      }
      while (numEndB < lengthB && isNumberCode(b.charCodeAt(numEndB))) {
        ++numEndB;
      }

      var difference = numEndA - numStartA - numEndB + numStartB; // numA length - numB length
      if (difference) {
        return difference;
      }

      while (numStartA < numEndA) {
        difference = a.charCodeAt(numStartA++) - b.charCodeAt(numStartB++);
        if (difference) {
          return difference;
        }
      }

      aIndex = numEndA;
      bIndex = numEndB;
      continue;
    }

    if (charCodeA !== charCodeB) {
      if (
        charCodeA < alphabetIndexMapLength &&
        charCodeB < alphabetIndexMapLength &&
        alphabetIndexMap[charCodeA] !== -1 &&
        alphabetIndexMap[charCodeB] !== -1
      ) {
        return alphabetIndexMap[charCodeA] - alphabetIndexMap[charCodeB];
      }

      return charCodeA - charCodeB;
    }

    ++aIndex;
    ++bIndex;
  }

  if (aIndex >= lengthA && bIndex < lengthB && lengthA >= lengthB) {
    return -1;
  }

  if (bIndex >= lengthB && aIndex < lengthA && lengthB >= lengthA) {
    return 1;
  }

  return lengthA - lengthB;
}

naturalCompare.caseInsensitive = naturalCompare.i = function(a, b) {
  return naturalCompare(('' + a).toLowerCase(), ('' + b).toLowerCase());
};

Object.defineProperties(naturalCompare, {
  alphabet: {
    get: function() {
      return alphabet;
    },

    set: function(value) {
      alphabet = value;
      alphabetIndexMap = [];

      var i = 0;

      if (alphabet) {
        for (; i < alphabet.length; i++) {
          alphabetIndexMap[alphabet.charCodeAt(i)] = i;
        }
      }

      alphabetIndexMapLength = alphabetIndexMap.length;

      for (i = 0; i < alphabetIndexMapLength; i++) {
        if (alphabetIndexMap[i] === undefined) {
          alphabetIndexMap[i] = -1;
        }
      }
    },
  },
});

var naturalCompare_1 = naturalCompare;

/**
 * A cross-browser implementation of getElementsByClass.
 * Heavily based on Dustin Diaz's function: http://dustindiaz.com/getelementsbyclass.
 *
 * Find all elements with class `className` inside `container`.
 * Use `single = true` to increase performance in older browsers
 * when only one element is needed.
 *
 * @param {String} className
 * @param {Element} container
 * @param {Boolean} single
 * @api public
 */

var getElementsByClassName = function (container, className, single) {
  if (single) {
    return container.getElementsByClassName(className)[0]
  } else {
    return container.getElementsByClassName(className)
  }
};

var querySelector = function (container, className, single) {
  className = '.' + className;
  if (single) {
    return container.querySelector(className)
  } else {
    return container.querySelectorAll(className)
  }
};

var polyfill = function (container, className, single) {
  var classElements = [],
    tag = '*';

  var els = container.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
  for (var i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      if (single) {
        return els[i]
      } else {
        classElements[j] = els[i];
        j++;
      }
    }
  }
  return classElements
};

var getByClass = (function () {
  return function (container, className, single, options) {
    options = options || {};
    if ((options.test && options.getElementsByClassName) || (!options.test && document.getElementsByClassName)) {
      return getElementsByClassName(container, className, single)
    } else if ((options.test && options.querySelector) || (!options.test && document.querySelector)) {
      return querySelector(container, className, single)
    } else {
      return polyfill(container, className, single)
    }
  }
})();

/*
 * Source: https://github.com/segmentio/extend
 */

var extend = function extend(object) {
  // Takes an unlimited number of extenders.
  var args = Array.prototype.slice.call(arguments, 1);

  // For each extender, copy their properties on our object.
  for (var i = 0, source; (source = args[i]); i++) {
    if (!source) continue
    for (var property in source) {
      object[property] = source[property];
    }
  }

  return object
};

var indexOf = [].indexOf;

var indexOf_1 = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0, il = arr.length; i < il; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1
};

/**
 * Source: https://github.com/timoxley/to-array
 *
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api public
 */

var toArray = function toArray(collection) {
  if (typeof collection === 'undefined') return []
  if (collection === null) return [null]
  if (collection === window) return [window]
  if (typeof collection === 'string') return [collection]
  if (isArray(collection)) return collection
  if (typeof collection.length != 'number') return [collection]
  if (typeof collection === 'function' && collection instanceof Function) return [collection]

  var arr = [];
  for (var i = 0, il = collection.length; i < il; i++) {
    if (Object.prototype.hasOwnProperty.call(collection, i) || i in collection) {
      arr.push(collection[i]);
    }
  }
  if (!arr.length) return []
  return arr
};

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
  prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

var bind_1 = function (el, type, fn, capture) {
  el = toArray(el);
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][bind](prefix + type, fn, capture || false);
  }
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el, NodeList, HTMLCollection or Array
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

var unbind_1 = function (el, type, fn, capture) {
  el = toArray(el);
  for (var i = 0, il = el.length; i < il; i++) {
    el[i][unbind](prefix + type, fn, capture || false);
  }
};

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `wait` milliseconds. If `immediate` is true, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} fn
 * @param {Integer} wait
 * @param {Boolean} immediate
 * @api public
 */

var debounce$1 = function (fn, wait, immediate) {
  var timeout;
  return wait
    ? function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) fn.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(context, args);
      }
    : fn
};

var events = {
	bind: bind_1,
	unbind: unbind_1,
	debounce: debounce$1
};

var toString_1 = function (s) {
  s = s === undefined ? '' : s;
  s = s === null ? '' : s;
  s = s.toString();
  return s
};

/**
 * Module dependencies.
 */



/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

var classes = function (el) {
  return new ClassList(el)
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required')
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name);
    return this
  }

  // fallback
  var arr = this.array();
  var i = indexOf_1(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function (name) {
  // classList
  if (this.list) {
    this.list.remove(name);
    return this
  }

  // fallback
  var arr = this.array();
  var i = indexOf_1(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function (name, force) {
  // classList
  if (this.list) {
    if ('undefined' !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this
  }

  // fallback
  if ('undefined' !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function () {
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = ClassList.prototype.contains = function (name) {
  return this.list ? this.list.contains(name) : !!~indexOf_1(this.array(), name)
};

/**
 * A cross-browser implementation of getAttribute.
 * Source found here: http://stackoverflow.com/a/3755343/361337 written by Vivin Paliath
 *
 * Return the value for `attr` at `element`.
 *
 * @param {Element} el
 * @param {String} attr
 * @api public
 */

var getAttribute = function (el, attr) {
  var result = (el.getAttribute && el.getAttribute(attr)) || null;
  if (!result) {
    var attrs = el.attributes;
    var length = attrs.length;
    for (var i = 0; i < length; i++) {
      if (attrs[i] !== undefined) {
        if (attrs[i].nodeName === attr) {
          result = attrs[i].nodeValue;
        }
      }
    }
  }
  return result
};

var item = function (list) {
  return function (initValues, element, notCreate) {
    var item = this;

    this._values = {};

    this.found = false; // Show if list.searched == true and this.found == true
    this.filtered = false; // Show if list.filtered == true and this.filtered == true

    var init = function (initValues, element, notCreate) {
      if (element === undefined) {
        if (notCreate) {
          item.values(initValues, notCreate);
        } else {
          item.values(initValues);
        }
      } else {
        item.elm = element;
        var values = list.templater.get(item, initValues);
        item.values(values);
      }
    };

    this.values = function (newValues, notCreate) {
      if (newValues !== undefined) {
        for (var name in newValues) {
          item._values[name] = newValues[name];
        }
        if (notCreate !== true) {
          list.templater.set(item, item.values());
        }
      } else {
        return item._values
      }
    };

    this.show = function () {
      list.templater.show(item);
    };

    this.hide = function () {
      list.templater.hide(item);
    };

    this.matching = function () {
      return (
        (list.filtered && list.searched && item.found && item.filtered) ||
        (list.filtered && !list.searched && item.filtered) ||
        (!list.filtered && list.searched && item.found) ||
        (!list.filtered && !list.searched)
      )
    };

    this.visible = function () {
      return item.elm && item.elm.parentNode == list.list ? true : false
    };

    init(initValues, element, notCreate);
  }
};

var addAsync = function (list) {
  var addAsync = function (values, callback, items) {
    var valuesToAdd = values.splice(0, 50);
    items = items || [];
    items = items.concat(list.add(valuesToAdd));
    if (values.length > 0) {
      setTimeout(function () {
        addAsync(values, callback, items);
      }, 1);
    } else {
      list.update();
      callback(items);
    }
  };
  return addAsync
};

var pagination = function (list) {
  var isHidden = false;

  var refresh = function (pagingList, options) {
    if (list.page < 1) {
      list.listContainer.style.display = 'none';
      isHidden = true;
      return
    } else if (isHidden) {
      list.listContainer.style.display = 'block';
    }

    var item,
      l = list.matchingItems.length,
      index = list.i,
      page = list.page,
      pages = Math.ceil(l / page),
      currentPage = Math.ceil(index / page),
      innerWindow = options.innerWindow || 2,
      left = options.left || options.outerWindow || 0,
      right = options.right || options.outerWindow || 0;

    right = pages - right;
    pagingList.clear();
    for (var i = 1; i <= pages; i++) {
      var className = currentPage === i ? 'active' : '';

      //console.log(i, left, right, currentPage, (currentPage - innerWindow), (currentPage + innerWindow), className);

      if (is.number(i, left, right, currentPage, innerWindow)) {
        item = pagingList.add({
          page: i,
          dotted: false,
        })[0];
        if (className) {
          classes(item.elm).add(className);
        }
        item.elm.firstChild.setAttribute('data-i', i);
        item.elm.firstChild.setAttribute('data-page', page);
      } else if (is.dotted(pagingList, i, left, right, currentPage, innerWindow, pagingList.size())) {
        item = pagingList.add({
          page: '...',
          dotted: true,
        })[0];
        classes(item.elm).add('disabled');
      }
    }
  };

  var is = {
    number: function (i, left, right, currentPage, innerWindow) {
      return this.left(i, left) || this.right(i, right) || this.innerWindow(i, currentPage, innerWindow)
    },
    left: function (i, left) {
      return i <= left
    },
    right: function (i, right) {
      return i > right
    },
    innerWindow: function (i, currentPage, innerWindow) {
      return i >= currentPage - innerWindow && i <= currentPage + innerWindow
    },
    dotted: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      return (
        this.dottedLeft(pagingList, i, left, right, currentPage, innerWindow) ||
        this.dottedRight(pagingList, i, left, right, currentPage, innerWindow, currentPageItem)
      )
    },
    dottedLeft: function (pagingList, i, left, right, currentPage, innerWindow) {
      return i == left + 1 && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right)
    },
    dottedRight: function (pagingList, i, left, right, currentPage, innerWindow, currentPageItem) {
      if (pagingList.items[currentPageItem - 1].values().dotted) {
        return false
      } else {
        return i == right && !this.innerWindow(i, currentPage, innerWindow) && !this.right(i, right)
      }
    },
  };

  return function (options) {
    var pagingList = new src(list.listContainer.id, {
      listClass: options.paginationClass || 'pagination',
      item: options.item || "<li><a class='page' href='#'></a></li>",
      valueNames: ['page', 'dotted'],
      searchClass: 'pagination-search-that-is-not-supposed-to-exist',
      sortClass: 'pagination-sort-that-is-not-supposed-to-exist',
    });

    events.bind(pagingList.listContainer, 'click', function (e) {
      var target = e.target || e.srcElement,
        page = list.utils.getAttribute(target, 'data-page'),
        i = list.utils.getAttribute(target, 'data-i');
      if (i) {
        list.show((i - 1) * page + 1, page);
      }
    });

    list.on('updated', function () {
      refresh(pagingList, options);
    });
    refresh(pagingList, options);
  }
};

var parse = function (list) {
  var Item = item(list);

  var getChildren = function (parent) {
    var nodes = parent.childNodes,
      items = [];
    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        items.push(nodes[i]);
      }
    }
    return items
  };

  var parse = function (itemElements, valueNames) {
    for (var i = 0, il = itemElements.length; i < il; i++) {
      list.items.push(new Item(valueNames, itemElements[i]));
    }
  };
  var parseAsync = function (itemElements, valueNames) {
    var itemsToIndex = itemElements.splice(0, 50); // TODO: If < 100 items, what happens in IE etc?
    parse(itemsToIndex, valueNames);
    if (itemElements.length > 0) {
      setTimeout(function () {
        parseAsync(itemElements, valueNames);
      }, 1);
    } else {
      list.update();
      list.trigger('parseComplete');
    }
  };

  list.handlers.parseComplete = list.handlers.parseComplete || [];

  return function () {
    var itemsToIndex = getChildren(list.list),
      valueNames = list.valueNames;

    if (list.indexAsync) {
      parseAsync(itemsToIndex, valueNames);
    } else {
      parse(itemsToIndex, valueNames);
    }
  }
};

var Templater = function (list) {
  var createItem,
    templater = this;

  var init = function () {
    var itemSource;

    if (typeof list.item === 'function') {
      createItem = function (values) {
        var item = list.item(values);
        return getItemSource(item)
      };
      return
    }

    if (typeof list.item === 'string') {
      if (list.item.indexOf('<') === -1) {
        itemSource = document.getElementById(list.item);
      } else {
        itemSource = getItemSource(list.item);
      }
    } else {
      /* If item source does not exists, use the first item in list as
      source for new items */
      itemSource = getFirstListItem();
    }

    if (!itemSource) {
      throw new Error("The list needs to have at least one item on init otherwise you'll have to add a template.")
    }

    itemSource = createCleanTemplateItem(itemSource, list.valueNames);

    createItem = function () {
      return itemSource.cloneNode(true)
    };
  };

  var createCleanTemplateItem = function (templateNode, valueNames) {
    var el = templateNode.cloneNode(true);
    el.removeAttribute('id');

    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i];
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          el.setAttribute('data-' + valueName.data[j], '');
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(el, valueName.name, true);
        if (elm) {
          elm.setAttribute(valueName.attr, '');
        }
      } else {
        elm = list.utils.getByClass(el, valueName, true);
        if (elm) {
          elm.innerHTML = '';
        }
      }
    }
    return el
  };

  var getFirstListItem = function () {
    var nodes = list.list.childNodes;

    for (var i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        return nodes[i].cloneNode(true)
      }
    }
    return undefined
  };

  var getItemSource = function (itemHTML) {
    if (typeof itemHTML !== 'string') return undefined
    if (/<tr[\s>]/g.exec(itemHTML)) {
      var tbody = document.createElement('tbody');
      tbody.innerHTML = itemHTML;
      return tbody.firstElementChild
    } else if (itemHTML.indexOf('<') !== -1) {
      var div = document.createElement('div');
      div.innerHTML = itemHTML;
      return div.firstElementChild
    }
    return undefined
  };

  var getValueName = function (name) {
    for (var i = 0, il = list.valueNames.length; i < il; i++) {
      var valueName = list.valueNames[i];
      if (valueName.data) {
        var data = valueName.data;
        for (var j = 0, jl = data.length; j < jl; j++) {
          if (data[j] === name) {
            return { data: name }
          }
        }
      } else if (valueName.attr && valueName.name && valueName.name == name) {
        return valueName
      } else if (valueName === name) {
        return name
      }
    }
  };

  var setValue = function (item, name, value) {
    var elm = undefined,
      valueName = getValueName(name);
    if (!valueName) return
    if (valueName.data) {
      item.elm.setAttribute('data-' + valueName.data, value);
    } else if (valueName.attr && valueName.name) {
      elm = list.utils.getByClass(item.elm, valueName.name, true);
      if (elm) {
        elm.setAttribute(valueName.attr, value);
      }
    } else {
      elm = list.utils.getByClass(item.elm, valueName, true);
      if (elm) {
        elm.innerHTML = value;
      }
    }
  };

  this.get = function (item, valueNames) {
    templater.create(item);
    var values = {};
    for (var i = 0, il = valueNames.length; i < il; i++) {
      var elm = undefined,
        valueName = valueNames[i];
      if (valueName.data) {
        for (var j = 0, jl = valueName.data.length; j < jl; j++) {
          values[valueName.data[j]] = list.utils.getAttribute(item.elm, 'data-' + valueName.data[j]);
        }
      } else if (valueName.attr && valueName.name) {
        elm = list.utils.getByClass(item.elm, valueName.name, true);
        values[valueName.name] = elm ? list.utils.getAttribute(elm, valueName.attr) : '';
      } else {
        elm = list.utils.getByClass(item.elm, valueName, true);
        values[valueName] = elm ? elm.innerHTML : '';
      }
    }
    return values
  };

  this.set = function (item, values) {
    if (!templater.create(item)) {
      for (var v in values) {
        if (values.hasOwnProperty(v)) {
          setValue(item, v, values[v]);
        }
      }
    }
  };

  this.create = function (item) {
    if (item.elm !== undefined) {
      return false
    }
    item.elm = createItem(item.values());
    templater.set(item, item.values());
    return true
  };
  this.remove = function (item) {
    if (item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.show = function (item) {
    templater.create(item);
    list.list.appendChild(item.elm);
  };
  this.hide = function (item) {
    if (item.elm !== undefined && item.elm.parentNode === list.list) {
      list.list.removeChild(item.elm);
    }
  };
  this.clear = function () {
    /* .innerHTML = ''; fucks up IE */
    if (list.list.hasChildNodes()) {
      while (list.list.childNodes.length >= 1) {
        list.list.removeChild(list.list.firstChild);
      }
    }
  };

  init();
};

var templater = function (list) {
  return new Templater(list)
};

var search = function (list) {
  var columns, searchString, customSearch;

  var prepare = {
    resetList: function () {
      list.i = 1;
      list.templater.clear();
      customSearch = undefined;
    },
    setOptions: function (args) {
      if (args.length == 2 && args[1] instanceof Array) {
        columns = args[1];
      } else if (args.length == 2 && typeof args[1] == 'function') {
        columns = undefined;
        customSearch = args[1];
      } else if (args.length == 3) {
        columns = args[1];
        customSearch = args[2];
      } else {
        columns = undefined;
      }
    },
    setColumns: function () {
      if (list.items.length === 0) return
      if (columns === undefined) {
        columns = list.searchColumns === undefined ? prepare.toArray(list.items[0].values()) : list.searchColumns;
      }
    },
    setSearchString: function (s) {
      s = list.utils.toString(s).toLowerCase();
      s = s.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&'); // Escape regular expression characters
      searchString = s;
    },
    toArray: function (values) {
      var tmpColumn = [];
      for (var name in values) {
        tmpColumn.push(name);
      }
      return tmpColumn
    },
  };
  var search = {
    list: function () {
      // Extract quoted phrases "word1 word2" from original searchString
      // searchString is converted to lowercase by List.js
      var words = [],
        phrase,
        ss = searchString;
      while ((phrase = ss.match(/"([^"]+)"/)) !== null) {
        words.push(phrase[1]);
        ss = ss.substring(0, phrase.index) + ss.substring(phrase.index + phrase[0].length);
      }
      // Get remaining space-separated words (if any)
      ss = ss.trim();
      if (ss.length) words = words.concat(ss.split(/\s+/));
      for (var k = 0, kl = list.items.length; k < kl; k++) {
        var item = list.items[k];
        item.found = false;
        if (!words.length) continue
        for (var i = 0, il = words.length; i < il; i++) {
          var word_found = false;
          for (var j = 0, jl = columns.length; j < jl; j++) {
            var values = item.values(),
              column = columns[j];
            if (values.hasOwnProperty(column) && values[column] !== undefined && values[column] !== null) {
              var text = typeof values[column] !== 'string' ? values[column].toString() : values[column];
              if (text.toLowerCase().indexOf(words[i]) !== -1) {
                // word found, so no need to check it against any other columns
                word_found = true;
                break
              }
            }
          }
          // this word not found? no need to check any other words, the item cannot match
          if (!word_found) break
        }
        item.found = word_found;
      }
    },
    // Removed search.item() and search.values()
    reset: function () {
      list.reset.search();
      list.searched = false;
    },
  };

  var searchMethod = function (str) {
    list.trigger('searchStart');

    prepare.resetList();
    prepare.setSearchString(str);
    prepare.setOptions(arguments); // str, cols|searchFunction, searchFunction
    prepare.setColumns();

    if (searchString === '') {
      search.reset();
    } else {
      list.searched = true;
      if (customSearch) {
        customSearch(searchString, columns);
      } else {
        search.list();
      }
    }

    list.update();
    list.trigger('searchComplete');
    return list.visibleItems
  };

  list.handlers.searchStart = list.handlers.searchStart || [];
  list.handlers.searchComplete = list.handlers.searchComplete || [];

  list.utils.events.bind(
    list.utils.getByClass(list.listContainer, list.searchClass),
    'keyup',
    list.utils.events.debounce(function (e) {
      var target = e.target || e.srcElement, // IE have srcElement
        alreadyCleared = target.value === '' && !list.searched;
      if (!alreadyCleared) {
        // If oninput already have resetted the list, do nothing
        searchMethod(target.value);
      }
    }, list.searchDelay)
  );

  // Used to detect click on HTML5 clear button
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'input', function (e) {
    var target = e.target || e.srcElement;
    if (target.value === '') {
      searchMethod('');
    }
  });

  return searchMethod
};

var filter = function (list) {
  // Add handlers
  list.handlers.filterStart = list.handlers.filterStart || [];
  list.handlers.filterComplete = list.handlers.filterComplete || [];

  return function (filterFunction) {
    list.trigger('filterStart');
    list.i = 1; // Reset paging
    list.reset.filter();
    if (filterFunction === undefined) {
      list.filtered = false;
    } else {
      list.filtered = true;
      var is = list.items;
      for (var i = 0, il = is.length; i < il; i++) {
        var item = is[i];
        if (filterFunction(item)) {
          item.filtered = true;
        } else {
          item.filtered = false;
        }
      }
    }
    list.update();
    list.trigger('filterComplete');
    return list.visibleItems
  }
};

var sort = function (list) {
  var buttons = {
    els: undefined,
    clear: function () {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        list.utils.classes(buttons.els[i]).remove('asc');
        list.utils.classes(buttons.els[i]).remove('desc');
      }
    },
    getOrder: function (btn) {
      var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
      if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
        return predefinedOrder
      } else if (list.utils.classes(btn).has('desc')) {
        return 'asc'
      } else if (list.utils.classes(btn).has('asc')) {
        return 'desc'
      } else {
        return 'asc'
      }
    },
    getInSensitive: function (btn, options) {
      var insensitive = list.utils.getAttribute(btn, 'data-insensitive');
      if (insensitive === 'false') {
        options.insensitive = false;
      } else {
        options.insensitive = true;
      }
    },
    setOrder: function (options) {
      for (var i = 0, il = buttons.els.length; i < il; i++) {
        var btn = buttons.els[i];
        if (list.utils.getAttribute(btn, 'data-sort') !== options.valueName) {
          continue
        }
        var predefinedOrder = list.utils.getAttribute(btn, 'data-order');
        if (predefinedOrder == 'asc' || predefinedOrder == 'desc') {
          if (predefinedOrder == options.order) {
            list.utils.classes(btn).add(options.order);
          }
        } else {
          list.utils.classes(btn).add(options.order);
        }
      }
    },
  };

  var sort = function () {
    list.trigger('sortStart');
    var options = {};

    var target = arguments[0].currentTarget || arguments[0].srcElement || undefined;

    if (target) {
      options.valueName = list.utils.getAttribute(target, 'data-sort');
      buttons.getInSensitive(target, options);
      options.order = buttons.getOrder(target);
    } else {
      options = arguments[1] || options;
      options.valueName = arguments[0];
      options.order = options.order || 'asc';
      options.insensitive = typeof options.insensitive == 'undefined' ? true : options.insensitive;
    }

    buttons.clear();
    buttons.setOrder(options);

    // caseInsensitive
    // alphabet
    var customSortFunction = options.sortFunction || list.sortFunction || null,
      multi = options.order === 'desc' ? -1 : 1,
      sortFunction;

    if (customSortFunction) {
      sortFunction = function (itemA, itemB) {
        return customSortFunction(itemA, itemB, options) * multi
      };
    } else {
      sortFunction = function (itemA, itemB) {
        var sort = list.utils.naturalSort;
        sort.alphabet = list.alphabet || options.alphabet || undefined;
        if (!sort.alphabet && options.insensitive) {
          sort = list.utils.naturalSort.caseInsensitive;
        }
        return sort(itemA.values()[options.valueName], itemB.values()[options.valueName]) * multi
      };
    }

    list.items.sort(sortFunction);
    list.update();
    list.trigger('sortComplete');
  };

  // Add handlers
  list.handlers.sortStart = list.handlers.sortStart || [];
  list.handlers.sortComplete = list.handlers.sortComplete || [];

  buttons.els = list.utils.getByClass(list.listContainer, list.sortClass);
  list.utils.events.bind(buttons.els, 'click', sort);
  list.on('searchStart', buttons.clear);
  list.on('filterStart', buttons.clear);

  return sort
};

var fuzzy = function (text, pattern, options) {
  // Aproximately where in the text is the pattern expected to be found?
  var Match_Location = options.location || 0;

  //Determines how close the match must be to the fuzzy location (specified above). An exact letter match which is 'distance' characters away from the fuzzy location would score as a complete mismatch. A distance of '0' requires the match be at the exact location specified, a threshold of '1000' would require a perfect match to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  var Match_Distance = options.distance || 100;

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match (of both letters and location), a threshold of '1.0' would match anything.
  var Match_Threshold = options.threshold || 0.4;

  if (pattern === text) return true // Exact match
  if (pattern.length > 32) return false // This algorithm cannot be used

  // Set starting location at beginning text and initialise the alphabet.
  var loc = Match_Location,
    s = (function () {
      var q = {},
        i;

      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] = 0;
      }

      for (i = 0; i < pattern.length; i++) {
        q[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
      }

      return q
    })();

  // Compute and return the score for a match with e errors and x location.
  // Accesses loc and pattern through being a closure.

  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length,
      proximity = Math.abs(loc - x);

    if (!Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + proximity / Match_Distance
  }

  var score_threshold = Match_Threshold, // Highest score beyond which we give up.
    best_loc = text.indexOf(pattern, loc); // Is there a nearby exact match? (speedup)

  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);

    if (best_loc != -1) {
      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {
        // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {
        // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) | (((last_rd[j + 1] | last_rd[j]) << 1) | 1) | last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break
    }
    last_rd = rd;
  }

  return best_loc < 0 ? false : true
};

var fuzzySearch = function (list, options) {
  options = options || {};

  options = extend(
    {
      location: 0,
      distance: 100,
      threshold: 0.4,
      multiSearch: true,
      searchClass: 'fuzzy-search',
    },
    options
  );

  var fuzzySearch = {
    search: function (searchString, columns) {
      // Substract arguments from the searchString or put searchString as only argument
      var searchArguments = options.multiSearch ? searchString.replace(/ +$/, '').split(/ +/) : [searchString];

      for (var k = 0, kl = list.items.length; k < kl; k++) {
        fuzzySearch.item(list.items[k], columns, searchArguments);
      }
    },
    item: function (item, columns, searchArguments) {
      var found = true;
      for (var i = 0; i < searchArguments.length; i++) {
        var foundArgument = false;
        for (var j = 0, jl = columns.length; j < jl; j++) {
          if (fuzzySearch.values(item.values(), columns[j], searchArguments[i])) {
            foundArgument = true;
          }
        }
        if (!foundArgument) {
          found = false;
        }
      }
      item.found = found;
    },
    values: function (values, value, searchArgument) {
      if (values.hasOwnProperty(value)) {
        var text = toString_1(values[value]).toLowerCase();

        if (fuzzy(text, searchArgument, options)) {
          return true
        }
      }
      return false
    },
  };

  events.bind(
    getByClass(list.listContainer, options.searchClass),
    'keyup',
    list.utils.events.debounce(function (e) {
      var target = e.target || e.srcElement; // IE have srcElement
      list.search(target.value, fuzzySearch.search);
    }, list.searchDelay)
  );

  return function (str, columns) {
    list.search(str, columns, fuzzySearch.search);
  }
};

var src = function (id, options, values) {
  var self = this,
    init,
    Item = item(self),
    addAsync$1 = addAsync(self),
    initPagination = pagination(self);

  init = {
    start: function () {
      self.listClass = 'list';
      self.searchClass = 'search';
      self.sortClass = 'sort';
      self.page = 10000;
      self.i = 1;
      self.items = [];
      self.visibleItems = [];
      self.matchingItems = [];
      self.searched = false;
      self.filtered = false;
      self.searchColumns = undefined;
      self.searchDelay = 0;
      self.handlers = { updated: [] };
      self.valueNames = [];
      self.utils = {
        getByClass: getByClass,
        extend: extend,
        indexOf: indexOf_1,
        events: events,
        toString: toString_1,
        naturalSort: naturalCompare_1,
        classes: classes,
        getAttribute: getAttribute,
        toArray: toArray,
      };

      self.utils.extend(self, options);

      self.listContainer = typeof id === 'string' ? document.getElementById(id) : id;
      if (!self.listContainer) {
        return
      }
      self.list = getByClass(self.listContainer, self.listClass, true);

      self.parse = parse(self);
      self.templater = templater(self);
      self.search = search(self);
      self.filter = filter(self);
      self.sort = sort(self);
      self.fuzzySearch = fuzzySearch(self, options.fuzzySearch);

      this.handlers();
      this.items();
      this.pagination();

      self.update();
    },
    handlers: function () {
      for (var handler in self.handlers) {
        if (self[handler] && self.handlers.hasOwnProperty(handler)) {
          self.on(handler, self[handler]);
        }
      }
    },
    items: function () {
      self.parse(self.list);
      if (values !== undefined) {
        self.add(values);
      }
    },
    pagination: function () {
      if (options.pagination !== undefined) {
        if (options.pagination === true) {
          options.pagination = [{}];
        }
        if (options.pagination[0] === undefined) {
          options.pagination = [options.pagination];
        }
        for (var i = 0, il = options.pagination.length; i < il; i++) {
          initPagination(options.pagination[i]);
        }
      }
    },
  };

  /*
   * Re-parse the List, use if html have changed
   */
  this.reIndex = function () {
    self.items = [];
    self.visibleItems = [];
    self.matchingItems = [];
    self.searched = false;
    self.filtered = false;
    self.parse(self.list);
  };

  this.toJSON = function () {
    var json = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      json.push(self.items[i].values());
    }
    return json
  };

  /*
   * Add object to list
   */
  this.add = function (values, callback) {
    if (values.length === 0) {
      return
    }
    if (callback) {
      addAsync$1(values.slice(0), callback);
      return
    }
    var added = [],
      notCreate = false;
    if (values[0] === undefined) {
      values = [values];
    }
    for (var i = 0, il = values.length; i < il; i++) {
      var item = null;
      notCreate = self.items.length > self.page ? true : false;
      item = new Item(values[i], undefined, notCreate);
      self.items.push(item);
      added.push(item);
    }
    self.update();
    return added
  };

  this.show = function (i, page) {
    this.i = i;
    this.page = page;
    self.update();
    return self
  };

  /* Removes object from list.
   * Loops through the list and removes objects where
   * property "valuename" === value
   */
  this.remove = function (valueName, value, options) {
    var found = 0;
    for (var i = 0, il = self.items.length; i < il; i++) {
      if (self.items[i].values()[valueName] == value) {
        self.templater.remove(self.items[i], options);
        self.items.splice(i, 1);
        il--;
        i--;
        found++;
      }
    }
    self.update();
    return found
  };

  /* Gets the objects in the list which
   * property "valueName" === value
   */
  this.get = function (valueName, value) {
    var matchedItems = [];
    for (var i = 0, il = self.items.length; i < il; i++) {
      var item = self.items[i];
      if (item.values()[valueName] == value) {
        matchedItems.push(item);
      }
    }
    return matchedItems
  };

  /*
   * Get size of the list
   */
  this.size = function () {
    return self.items.length
  };

  /*
   * Removes all items from the list
   */
  this.clear = function () {
    self.templater.clear();
    self.items = [];
    return self
  };

  this.on = function (event, callback) {
    self.handlers[event].push(callback);
    return self
  };

  this.off = function (event, callback) {
    var e = self.handlers[event];
    var index = indexOf_1(e, callback);
    if (index > -1) {
      e.splice(index, 1);
    }
    return self
  };

  this.trigger = function (event) {
    var i = self.handlers[event].length;
    while (i--) {
      self.handlers[event][i](self);
    }
    return self
  };

  this.reset = {
    filter: function () {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].filtered = false;
      }
      return self
    },
    search: function () {
      var is = self.items,
        il = is.length;
      while (il--) {
        is[il].found = false;
      }
      return self
    },
  };

  this.update = function () {
    var is = self.items,
      il = is.length;

    self.visibleItems = [];
    self.matchingItems = [];
    self.templater.clear();
    for (var i = 0; i < il; i++) {
      if (is[i].matching() && self.matchingItems.length + 1 >= self.i && self.visibleItems.length < self.page) {
        is[i].show();
        self.visibleItems.push(is[i]);
        self.matchingItems.push(is[i]);
      } else if (is[i].matching()) {
        self.matchingItems.push(is[i]);
        is[i].hide();
      } else {
        is[i].hide();
      }
    }
    self.trigger('updated');
    return self
  };

  init.start();
};

/* eslint-env browser */

// generates a DOM element
// `params` describe attributes and/or properties, as determined by the
// respective type (string or boolean attributes vs. arbitrary properties)
// if a `ref` parameter is provided, it is expected to contain a `[refs, id]`
// tuple; `refs[id]` will be assigned the respective DOM node
// `children` is an array of strings or DOM elements
function createElement(tag, params, ...children) {
	params = params || {};
	let node = document.createElement(tag);
	Object.keys(params).forEach(param => {
		let value = params[param];
		// special-casing for node references
		if(param === "ref") {
			let [registry, name] = value;
			registry[name] = node;
			return;
		}
		// boolean attributes (e.g. `<input … autofocus>`)
		if(value === true) {
			value = "";
		} else if(value === false) {
			return;
		}
		// attributes vs. properties
		if(value.substr) {
			node.setAttribute(param, value);
		} else {
			node[param] = value;
		}
	});

	children.forEach(child => {
		if(child.substr || (typeof child === "number")) {
			child = document.createTextNode(child);
		}
		node.appendChild(child);
	});

	return node;
}

/* eslint-env browser */

function arrowRadio (form, id, name, direction, checked) {
	form = form && { form };
	return createElement("input", {
		id: id,
		...form,
		class: "tabelle-arrow",
		type: "radio",
		name: "sort",
		value: name + "-" + direction,
		checked: checked ? "checked" : false
	});
}

function directionName (direction) {
	if (direction === "asc") {
		return "Ascending";
	}
	if (direction === "desc") {
		return "Descending";
	}
	return "";
}

function arrowLabel (id, columnName, direction) {
	return createElement("label", { for: id, class: "tabelle-arrow--" + direction },
			createElement("span", { class: "visually-hidden" },
					"Sort " + columnName + " " + directionName(direction)));
}

/* eslint-env browser */

function createFilter (form, name, value, columnName, disabled) {
	if (disabled) {
		return "";
	}
	form = form && { form };
	return createElement("input", {
		...form,
		type: "text",
		name: name,
		class: "tabelle-input",
		value: value || "",
		"aria-label": "Filter " + columnName
	});
}

let CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// generates pseudo-unique identifier, modeled on Purple Numbers
function nid(max = 9007199254740991) { // ≙ `Number.MAX_SAFE_INTEGER`
	let i = Math.random() * max;
	return base62encode(Math.round(i));
}

// adapted from Base62.js
function base62encode(int) {
	let i = int;
	let res = "";
	while(i > 0) {
		res = CHARSET[i % 62] + res;
		i = Math.floor(i / 62);
	}
	return int === 0 ? CHARSET[0] : res;
}

/* eslint-env browser */

function idGen (prefix = "arrowId") {
	return prefix + "-" + nid();
}

function setFormFor (input, form) {
	if (input && form) {
		input.setAttribute("form", form);
	}
	return input;
}

function createHeader ({ form, name, input, value, nosort, nofilter, currentSort },
		tdContent) {
	const headerId = idGen("header");
	const columnName = tdContent.textContent;
	const header = createElement("span", { class: "header", id: headerId }, tdContent);
	const idUp = idGen();
	const upRadio = nosort ? "" :
		arrowRadio(form, idUp, name, "asc", currentSort === name + "-asc");
	const upLabel = nosort ? "" :
		arrowLabel(idUp, columnName, "asc");

	const idDown = idGen();
	const downRadio = nosort ? "" :
		arrowRadio(form, idDown, name, "desc", currentSort === name + "-desc");
	const downLabel = nosort ? "" :
		arrowLabel(idDown, columnName, "desc");

	const filter = setFormFor(input, form) ||
		createFilter(form, name, value, columnName, nofilter);

	return createElement("div",
			{ class: "tabelle-header", role: "group", "aria-labelledby": headerId },
			header, upRadio, upLabel, downRadio, downLabel, filter);
}

function transformHeaders (headers, formId, currentSort, nofilter) {
	headers.filter(th => th.getAttribute("name")).forEach(th => {
		const name = th.getAttribute("name");
		const value = th.getAttribute("value");
		const headerContent = extractContent(th);
		const properties = {
			name: name,
			value: value,
			input: th.querySelector(".tabelle-input"),
			form: formId,
			currentSort: currentSort,
			nosort: th.hasAttribute("nosort"),
			nofilter: nofilter || th.hasAttribute("nofilter")
		};

		const newContent = createHeader(properties, headerContent);
		replaceNode(th, createElement("th",
				{ "data-name": name, scope: "col" },
				newContent));
	});
}

// limits the rate of `fn` invocations
// `delay` is the rate limit in milliseconds
// `ctx` (optional) is the function's execution context (i.e. `this`)
// `fn` is the respective function
// adapted from StuffJS <https://github.com/bengillies/stuff-js>
function debounce(delay, ctx, fn) {
	if(fn === undefined) { // shift arguments
		fn = ctx;
		ctx = null;
	}

	let timer;
	return function() {
		let args = arguments;
		if(timer) {
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(_ => {
			fn.apply(ctx, args);
			timer = null;
		}, delay);
	};
}

/* eslint-env browser */

function transformTabelle (tabelle) {
	const table = tabelle.querySelector("table");
	if (table) {
		table.classList.add("tabelle");
	}

	find(tabelle, "thead th").forEach(el => {
		el.setAttribute("name", el.getAttribute("name") || `ta-${nid()}`);
	});

	transformHeaders(find(tabelle, "thead th"), null,
			tabelle.getAttribute("sort") || "", tabelle.hasAttribute("nofilter"));
	return tabelle;
}

class TabelleCljs extends HTMLElement {
	connectedCallback() {
		transformTabelle(this);

		this.columns = find(this, "thead th").map(el => el.getAttribute("data-name"));

		this.addListJsClasses();

		this.list = new src(this.querySelector("table"), {
			listClass: "ta-list",
			valueNames: this.columns.filter(e => e)
		});
		this.list.items.forEach(item => {
			let values = item.values();
			for (let key in values) {
				let td = item.elm.querySelector(`.${key}`);
				if (td) {
					values[key] = td.getAttribute("data-filter") || td.textContent;
				}
			}
		});

		this.valueCache = {};
		this.addListeners();

		this.initSortAndFilter();
	}

	addListJsClasses() {
		let container = this.querySelector("tbody") || this.querySelector("table");
		container.classList.add("ta-list");

		find(this, "tbody tr").forEach(tr => {
			let offset = 0;
			find(tr, "td").forEach((td, i) => {
				if (this.columns[i + offset]) {
					td.classList.add(this.columns[i + offset]);

					let colspan = td.getAttribute("colspan") &&
						parseInt(td.getAttribute("colspan"));
					offset += colspan ? colspan - 1 : 0;
				}
			});
		});
	}

	addListeners() {
		this.addEventListener("change",
				listenForChange("tabelle-input",
						this.filter.bind(this), this.valueCache));
		this.addEventListener("change",
				listenForChange("tabelle-arrow",
						this.sort.bind(this), this.valueCache));
		this.addEventListener("keyup",
				debounce(300, listenForChange("tabelle-input",
						this.filter.bind(this), this.valueCache)));
	}

	initSortAndFilter() {
		find(this, ".tabelle-input").forEach(input => {
			this.valueCache[input.name] = input.value;
		});
		this.filter();

		if (this.getAttribute("sort")) {
			let split = this.getAttribute("sort").split("-");
			this.sortColumn(split[0], split[1]);
		}
	}

	sort(event) {
		let arrow = event.target;
		let sortValue = arrow.value.split("-");

		if (!sortValue || sortValue.length < 2) {
			return;
		}

		// Handle class names which contain a `-` separator
		let column = sortValue.slice(0, sortValue.length - 1).join("-");
		let order = sortValue[sortValue.length - 1];

		this.sortColumn(column, order);

		arrow.closest("th").setAttribute("aria-sort",
				order === "asc" ? "ascending" : "descending");
	}

	sortColumn(column, order) {
		this.list.sort(`${column}`, { order });
		find(this, "[aria-sort]").forEach(el => el.removeAttribute("aria-sort"));
	}

	filter() {
		this.list.search("_", this.searchFunction.bind(this));
	}

	searchFunction(_searchString, _columns) {
		this.list.items.forEach(item => {
			item.found = true;
			for (let key in this.valueCache) {
				if (key === "sort") continue;

				let filterString = this.valueCache[key] &&
					this.valueCache[key].toLowerCase().trim();
				let value = item.values()[`${key}`];
				item.found = item.found &&
					value.toLowerCase().trim().includes(filterString);
			}
		});
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}

/* eslint-env browser */

customElements.define("tabelle-cljs", TabelleCljs);

}());
