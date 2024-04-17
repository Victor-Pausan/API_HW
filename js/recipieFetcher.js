import { Recipie } from "./Models/recipie.js";

export class RecipieFetcher {
  fetchRecipie(name, type = null) {
    if (type == "category") {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`)
        .then((result) => result.json())
        .then((data) => {
          return data["meals"];
        })
        .then((meals) => {
          for (let i = 0; i < meals.length; i++) {
            this.fetchRecipie(meals[i]["strMeal"]);
          }
        });
    } else if (name == "random") {
      fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then((response) => response.json())
        .then((data) => {
          if (data["meals"] === null) {
            throw new Error("No recipie found");
          }
          return new Recipie(data["meals"][0]);
        })
        .then((recipie) => {
          let container = document.getElementById("recipie-display");
          this.displayRecipie(recipie, container);
        })
        .catch((error) => {
          this.displayError(error.message);
        });
    } else if (name == "categories") {
      fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then((response) => response.json())
        .then((data) => {
          let categories = data["categories"];
          let container = document.getElementById("category-select");
          let categoriesList = categories
            .map((category) => {
              return `<option value="${category.strCategory}">${category.strCategory}</option>`;
            })
            .join("");
          container.innerHTML += categoriesList;
        })
        .then(() => {
          let urlParams = new URLSearchParams(window.location.search);
          let category = urlParams.get("category") || "";

          const select = document.getElementById("category-select");

          Array.from(select.options).forEach((option) => {
            if (option.value === category) {
              option.selected = true;
            }
          });
        });
    } else {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then((response) => response.json())
        .then((data) => {
          if (data["meals"] === null) {
            throw new Error("No recipie found");
          }
          return new Recipie(data["meals"][0]);
        })
        .then((recipie) => {
          let container = document.getElementById("recipie-display");
          this.displayRecipie(recipie, container);
        })
        .catch((error) => {
          this.displayError(error.message);
        });
    }
  }

  displayRecipie(recipie, container) {
    let ingredientsList = recipie.ingredients
      .map((ingredient) => {
        return `<li>${ingredient.name} - ${ingredient.measure}</li>`;
      })
      .join("");

    let recipieCard = `
    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${recipie.picture}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${recipie.name}</h5>
                    <p class="card-text">Ingredients:</p>
                    <ul>${ingredientsList}</ul>
                    <p class="card-text">${recipie.instructions}</p>
                </div>
            </div>
        </div>
    </div>
    `;

    container.innerHTML += recipieCard;
  }

  displayError(message) {
    let container = document.getElementById("recipie-display");
    container.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
  }
}
