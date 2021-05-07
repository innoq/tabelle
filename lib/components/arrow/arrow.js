/* eslint-env browser */
import { createElement } from "uitil/dom/create";
import { nid } from "uitil/uid";

function idGen (prefix = "arrowId") {
	return prefix + "-" + nid();
}

export function arrowRadio (form, id, name, direction, checked) {
	form = form && { form };
	return createElement("input", {
		id: id,
		...form,
		class: "tabelle-arrow",
		type: "radio",
		name: "sort",
		value: name + "-" + direction,
		checked: checked ? "checked" : false
	});
}

function directionName (direction) {
	if (direction === "asc") {
		return "Ascending";
	}
	if (direction === "desc") {
		return "Descending";
	}
	return "";
}

export function arrowLabel (id, columnName, direction) {
	return createElement("label", { for: id, class: "tabelle-arrow--" + direction },
			createElement("span", { class: "visually-hidden" },
					"Sort " + columnName + " " + directionName(direction)));
}

export function createArrows(form, name, columnName, currentSort) {
	const idUp = idGen();
	const upRadio = arrowRadio(form, idUp, name, "asc", currentSort === name + "-asc");
	const upLabel = arrowLabel(idUp, columnName, "asc");

	const idDown = idGen();
	const downRadio = arrowRadio(form, idDown, name, "desc",
			currentSort === name + "-desc");
	const downLabel = arrowLabel(idDown, columnName, "desc");

	return [upRadio, upLabel, downRadio, downLabel];
}
