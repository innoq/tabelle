(function () {
'use strict';

// NB: not necessary when using ES6 spread syntax: `[...nodes].map(…)`
function find(node, selector) {
	if(node.substr) { // for convenience
		[selector, node] = [node, selector];
	}
	let nodes = node.querySelectorAll(selector);
	return toArray(nodes);
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

let { slice } = Array.prototype;
let toArray = items => slice.call(items);

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

function template2dom (htmlString, selector) {
	const tmp = document.createElement("template");
	tmp.innerHTML = htmlString.trim();
	return selector ? tmp.content.querySelector(selector) : tmp.content.firstChild;
}

function extractContent (el) {
	if (el.childNodes.length) {
		return el.childNodes[0];
	}
	return el.textContent;
}

// Adapted from https://github.com/FND/hijax-form/blob/master/src/util.js
function submitForm (form, { headers, cors, strict } = {}) {
	let method = form.getAttribute("method");
	method = method ? method.toUpperCase() : "GET";
	let uri = form.getAttribute("action");
	const payload = serializeForm(form);

	if (method === "GET") {
		if (uri.indexOf("?") !== -1) {
			throw new Error("query strings are invalid within `GET` forms\" " +
					"`action` URI please use hidden fields instead");
		}
		uri = [uri, payload].join("?");
	} else {
		headers = headers || {};
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		var body = payload; // eslint-disable-line no-var
	}

	form.setAttribute("aria-busy", "true");
	const reset = () => {
		form.removeAttribute("aria-busy");
	};
	return httpRequest(method, uri, headers, body, { cors, strict }).then(res => {
		reset();
		return res;
	}).catch(err => {
		reset();
		throw err;
	});
}

function inputsFor (form) {
	let container = form;
	let formSelector = "";
	if (form.id && document.querySelector(`[form=${form.id}]`)) {
		container = document;
		formSelector = `[form=${form.id}]`;
	}
	const selector = ["input", "textarea", "select"].map(tag =>
		`${tag}[name]${formSelector}:not(:disabled)`).join(", ");
	return find(container, selector);
}

function radioButtonFor (form, name) {
	let container = form;
	let formSelector = "";
	if (form.id && document.querySelector(`[form=${form.id}]`)) {
		container = document;
		formSelector = `[form=${form.id}]`;
	}
	let radioSelector = `input[type=radio][name=${name}]${formSelector}:checked`;
	return container.querySelector(radioSelector);
}

// stringify form data as `application/x-www-form-urlencoded`
// required due to insufficient browser support for `FormData`
// NB: only supports a subset of form fields, notably excluding named buttons
//		 and file inputs
function serializeForm (form) {
	const radios = {};
	return inputsFor(form).reduce((params, node) => {
		const { name } = node;
		let value;
		switch (node.nodeName.toLowerCase()) {
		case "textarea":
			value = node.value;
			break;
		case "select":
			value = node.multiple ?
				find(node, "option:checked").map(opt => opt.value) :
				node.value;
			break;
		case "input":
			switch (node.type) {
			case "file":
				throw new Error("`input[type=file]` fields are unsupported");
			case "checkbox":
				if (node.checked) {
					value = node.value;
				}
				break;
			case "radio":
				if (!radios[name]) {
					const field = radioButtonFor(form, name);
					value = field ? field.value : undefined;
					if (value) {
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

		if (value !== undefined) {
			let values = value || [""];
			if (!values.pop) {
				values = [values];
			}
			values.forEach(value => {
				const param = [name, value].map(encodeURIComponent).join("=");
				params.push(param);
			});
		}
		return params;
	}, []).join("&");
}

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

function createForm (uri) {
	const submitButton = createElement("input", { type: "submit", class: "hide" });
	return createElement("form", { id: "tabelle-" + nid(), action: uri }, submitButton);
}

function formId (tabelle) {
	return tabelle.querySelector("ta-belle > form").id;
}

function transformTabelle (tabelle) {
	const table = tabelle.querySelector("table");
	if (table) {
		table.classList.add("tabelle");
	}

	const action = tabelle.getAttribute("search-src");
	if (action) {
		const form = createForm(action);
		prependChild(form, tabelle);
	}

	transformHeaders(find(tabelle, "thead th"), formId(tabelle),
			tabelle.getAttribute("sort") || "", tabelle.hasAttribute("nofilter"));
	return tabelle;
}

class Tabelle extends HTMLElement {
	connectedCallback () {
		if (!this.id) {
			console.error("Tabelle needs an id attribute in order to be created.");
			return;
		}

		transformTabelle(this);
		this.addListeners();

		if (this.changeUri) {
			history.replaceState({ tabelle: this.innerHTML },
					document.title, window.location.href);
			window.onpopstate = ev => this.restoreState(ev);
		}
	}

	setFocus () {
		if (this.focused) {
			const toFocus = this.querySelector(`.tabelle-input[name="${this.focused}"]`);
			if (toFocus) {
				const tmpVal = toFocus.value;
				toFocus.focus();
				toFocus.value = "";
				toFocus.value = tmpVal;
			}
		}
	}

	addListeners () {
		const { form } = this;
		const submitForm = () => this.submitForm();
		const valueCache = {};
		this.addEventListener("change",
				listenForChange("tabelle-input", submitForm, valueCache));
		this.addEventListener("change",
				listenForChange("tabelle-arrow", submitForm, valueCache));
		this.addEventListener("keyup",
				debounce(this.debounce,
						listenForChange("tabelle-input", submitForm, valueCache)));

		form.addEventListener("submit", ev => {
			this.submitForm();
			ev.preventDefault();
		});
	}

	submitForm () {
		submitForm(this.form).then(response => {
			if (!response.ok) {
				throw new Error("Submit not successful");
			}
			return response.text().then(html => ({ html: html, uri: response.url }));
		}).then(({ html, uri }) => {
			const tabelle = template2dom(html, "#" + this.id);

			const active = document.activeElement;
			this.focused = null;
			if (active && this.contains(active)) {
				this.focused = active.getAttribute("name");
			}

			const transformedTabelle = transformTabelle(tabelle);
			const markup = transformedTabelle.innerHTML;

			this.innerHTML = markup;
			this.setFocus();

			this.updateState(uri, markup);
		});
	}

	updateState (uri, tabelleMarkup) {
		if (this.changeUri) {
			const state = { tabelle: tabelleMarkup };
			history.pushState(state, document.title, uri);
		}
	}

	restoreState (event) {
		const state = event.state && event.state.tabelle;
		if (state) {
			this.innerHTML = state;
			this.setFocus();
		}
	}

	get form () {
		return this.querySelector("ta-belle > form");
	}

	get changeUri () {
		return this.hasAttribute("change-uri");
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}

/* eslint-env browser */

customElements.define("ta-belle", Tabelle);

}());
