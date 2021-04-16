/* eslint-env browser */
import { template2dom, extractContent, submitForm as submit, listenForChange }
	from "../../util";
import { find, replaceNode, prependChild } from "uitil/dom";
import { createElement } from "uitil/dom/create";
import { nid } from "uitil/uid";
import debounce from "uitil/debounce";

function idGen (prefix = "arrowId") {
	return prefix + "-" + nid();
}

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

function createForm (uri) {
	const submitButton = createElement("input", { type: "submit", class: "hide" });
	return createElement("form", { id: idGen("tabelle"), action: uri }, submitButton);
}

function transformHeaders (headers, formId, currentSort) {
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
			nofilter: th.hasAttribute("nofilter")
		};

		const newContent = createHeader(properties, headerContent);
		replaceNode(th, createElement("th", {}, newContent));
	});
}

function tabelleId (tabelle) {
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

	transformHeaders(find(tabelle, "thead th"), tabelleId(tabelle),
			tabelle.getAttribute("sort") || "");
	return tabelle;
}

export default class Tabelle extends HTMLElement {
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
		submit(this.form).then(response => {
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
