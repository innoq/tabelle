/* eslint-env browser */
import { listenForChange } from "../../util";
import List from "list.js";
import { find } from "uitil/dom";
import { transformHeaders } from "../header/header";
import debounce from "uitil/debounce";
import { nid } from "uitil/uid";

function transformTabelle (tabelle) {
	const table = tabelle.querySelector("table");
	if (table) {
		table.classList.add("tabelle");
	}

	find(tabelle, "thead th").forEach(el => {
		let name = el.getAttribute("name") || `ta-${nid()}`;
		el.setAttribute("name", name);

		let input = el.querySelector(".tabelle-input");
		if (input) {
			input.name = name;
		}
	});

	transformHeaders(find(tabelle, "thead th"), null,
			tabelle.getAttribute("sort") || "", tabelle.hasAttribute("nofilter"));
	return tabelle;
}

export class TabelleCljs extends HTMLElement {
	connectedCallback() {
		transformTabelle(this);

		this.columns = find(this, "thead th").map(el => el.getAttribute("data-name"));

		this.addListJsClasses();

		this.list = new List(this.querySelector("table"), {
			listClass: "ta-list",
			valueNames: this.columns.filter(e => e)
		});
		this.list.items.forEach(item => {
			let values = item.values();
			for (let key in values) {
				let td = item.elm.querySelector(`.${key}`);
				if (td) {
					values[key] = td.getAttribute("data-filter") || td.textContent;
				}
			}
		});

		this.valueCache = {};
		this.addListeners();

		this.initSortAndFilter();
	}

	addListJsClasses() {
		let container = this.querySelector("tbody") || this.querySelector("table");
		container.classList.add("ta-list");

		find(this, "tbody tr").forEach(tr => {
			let offset = 0;
			find(tr, "td").forEach((td, i) => {
				if (this.columns[i + offset]) {
					td.classList.add(this.columns[i + offset]);

					let colspan = td.getAttribute("colspan") &&
						parseInt(td.getAttribute("colspan"));
					offset += colspan ? colspan - 1 : 0;
				}
			});
		});
	}

	addListeners() {
		this.addEventListener("change",
				listenForChange("tabelle-input",
						this.filter.bind(this), this.valueCache));
		this.addEventListener("change",
				listenForChange("tabelle-arrow",
						this.sort.bind(this), this.valueCache));
		this.addEventListener("keyup",
				debounce(300, listenForChange("tabelle-input",
						this.filter.bind(this), this.valueCache)));
	}

	initSortAndFilter() {
		find(this, ".tabelle-input").forEach(input => {
			this.valueCache[input.name] = input.value;
		});
		this.filter();

		if (this.getAttribute("sort")) {
			let split = this.getAttribute("sort").split("-");
			this.sortColumn(split[0], split[1]);
		}
	}

	sort(event) {
		let arrow = event.target;
		let sortValue = arrow.value.split("-");

		if (!sortValue || sortValue.length < 2) {
			return;
		}

		// Handle class names which contain a `-` separator
		let column = sortValue.slice(0, sortValue.length - 1).join("-");
		let order = sortValue[sortValue.length - 1];

		this.sortColumn(column, order);

		arrow.closest("th").setAttribute("aria-sort",
				order === "asc" ? "ascending" : "descending");
	}

	sortColumn(column, order) {
		this.list.sort(`${column}`, { order });
		find(this, "[aria-sort]").forEach(el => el.removeAttribute("aria-sort"));
	}

	filter() {
		this.list.search("_", this.searchFunction.bind(this));
	}

	searchFunction(_searchString, _columns) {
		this.list.items.forEach(item => {
			item.found = true;
			for (let key in this.valueCache) {
				if (key === "sort") continue;

				let value = item.values()[`${key}`];

				if (value === null || value === undefined) {
					console.error(`Skipping unknown key: ${key}`);
					continue;
				}

				let filterString = this.valueCache[key] &&
					this.valueCache[key].toLowerCase().trim();

				item.found = item.found &&
					value.toLowerCase().trim().includes(filterString);
			}
		});
	}

	get debounce () {
		return parseInt(this.getAttribute("debounce")) || 300;
	}
}
