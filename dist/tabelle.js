(function () {
'use strict';

if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
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

function submit(form, { headers, cors, strict } = {}) {
	let { method } = form;
	method = method ? method.toUpperCase() : "GET";
	let uri = form.getAttribute("action");
	let payload = serializeForm(form);

	if(method === "GET") {
		if(uri.indexOf("?") !== -1) {
			throw new Error("query strings are invalid within `GET` forms' action");
		}
		uri = [uri, payload].join("?");
	} else {
		headers = headers || {};
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		var body = payload; // eslint-disable-line no-var
	}
	return httpRequest(method, uri, headers, body, { cors, strict });
}

// stringify form data as `application/x-www-form-urlencoded`
// required due to insufficient browser support for `FormData`
// NB: only supports a subset of form fields, notably excluding buttons and file inputs
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
				console.warn("ignoring unsupported file-input field");
				break;
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

/* globals customElements, HTMLElement, history */

let id = 0;

function template2dom (htmlString, selector) {
  let tmp = document.createElement('template');
  tmp.innerHTML = htmlString.trim();
  return selector ? tmp.content.querySelector(selector) : tmp.content.firstChild
}

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction) {
  return createElement('input', { id: id, class: 'tabelle-arrow', type: 'radio', name: 'sort', value: name + '-' + direction })
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

function createHeader ({ name, input, value, nosort, nofilter }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent);
  const idUp = idGen();
  const upRadio = nosort ? '' : arrowRadio(idUp, name, 'asc');
  const upLabel = nosort ? '' : arrowLabel(idUp, 'asc');

  const idDown = idGen();
  const downRadio = nosort ? '' : arrowRadio(idDown, name, 'desc');
  const downLabel = nosort ? '' : arrowLabel(idDown, 'desc');

  const filter = createFilter(nofilter, name, value, input);

  return createElement('div', { class: 'tabelle-header' },
    header, upRadio, upLabel, downRadio, downLabel, filter)
}

function createForm (uri) {
  const submitButton = createElement('input', { type: 'submit', class: 'hide' });
  return createElement('form', { action: uri }, submitButton)
}

function extractContent (el) {
  if (el.childNodes.length) {
    return el.childNodes[0]
  }
  return el.textContent
}

class Tabelle extends HTMLElement {
  connectedCallback () {
    this.table.classList.add('tabelle');
    if (this.action) {
      this.createForm();
    }
    this.transformHeaders();

    this.arrows.forEach(el => this.submitOnChange(el));
    this.textFilters.forEach(el => this.submitOnKeyup(el));
    this.selectFilters.forEach(el => this.submitOnChange(el));

    this.form.addEventListener('submit', ev => {
      ev.preventDefault();
      this.submitForm();
    });

    if (this.changeUri) {
      window.onpopstate = ev => this.restoreState(ev.state);
    }
  }

  createForm () {
    const form = createForm(this.action);
    prependChild(form, this);
    prependChild(this.table, form);
  }

  transformHeaders () {
    this.headers
      .filter(th => th.getAttribute('name'))
      .forEach(th => {
        const name = th.getAttribute('name');
        const value = th.getAttribute('value');
        const headerContent = extractContent(th);
        const properties = {
          name: name,
          value: value,
          input: th.querySelector('.tabelle-input'),
          nosort: th.hasAttribute('nosort'),
          nofilter: th.hasAttribute('nofilter')
        };

        const newContent = createHeader(properties, headerContent);
        replaceNode(th, createElement('th', {}, newContent));
      });
  }

  submitOnChange (input) {
    input.addEventListener('change', () => {
      this.submitForm();
    });
  }

  submitOnKeyup (input) {
    input.addEventListener('keyup', debounce(300, () => this.submitForm()));
  }

  submitForm () {
    submit(this.form)
      .then(response => {
        if (!response.ok) {
          throw new Error('Submit not successful')
        }
        return response.text()
          .then(html => ({ html: html, uri: response.url }))
      }).then(({ html, uri }) => {
        let tabelle = template2dom(html, '.tabelle tbody');
        replaceNode(this.tableBody, tabelle);
        this.updateState(uri, tabelle);
      });
  }

  updateState (uri, tbody) {
    if (this.changeUri) {
      let state = { tbody: tbody.innerHTML };
      history.pushState(state, document.title, uri);
    }
  }

  restoreState (state) {
    if (state.tbody) {
      this.tableBody = state.tbody;
    }
  }

  get arrows () {
    return find(this, '.tabelle-arrow')
  }

  get textFilters () {
    return find(this, '[type=text].tabelle-input')
  }

  get selectFilters () {
    return find(this, 'select.tabelle-input')
  }

  get headers () {
    return find(this, 'thead th')
  }

  get action () {
    return this.getAttribute('search-src')
  }

  get form () {
    return this.querySelector('form')
  }

  get table () {
    return this.querySelector('.tabelle')
  }

  get tableBody () {
    return this.querySelector('.tabelle tbody')
  }

  set tableBody (htmlString) {
    this.tableBody.innerHTML = htmlString;
  }

  get changeUri () {
    return this.hasAttribute('change-uri')
  }
}

customElements.define('ta-belle', Tabelle);

}());
