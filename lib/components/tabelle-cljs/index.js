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
			valueNames: this.columns.filter(e => e),
			item: `<tr>${this.columns.map(c => `<td class="${c}"><td>`).join("")}</tr>`
		});
		this.indexValues();

		this.valueCache = {};
		this.addListeners();

		this.initSortAndFilter();

		new MutationObserver(this.watchForMutations.bind(this)).
			observe(this.tbody, { childList: true, subtree: true });
	}

	addListJsClasses() {
		let container = this.querySelector("tbody") || this.querySelector("table");
		container.classList.add("ta-list");

		find(this, "tbody tr").forEach(tr => {
			this.addJsClassToTr(tr);
		});
	}

	addJsClassToTr(tr) {
		let offset = 0;
		find(tr, "td").forEach((td, i) => {
			if (this.columns[i + offset]) {
				td.classList.add(this.columns[i + offset]);

				let colspan = td.getAttribute("colspan") &&
					parseInt(td.getAttribute("colspan"));
				offset += colspan ? colspan - 1 : 0;
			}
		});
	}

	indexValues() {
		this.list.items.forEach(item => {
			let values = item.values();
			for (let key in values) {
				let td = item.elm.querySelector(`.${key}`);
				if (td) {
					let value = {};
					value.filter = td.getAttribute("data-filter") || td.textContent || "";
					value.sort = td.getAttribute("data-sort") || td.textContent;
					values[key] = value;
				} else {
					values[key] = { filter: "", sort: "" };
				}
			}
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
		this.addEventListener("tabelle-search", ev => {
			this.globalFilter = ev.detail.value;
			this.filter();
		});
	}

	initSortAndFilter() {
		find(this, ".tabelle-input").forEach(input => {
			this.valueCache[input.name] = input.value || "";
		});
		this.filter();

		if (this.getAttribute("sort")) {
			let split = this.getAttribute("sort").split("-");
			this.sortColumn(split[0], split[1]);
		}

		this.list.on("searchStart", () => {
			this.filtering = true;
		});
		this.list.on("sortStart", () => {
			this.sorting = true;
		});
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
		if (!column || !order) {
			return;
		}

		this.currentSortColumn = column;
		this.currentSortOrder = order;

		let naturalSort = this.list.utils.naturalSort;
		let sortFunction = function (itemA, itemB) {
			return naturalSort(itemA.values()[column].sort, itemB.values()[column].sort);
		};
		this.list.sort(`${column}`, { order, sortFunction });
		find(this, "[aria-sort]").forEach(el => el.removeAttribute("aria-sort"));
	}

	filter() {
		this.list.search("_", this.searchFunction.bind(this));
	}

	searchFunction(_searchString, _columns) {
		this.list.items.forEach(item => {
			item.found = !this.globalFilter;

			if (this.globalFilter) {
				for (let key in item.values()) {
					let value = item.values()[`${key}`].filter;

					item.found = item.found ||
						value.toLowerCase().trim().includes(this.globalFilter);
				}
			}

			for (let key in this.valueCache) {
				if (key === "sort") continue;

				let value = item.values()[`${key}`].filter;

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

	get tbody () {
		return this.querySelector("tbody");
	}

	watchForMutations(mutations) {
		if (this.filtering || this.sorting) {
			this.filtering = false;
			this.sorting = false;
			return;
		}

		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.tagName && node.tagName.toLowerCase() === "tr") {
					this.mutateTable(() => {
						this.addJsClassToTr(node);
						this.tbody.append(node);
					});
				} else {
					this.mutateTable(() => {});
				}
			});
			mutation.removedNodes.forEach(node => {
				if (node.tagName && node.tagName.toLowerCase() === "tr") {
					this.mutateTable(() => {
						node.remove();
					});
				}
			});
		});
	}

	/* Resets the List.js table, applies changes, and reindexes List.js table */
	mutateTable(mutationFn) {
		let valueCache = this.valueCache;
		let globalFilter = this.globalFilter;

		this.valueCache = {};
		this.globalFilter = false;

		this.filter();

		mutationFn();

		this.list.reIndex();
		this.indexValues();

		this.valueCache = valueCache;
		this.globalFilter = globalFilter;
		this.filter();
		this.sortColumn(this.currentSortColumn, this.currentSortOrder);
	}
}
