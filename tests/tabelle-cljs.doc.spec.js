import { describe, it, expect } from "vitest";
import { rows, mount } from "./helpers/dom";

const tbodyHtml = rows => rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");

describe("tabelle-cljs doc examples", () => {
	it("progressively enhances basic table (adds classes and filters)", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th>Animal</th>
							<th>Food</th>
							<th>Color</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);

		const inputs = el.querySelectorAll(".tabelle-input");
		expect(inputs.length).toBe(4);
		// filter on first column
		inputs[0].value = "Cat";
		inputs[0].dispatchEvent(new Event("change", { bubbles: true }));
		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Cat");
	});

	it("uses custom name classes when name attributes provided", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th name="animal">Animal</th>
							<th name="food">Food</th>
							<th name="color">Color</th>
							<th name="date">Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		expect([...el.querySelectorAll("td")].some(td => td.classList.contains("animal"))).toBe(true);
	});

	it("uses supplied select as custom filter field", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th>Animal</th>
							<th>Food</th>
							<th><span>Color</span><select class="tabelle-input" aria-label="Filter Column 3">
								<option>Brown</option>
								<option>Black</option>
								<option>White</option>
							</select></th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		const select = el.querySelector("select.tabelle-input");
		expect(select).toBeTruthy();
		select.value = "Black";
		select.dispatchEvent(new Event("change", { bubbles: true }));
		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Black");
	});

	it("supports custom element wrapper around filter inputs", () => {
		if (!customElements.get("custom-input")) {
			customElements.define("custom-input", class extends HTMLElement {});
		}
		if (!customElements.get("custom-select")) {
			customElements.define("custom-select", class extends HTMLElement {});
		}

		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th>Animal</th>
							<th>
								Food
								<custom-input>
									<input class="tabelle-input" aria-label="Filter Column 2">
								</custom-input>
							</th>
							<th>
								Color
								<custom-select>
									<select class="tabelle-input" aria-label="Filter Column 3">
										<option>Brown</option>
										<option>Red</option>
										<option>Black</option>
									</select>
								</custom-select>
							</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);

		const select = el.querySelector("custom-select select");
		select.value = "Red";
		select.dispatchEvent(new Event("change", { bubbles: true }));
		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Red");
	});

	it("filters structured HTML using textContent", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead><tr><th>Animal</th><th>Food</th><th>Color</th><th>Date</th></tr></thead>
					<tbody>
						<tr><td><strong>Dog</strong></td><td><span>Meat</span></td><td>White</td><td>2021</td></tr>
						<tr><td><strong>Cat</strong></td><td><span>Fish</span></td><td>Black</td><td>2022</td></tr>
					</tbody>
				</table>
			</tabelle-cljs>
		`);
		const input = el.querySelector(".tabelle-input");
		input.value = "Cat";
		input.dispatchEvent(new Event("change", { bubbles: true }));
		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible).toHaveLength(1);
		expect(visible[0].textContent).toContain("Cat");
	});

	it("sorts by data-sort values", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead><tr><th>Date</th><th>Time</th></tr></thead>
					<tbody>
						<tr><td data-sort="2021-31-09">09/31/2021</td><td data-sort="09:00">9:00 AM</td></tr>
						<tr><td data-sort="2021-02-01">02/01/2021</td><td data-sort="21:00">9:00 PM</td></tr>
						<tr><td data-sort="2025-08-11">08/11/2025</td><td data-sort="16:00">4:00 PM</td></tr>
					</tbody>
				</table>
			</tabelle-cljs>
		`);
		const descArrow = el.querySelector('.tabelle-arrow[value$=\"-desc\"]');
		descArrow.dispatchEvent(new Event("change", { bubbles: true }));
		const firstRow = el.querySelector("tbody tr");
		expect(firstRow.textContent).toContain("08/11/2025");
	});

	it("supports colspan mapping (keeps classes aligned)", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th>Column 1</th>
							<th>Column 2</th>
							<th>Column 3</th>
							<th>Column 4</th>
							<th>Column 5</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>Column 1</td><td colspan="2">Column 2</td><td colspan="2">Column 4</td></tr>
						<tr><td colspan="5">Column 1</td></tr>
						<tr><td colspan="3">Column 1</td><td colspan="2">Column 4</td></tr>
						<tr><td>Column 1</td><td colspan="3">Column 2</td><td>Column 5</td></tr>
					</tbody>
				</table>
			</tabelle-cljs>
		`);
		const tds = el.querySelectorAll("tbody tr:first-child td");
		tds.forEach(td => {
			expect(td.classList.length).toBeGreaterThan(0);
		});
	});

	it("respects nosort and nofilter attributes", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th>Animal</th>
							<th nosort>Food</th>
							<th nofilter>Color</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		const headers = el.querySelectorAll("th");
		expect(headers[1].querySelectorAll(".tabelle-arrow").length).toBe(0);
		expect(headers[2].querySelectorAll(".tabelle-input").length).toBe(0);
	});

	it("applies initial filter value from th value attribute", () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead>
						<tr>
							<th value="e">Animal</th>
							<th>Food</th>
							<th>Color</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		const visible = [...el.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none");
		expect(visible.length).toBe(1);
		expect(visible[0].textContent).toContain("Bear");
	});

	it("applies initial sort direction", () => {
		const el = mount(`
			<tabelle-cljs debounce="0" sort="animal-desc">
				<table>
					<thead>
						<tr>
							<th name="animal">Animal</th>
							<th>Food</th>
							<th>Color</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		const first = el.querySelector("tbody tr");
		expect(first.textContent.startsWith("Dog")).toBe(true);
	});

	it("disables filter generation with nofilter attribute on table", () => {
		const el = mount(`
			<tabelle-cljs debounce="0" nofilter>
				<table>
					<thead>
						<tr>
							<th>Animal</th>
							<th>Food</th>
							<th>Color</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>${tbodyHtml(rows)}</tbody>
				</table>
			</tabelle-cljs>
		`);
		expect(el.querySelectorAll(".tabelle-input").length).toBe(0);
	});

	it("indexes added rows and removes deleted rows", async () => {
		const el = mount(`
			<tabelle-cljs debounce="0">
				<table>
					<thead><tr><th>Animal</th><th>Food</th></tr></thead>
					<tbody>
						<tr><td>Dog</td><td>Meat</td></tr>
					</tbody>
				</table>
			</tabelle-cljs>
		`);
		const tbody = el.querySelector("tbody");
		const newRow = document.createElement("tr");
		newRow.innerHTML = "<td>Cat</td><td>Fish</td>";
		tbody.appendChild(newRow);

		await new Promise(res => setTimeout(res, 0));
		let visible = [...tbody.querySelectorAll("tr")].filter(tr => tr.style.display !== "none");
		expect(visible.length).toBe(2);

		newRow.remove();
		await new Promise(res => setTimeout(res, 20));
		visible = [...tbody.querySelectorAll("tr")].filter(tr => tr.style.display !== "none");
		expect(visible.length).toBe(1);
	});
});
