(function () {
'use strict';

if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
}

/* eslint-env browser */

function listenFor (className, thenDo) {
  return event => {
    if (event.target.classList.contains(className)) {
      thenDo(event);
    }
  }
}

function template2dom (htmlString, selector) {
  let tmp = document.createElement('template');
  tmp.innerHTML = htmlString.trim();
  return selector ? tmp.content.querySelector(selector) : tmp.content.firstChild
}

function extractContent (el) {
  if (el.childNodes.length) {
    return el.childNodes[0]
  }
  return el.textContent
}

// NB: not necessary when using ES6 spread syntax: `[...nodes].map(…)`
function find(node, selector) {
	let nodes = node.querySelectorAll(selector);
	return [].slice.call(nodes);
}

function replaceNode(oldNode, ...newNodes) {
	let container = oldNode.parentNode;
	newNodes.forEach(node => {
		container.insertBefore(node, oldNode);
	});
	container.removeChild(oldNode);
}

function prependChild(node, container) {
	container.insertBefore(node, container.firstChild);
}

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
function httpRequest(method, uri, headers, body,
		{ cors, strict } = {}) {
	let options = {
		method,
		credentials: cors ? "include" : "same-origin"
	};
	if(headers) {
		options.headers = headers;
	}
	if(body) {
		options.body = body;
	}

	let res = fetch(uri, options);
	return !strict ? res : res.then(res => {
		if(!res.ok) {
			throw new Error(`unexpected ${res.status} response at ${uri}`);
		}
		return res;
	});
}

/* eslint-env browser */

function submitForm(form, { headers, cors, strict } = {}) {
	let method = form.getAttribute("method");
	method = method ? method.toUpperCase() : "GET";
	let uri = form.getAttribute("action");
	let payload = serializeForm(form);

	if(method === "GET") {
		if(uri.indexOf("?") !== -1) {
			throw new Error("query strings are invalid within `GET` forms' " +
					"`action` URI; please use hidden fields instead");
		}
		uri = [uri, payload].join("?");
	} else {
		headers = headers || {};
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		var body = payload; // eslint-disable-line no-var
	}

	form.setAttribute("aria-busy", "true");
	let reset = () => {
		form.removeAttribute("aria-busy");
	};
	return httpRequest(method, uri, headers, body, { cors, strict }).
		then(res => {
			reset();
			return res;
		}).
		catch(err => {
			reset();
			throw err;
		});
}

// stringify form data as `application/x-www-form-urlencoded`
// required due to insufficient browser support for `FormData`
// NB: only supports a subset of form fields, notably excluding named buttons
//     and file inputs
function serializeForm(form) {
	let selector = ["input", "textarea", "select"].
		map(tag => `${tag}[name]:not(:disabled)`).join(", ");
	let radios = {};
	return find(form, selector).reduce((params, node) => {
		let { name } = node;
		let value;
		switch(node.nodeName.toLowerCase()) {
		case "textarea":
			value = node.value;
			break;
		case "select":
			value = node.multiple ?
				find(node, "option:checked").map(opt => opt.value) :
				node.value;
			break;
		case "input":
			switch(node.type) {
			case "file":
				throw new Error("`input[type=file]` fields are unsupported");
			case "checkbox":
				if(node.checked) {
					value = node.value;
				}
				break;
			case "radio":
				if(!radios[name]) {
					let field = form.
						querySelector(`input[type=radio][name=${name}]:checked`);
					value = field ? field.value : undefined;
					if(value) {
						radios[name] = true;
					}
				}
				break;
			default:
				value = node.value;
				break;
			}
			break;
		}

		if(value !== undefined) {
			let values = value || [""];
			if(!values.pop) {
				values = [values];
			}
			values.forEach(value => {
				let param = [name, value].map(encodeURIComponent).join("=");
				params.push(param);
			});
		}
		return params;
	}, []).join("&");
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

let id = 0;

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction, checked) {
  return createElement('input', {
    id: id,
    class: 'tabelle-arrow',
    type: 'radio',
    name: 'sort',
    value: name + '-' + direction,
    checked: checked ? 'checked' : false
  })
}

function arrowLabel (id, direction) {
  return createElement('label', { for: id, class: 'tabelle-arrow--' + direction })
}

function createFilter (disabled, name, value, input) {
  if (disabled) {
    return ''
  }
  return input || createElement('input', { type: 'text', name: name, class: 'tabelle-input', value: value || '' }, ' ')
}

function createHeader ({ name, input, value, nosort, nofilter, currentSort }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent);
  const idUp = idGen();
  const upRadio = nosort ? '' : arrowRadio(idUp, name, 'asc', currentSort === name + '-asc');
  const upLabel = nosort ? '' : arrowLabel(idUp, 'asc');

  const idDown = idGen();
  const downRadio = nosort ? '' : arrowRadio(idDown, name, 'desc', currentSort === name + '-desc');
  const downLabel = nosort ? '' : arrowLabel(idDown, 'desc');

  const filter = createFilter(nofilter, name, value, input);

  return createElement('div', { class: 'tabelle-header' },
    header, upRadio, upLabel, downRadio, downLabel, filter)
}

