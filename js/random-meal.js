import { HtmlLoader } from "./pageContentLoader.js";

import { RecipieFetcher } from "./recipieFetcher.js";

let htmlLoader = new HtmlLoader();
htmlLoader.loadHtml("./components/nav-bar.html", "header");
htmlLoader.loadHtml("./components/card-placeholder.html", "recipie-display");

document.getElementById("recipie-display").innerHTML = "";
let randomRecipie = new RecipieFetcher();
randomRecipie.fetchRecipie("random");