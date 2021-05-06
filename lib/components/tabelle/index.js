/* eslint-env browser */
import { template2dom, submitForm as submit, listenForChange } from "../../util";
import { find, prependChild } from "uitil/dom";
import { createElement } from "uitil/dom/create";
import { transformHeaders } from "../header/header";
import { nid } from "uitil/uid";
import debounce from "uitil/debounce";

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
