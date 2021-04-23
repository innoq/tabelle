/* eslint-env browser */
import List from "list.js";
import { find } from "uitil/dom";
import { transformHeaders } from "../header/header";

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

		this.initArrows();
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

	initArrows() {
		find(this, "thead [name=sort]").forEach(arrow => {
			arrow.addEventListener("change", el => {
				let arrow = el.target;
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
			});
		});
	}
}

/*
TODOS:
[ ] Handle `colspan` ?
*/
