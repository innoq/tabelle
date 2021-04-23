/* eslint-env browser */
import { createElement } from "uitil/dom/create";

export function createFilter (form, name, value, columnName, disabled) {
	if (disabled) {
		return "";
	}
	form = form && { form };
	return createElement("input", {
		...form,
		type: "text",
		name: name,
		class: "tabelle-input",
		value: value || "",
		"aria-label": "Filter " + columnName
	});
}
