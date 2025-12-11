import { TabelleCljs } from "../../lib/components/tabelle-cljs";
import { TabelleSearch } from "../../lib/components/tabelle-search";

if (!customElements.get("tabelle-cljs")) {
	customElements.define("tabelle-cljs", TabelleCljs);
}

if (!customElements.get("tabelle-search")) {
	customElements.define("tabelle-search", TabelleSearch);
}
