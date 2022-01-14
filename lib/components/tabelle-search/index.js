/* eslint-env browser */

import debounce from "uitil/debounce";
import { find } from "uitil/dom";

function findLabel(input) {
	if (input.id && document.querySelector(`label[for="${input.id}"]`)) {
		return true;
	}
	if (input.closest("label")) {
		return true;
	}
	if (input.getAttribute("aria-label")) {
		return true;
	}
	if (input.hasAttribute("aria-labelledby") &&
		document.querySelector(`[id=${input.getAttribute("aria-labelledby")}]`)) {
		return true;
	}
	return false;
}

export class TabelleSearch extends HTMLElement {
	connectedCallback() {
		if (!this.input) {
			return;
		}

		this.hidden = false;

		if (!findLabel(this.input)) {
			console.error("Expected a label for this input field: ", this.input);
			this.input.style.border = "3px solid red";
		}

		this.input.addEventListener("keyup",
				debounce(this.debounce, this.sendSearchEvent.bind(this)));
		this.input.addEventListener("search", this.sendSearchEvent.bind(this));
		this.sendSearchEvent();

		find(this, "[type=submit], button:not([type=button]):not([type=reset])").forEach(
				button => button.addEventListener("click", ev => {
					ev.preventDefault();
					this.sendSearchEvent();
				}));
	}

	sendSearchEvent() {
		// Check cached values because this event is called on "keyup", "search",
		// and when a submit button is clicked. We want to avoid unnecessary events
		// if possible because certain Tabelle components can trigger a form submit
		// when this event is sent.
		if (this.input.value === this.cachedValue) {
			return;
		}

		let eventTarget = this.tabelle || this;
		this.cachedValue = this.input.value;
		eventTarget.dispatchEvent(new CustomEvent("tabelle-search", {
			detail: {
				name: this.input.value,
				value: this.cachedValue
			},
			bubbles: !this.tabelle
		}));
	}

	get tabelle() {
		let tabelleId = this.getAttribute("tabelleId");
		return tabelleId && document.getElementById(tabelleId);
	}

	get input() {
		return this.querySelector("input");
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}
