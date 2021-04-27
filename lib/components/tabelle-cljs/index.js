/* eslint-env browser */
import { template2dom, listenForChange } from "../../util";
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
		this.list.items.forEach(item => {
			let values = item.values();
			for (let key in values) {
				let html = template2dom(values[key]);
				values[key] = html.textContent;
			}
		})

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
		this.list.search("_", this.searchFunction.bind(this));
	}

	searchFunction(_searchString, _columns) {
		for (var k = 0, kl = this.list.items.length; k < kl; k++) {
			let item = this.list.items[k];

			item.found = true;
			for (let key in this.valueCache) {
				if (!item.values()[key]) continue;

				let filterString = this.valueCache[key] && this.valueCache[key].toLowerCase().trim();
				let value = item.values()[key];
				item.found = item.found && value.includes(filterString);
			}
		}
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}

/*
TODOS:
[ ] Handle `colspan` ?
*/
