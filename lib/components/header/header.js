/* eslint-env browser */
import { extractContent } from "../../util";
import { replaceNode } from "uitil/dom";
import { createElement } from "uitil/dom/create";
import { arrowRadio, arrowLabel } from "../arrow/arrow";
import { createFilter } from "../input/input";
import { nid } from "uitil/uid";

function idGen (prefix = "arrowId") {
	return prefix + "-" + nid();
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

export function transformHeaders (headers, formId, currentSort, nofilter) {
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
			nofilter: nofilter || th.hasAttribute("nofilter")
		};

		const newContent = createHeader(properties, headerContent);
		replaceNode(th, createElement("th",
				{ "data-name": name, scope: "col" },
				newContent));
	});
}
