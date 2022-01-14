/* eslint-env browser */
import Tabelle from "./components/tabelle/";
import { TabelleSearch } from "./components/tabelle-search";

customElements.define("ta-belle", Tabelle);

if (!customElements.get("tabelle-search")) {
	customElements.define("tabelle-search", TabelleSearch);
}
