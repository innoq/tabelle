import { beforeEach } from "vitest";

export const rows = [
	["Bear", "Honey", "Brown", "2025-08-11", "09:00"],
	["Cat", "Fish", "Black", "2021-02-01", "21:00"],
	["Dog", "Meat", "White", "2021-03-05", "07:30"],
	["Ant", "Sugar", "Red", "2021-01-02", "13:15"]
];

export function mount(html) {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = html.trim();
	const el = wrapper.firstElementChild;
	document.body.appendChild(el);
	return el;
}

beforeEach(() => {
	document.body.innerHTML = "";
});
