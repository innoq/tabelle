/* eslint-env browser */
import { listenForChange } from "../../util";
import List from "list.js";
import { find } from "uitil/dom";
import { transformHeaders } from "../header/header";
import debounce from "uitil/debounce";

function transformTabelle (tabelle) {
	const table = tabelle.querySelector("table");
	if (table) {
		table.classList.add("tabelle");
	}

	transformHeaders(find(tabelle, "thead th"), null,
			tabelle.getAttribute("sort") || "");
	return tabelle;
}

export class TabelleCljs extends HTMLElement {
	connectedCallback() {
		transformTabelle(this);

		this.headers = find(this, "thead th").map(el => el.getAttribute("data-name"));

		this.addListJsClasses();

		this.list = new List(this.querySelector("table"), {
			valueNames: this.headers.filter(e => e)
		});

		this.valueCache = {};
		this.addListeners();
	}

	addListJsClasses() {
		let container = this.querySelector("tbody") || this.querySelector("table");
		container.classList.add("list");

		find(this, "tbody tr").forEach(tr => {
			find(tr, "td").forEach((td, i) => {
				if (this.headers[i]) {
					td.classList.add(this.headers[i]);
				}
			});
		});
	}

	addListeners() {
		this.addEventListener("change",
				listenForChange("tabelle-input", this.filter.bind(this), this.valueCache));
		this.addEventListener("change",
				listenForChange("tabelle-arrow", this.sort.bind(this), this.valueCache));
		this.addEventListener("keyup",
			debounce(300, listenForChange("tabelle-input", this.filter.bind(this), this.valueCache)));
	}

	sort(event) {
		let arrow = event.target;
		let sortValue = arrow.value.split("-");

		if (!sortValue || sortValue.length !== 2) {
			return;
		}

		let column = sortValue[0];
		let order = sortValue[1];

		this.list.sort(column, { order });

		find(this, "[aria-sort]").forEach(el => el.removeAttribute("aria-sort"));
		arrow.closest("th").setAttribute("aria-sort",
				order === "asc" ? "ascending" : "descending");
	}

	filter(event) {
		// TODO: implement filtering
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}

/*
TODOS:
[ ] Handle `colspan` ?
*/
