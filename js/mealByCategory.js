import { HtmlLoader } from "./pageContentLoader.js";
import { RecipieFetcher } from "./recipieFetcher.js";

let htmlLoader = new HtmlLoader();
htmlLoader.loadHtml("./components/nav-bar.html", "header");
htmlLoader.loadHtml("./components/card-placeholder.html", "recipie-display");

let recipieFetcher = new RecipieFetcher();
recipieFetcher.fetchRecipie("categories");

let urlParams = new URLSearchParams(window.location.search)
let category = urlParams.get("category") || "";

const select = document.getElementById("category-select");

Array.from(select.options).forEach(option => {
    if(option.value === category){
        option.selected = true;
    }
})

if(category !== ""){
    document.getElementById("recipie-display").innerHTML = "";
    recipieFetcher.fetchRecipie(category, "category");
}

