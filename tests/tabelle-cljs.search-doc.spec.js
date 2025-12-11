import { describe, it, expect } from "vitest";
import { mount, rows } from "./helpers/dom";

const tbodyHtml = rows => rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");

describe("tabelle-search examples", () => {
	it("filters when tabelle-search is a child of tabelle-cljs", async () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<tabelle-search hidden debounce="0">
					<label for="table-filter">Filter Table:</label>
					<input id="table-filter" type="search">
					<button>Search</button>
				</tabelle-search>
				<table>
					<thead>
						<tr><th>Animal</th><th>Food</th><th>Color</th><th>Date</th></tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);

		const searchEl = el.querySelector("tabelle-search");
		searchEl.input.value = "Bear";
		searchEl.sendSearchEvent();
		await new Promise(res => setTimeout(res, 10));

		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Bear");
	});

	it("filters when tabelle-search references tabelle-cljs by id", async () => {
		const wrapper = mount(`
			<div>
				<tabelle-search hidden tabelleId="tabelle" debounce="0">
					<label for="table-filter">Filter Table:</label>
					<input id="table-filter" type="search">
					<button>Search</button>
				</tabelle-search>
				<tabelle-cljs debounce="0" id="tabelle">
					<table>
						<thead>
							<tr><th>Animal</th><th>Food</th><th>Color</th><th>Date</th></tr>
						</thead>
						<tbody>${tbodyHtml(rows)}</tbody>
					</table>
				</tabelle-cljs>
			</div>
		`);

		const searchEl = wrapper.querySelector("tabelle-search");
		searchEl.input.value = "Cat";
		searchEl.sendSearchEvent();
		await new Promise(res => setTimeout(res, 10));

		const table = wrapper.querySelector("tabelle-cljs");
		const visible = [...table.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Cat");
	});
});
