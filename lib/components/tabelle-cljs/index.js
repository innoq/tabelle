/* eslint-env browser */
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
	}
}
