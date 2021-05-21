/* eslint-env browser */
import { extractContent } from "../../util";
import { replaceNode } from "uitil/dom";
import { createElement } from "uitil/dom/create";
import { createArrows } from "../arrow/arrow";
import { createFilter } from "../input/input";
import { nid } from "uitil/uid";

function setFormFor (input, form) {
	if (input && form) {
		input.setAttribute("form", form);
	}
	return input;
}

function createHeader ({ form, name, input, value, nosort, nofilter, currentSort },
		tdContent) {
	const headerId = "header" + "-" + nid();
	const columnName = tdContent.textContent;
	const header = createElement("span", { class: "header", id: headerId }, tdContent);

	const sort = nosort ? [] : createArrows(form, name, columnName, currentSort);

	const filter = setFormFor(input, form) ||
		createFilter(form, name, value, columnName, nofilter);

	return createElement("div",
			{ class: "tabelle-header", role: "group", "aria-labelledby": headerId },
			header, ...sort, filter);
}

export function transformHeaders (headers, formId, currentSort, nofilter) {
	let newHeaders = headers.filter(th => th.getAttribute("name")).map(th => {
		const name = th.getAttribute("name");
		const value = th.getAttribute("value");
		const headerContent = extractContent(th);
		const properties = {
			name,
			value,
			input: th.querySelector(".tabelle-input"),
			form: formId,
			currentSort,
			nosort: th.hasAttribute("nosort"),
			nofilter: nofilter || th.hasAttribute("nofilter")
		};

		const newContent = createHeader(properties, headerContent);
		const newHeader = createElement("th",
				{ "data-name": name, scope: "col" },
				newContent);
		replaceNode(th, newHeader);

		return newHeader;
	});

	addRadioFocus(newHeaders);
}

/*
We want to use the default behavior of a radio button to our advantage,
but for keyboard users the radio buttons _look_ like buttons, so you expect
the focus management to _behave_ like buttons as well. With the default
focus behavior, when a radio button has been selected, any radio button without
the same exact `name` will no longer be able to be focused via `tab`.

With this function, we implement custom focus management for the input fields
within the Tabelle header. We iterate through all of the form input fields in
the header and ensure that the focus follows the order of elements in the HTML.

The `.tabelle-arrow` is also problematic when it is the first focussable child
in the headers (tabbing _into_ the component will not reliably select the arrow
as the first child). To work around this, we make the `table` focussable via
tab and then ensure that the focus will move correctly from the table to
the first arrow.

The `.tabelle-arrow` is also problematic if it is the last focussable child in
the headers (doesn't occur that often because often the `.tabelle-input` will
be the last child). For this we add a workaround and make the last `label`
focussable via keyboard to escape the focus trap from the arrow. This is maybe
not completely ideal, but it allows users to continue tabbing through the
interface with only one tab.
*/
function addRadioFocus(headers) {
	let elements = headers.map(header => {
		let arrowUp = header.querySelector(".tabelle-arrow[value$=-asc]");
		let arrowDown = header.querySelector(".tabelle-arrow[value$=-desc]");
		let input = header.querySelector(".tabelle-input");

		return [arrowUp, arrowDown, input].filter(e => e);
	}).filter(elements => elements.length).flat();

	if (!elements.length) {
		return;
	}

	let table = elements[0].closest("table");
	table.setAttribute("tabindex", "0");

	elements = [table].concat(elements);

	if (elements[elements.length - 1].classList.contains("tabelle-arrow")) {
		// Manually setting the focus on the `.tabelle-arrow` is problematic when
		// the `.tabelle-arrow` is the last focussable element in the header
		// because then the focus gets trapped within the arrow when you are tab
		// through the interface. This workaround makes the label behind the arrow

		let header = elements[elements.length - 1].parentNode;
		let label = header.querySelector(".tabelle-arrow--desc");
		elements = elements.concat(label);
		label.setAttribute("tabindex", 0);
	}

	elements.forEach((element, i) => {
		let prev = i > 0 && elements[i - 1];
		let next = i < elements.length && elements[i + 1];

		element.addEventListener("keydown", event => {
			if (element !== event.target) {
				return;
			}

			if (event.key === "Tab" && !event.shiftKey && next) {
				event.preventDefault();
				next.focus();
			}
			if (event.key === "Tab" && event.shiftKey && prev) {
				event.preventDefault();
				prev.focus();
			}
		});
	});
}
