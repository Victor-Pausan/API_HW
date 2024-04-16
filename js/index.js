import { HtmlLoader } from "./pageContentLoader.js";

import { RecipieFetcher } from "./recipieFetcher.js";


// Creating a new instance of the HtmlLoader class.
let htmlLoader = new HtmlLoader();
htmlLoader.loadHtml("./components/nav-bar.html", "header");

let recipieFetcher = new RecipieFetcher();

let form = document.getElementById("recipie-search");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const search = formData.get("recipie");

    if(search == '') {
        alert("Please enter a recipie name");
        return;
    }

    form.submit();
});

const urlParams = new URLSearchParams(window.location.search);
const recipieName = urlParams.get("recipie") || '';

if(recipieName !== '') {
    recipieFetcher.fetchRecipie(recipieName);
}