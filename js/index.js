import { HtmlLoader } from "./pageContentLoader.js";

import { RecipieFetcher } from "./recipieFetcher.js";

// Creating a new instance of the HtmlLoader class.
let htmlLoader = new HtmlLoader();
htmlLoader.loadHtml("./components/nav-bar.html", "header");
htmlLoader.loadHtml("./components/card-placeholder.html", "recipie-display");

let recipieFetcher = new RecipieFetcher();

let form = document.getElementById("recipie-search");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const search = formData.get("recipie");

  if (search == "") {
    let searchBar = document.getElementById("search-bar");
    searchBar.classList.add("is-invalid");
    return;
  } else {
    let searchBar = document.getElementById("search-bar");
    searchBar.classList.remove("is-invalid");
  }

  form.submit();
});

const urlParams = new URLSearchParams(window.location.search);
const recipieName = urlParams.get("recipie") || "";

if (recipieName !== "") {
  document.getElementById("recipie-display").innerHTML = "";
  recipieFetcher.fetchRecipie(recipieName);
}

document.getElementById("search-bar").value = recipieName;
