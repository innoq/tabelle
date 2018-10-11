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

let id = 0;

function idGen () {
  return 'arrowId' + id++
}

function arrowRadio (id, name, direction) {
  return createElement('input', { id: id, class: 'tabelle-arrow', type: 'radio', name: name + 'Sort', value: direction })
}

function arrowLabel (id, direction) {
  return createElement('label', { for: id, class: 'tabelle-arrow--' + direction })
}

function createHeader ({ name, input }, tdContent) {
  const header = createElement('span', { class: 'header' }, tdContent);
  const idUp = idGen();
  const upRadio = arrowRadio(idUp, name, 'asc');
  const upLabel = arrowLabel(idUp, 'asc');

  const idDown = idGen();
  const downRadio = arrowRadio(idDown, name, 'desc');
  const downLabel = arrowLabel(idDown, 'desc');

  const filter = input || createElement('input', { type: 'text', name: name, class: 'tabelle-input' });

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
    this.createForm();
    this.transformHeaders();
  }

  createForm () {
    const form = createForm(this.action);
    prependChild(form, this);
    prependChild(this.table, form);
  }

  transformHeaders () {
    this.headers
      .filter ( th => th.getAttribute('name') )
      .forEach ( th => {
        const name = th.getAttribute('name');
        const headerContent = extractContent(th);
        const properties = {
          name: name,
          input: th.querySelector('.tabelle-input')
        };

        const newContent = createHeader(properties, headerContent);
        replaceNode(th, createElement('th', {}, newContent));
      });
  }

  get headers () {
    return find(this, 'thead th')
  }

  get action () {
    return this.getAttribute('search-src')
  }

  get table () {
    return this.querySelector('table')
  }
}

customElements.define('ta-belle', Tabelle);

}());
