/* eslint-env browser */
import { TabelleCljs } from "./components/tabelle-cljs";
import { TabelleSearch } from "./components/tabelle-search";

customElements.define("tabelle-cljs", TabelleCljs);

if (!customElements.get("tabelle-search")) {
	customElements.define("tabelle-search", TabelleSearch);
}
