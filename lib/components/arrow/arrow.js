/* eslint-env browser */
import { createElement } from "uitil/dom/create";

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