function createForm (uri) {
  const submitButton = createElement('input', { type: 'submit', class: 'hide' });
  return createElement('form', { action: uri }, submitButton)
}

function transformHeaders (headers, currentSort) {
  headers
    .filter(th => th.getAttribute('name'))
    .forEach(th => {
      const name = th.getAttribute('name');
      const value = th.getAttribute('value');
      const headerContent = extractContent(th);
      const properties = {
        name: name,
        value: value,
        input: th.querySelector('.tabelle-input'),
        currentSort: currentSort,
        nosort: th.hasAttribute('nosort'),
        nofilter: th.hasAttribute('nofilter')
      };

      const newContent = createHeader(properties, headerContent);
      replaceNode(th, createElement('th', {}, newContent));
    });
}

function transformTabelle (tabelle) {
  const table = tabelle.querySelector('table');
  if (table) {
    table.classList.add('tabelle');
  }

  const action = tabelle.getAttribute('search-src');
  if (action) {
    const form = createForm(action);
    prependChild(form, tabelle);
    prependChild(table, form);
  }

  transformHeaders(find(tabelle, 'thead th'), tabelle.getAttribute('sort') || '');
  return tabelle
}

class Tabelle extends HTMLElement {
  connectedCallback () {
    if (!this.id) {
      console.error('Tabelle needs an id attribute in order to be created.');
      return
    }

    transformTabelle(this);
    this.initialize();

    if (this.changeUri) {
      history.replaceState({ tabelle: this.innerHTML }, document.title, window.location.href);
      window.onpopstate = ev => this.restoreState(ev);
    }
  }

  initialize () {
    this.setFocus();
    this.addListeners();
  }

  setFocus () {
    if (this.focused) {
      const toFocus = this.querySelector(`.tabelle-input[name="${this.focused}"]`);
      if (toFocus) {
        const tmpVal = toFocus.value;
        toFocus.focus();
        toFocus.value = '';
        toFocus.value = tmpVal;
      }
    }
  }

  addListeners () {
    let { form } = this;
    form.addEventListener('change', listenFor('tabelle-input', () => this.submitForm()));
    form.addEventListener('change', listenFor('tabelle-arrow', () => this.submitForm()));
    form.addEventListener('keyup', debounce(300, listenFor('tabelle-input', () => this.submitForm())));

    form.addEventListener('submit', ev => {
      this.submitForm();
      ev.preventDefault();
    });
  }

  submitForm () {
    submitForm(this.form)
      .then(response => {
        if (!response.ok) {
          throw new Error('Submit not successful')
        }
        return response.text()
          .then(html => ({ html: html, uri: response.url }))
      }).then(({ html, uri }) => {
        let tabelle = template2dom(html, '#' + this.id);

        const active = document.activeElement;
        this.focused = null;
        if (active && this.contains(active)) {
          this.focused = active.getAttribute('name');
        }

        const transformedTabelle = transformTabelle(tabelle);
        const markup = transformedTabelle.innerHTML;

        this.innerHTML = markup;
        this.initialize();

        this.updateState(uri, markup);
      });
  }

  updateState (uri, tabelleMarkup) {
    if (this.changeUri) {
      let state = { tabelle: tabelleMarkup };
      history.pushState(state, document.title, uri);
    }
  }

  restoreState (event) {
    let state = event.state && event.state.tabelle;
    if (state) {
      this.innerHTML = state;
      this.initialize();
    }
  }

  get form () {
    return this.querySelector('form')
  }

  get changeUri () {
    return this.hasAttribute('change-uri')
  }
}

/* eslint-env browser */

customElements.define('ta-belle', Tabelle);

}());
