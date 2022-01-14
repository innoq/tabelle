/* eslint-env browser */

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
	if (input.hasAttribute("aria-labelledby") && document.querySelector(`[id=${input.getAttribute("aria-labelledby")}]`)) {
		return true;
	}
	return false;
}

export class TabelleSearch extends HTMLElement {
	connectedCallback() {
		this.hidden = false;

		if (!findLabel(this.input)) {
			this.input.style.border = "3px solid red";
		}
	}

	get input() {
		return this.querySelector("input");
	}
}
