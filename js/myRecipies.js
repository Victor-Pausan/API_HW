import { MyRecipie } from "./Models/myRecipie.js";
import { HtmlLoader } from "./pageContentLoader.js";

let htmlLoader = new HtmlLoader();
htmlLoader.loadHtml("./components/nav-bar.html", "header");
htmlLoader.loadHtml("./components/form.html", "form-display");

let form = document.getElementById("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let data = new FormData(form);
    let recipie = data.get("recipie-name");
    let ingredients = data.get("ingredients");
    let instructions = data.get("instructions");

    const formData={
        id: "0",
        recipie: recipie,
        ingredients: ingredients,
        instructions: instructions
    }

    let formErrors = {
        "recipie-name": false,
        "ingredients": false,
        "instructions": false
    }

    const appendErrorMessage = (message, className) => {
        let errorDiv = document.getElementById(`${className}-error`);
        errorDiv.innerHTML = message
        let inputError = document.getElementById(className);
        inputError.className += " is-invalid";
        formErrors[className] = true;
    };

    const deleteErrorMessage = (className) => {
        let errorDiv = document.getElementById(`${className}-error`);
        errorDiv.innerHTML = ""; 
        let inputError = document.getElementById(className);
        inputError.className = "form-control";
        formErrors[className] = false;
    }

    if (recipie.trim() === '') {
        let recipieError = "Please fill in recipie name.";
        appendErrorMessage(recipieError, "recipie-name");
    }
    else{
        deleteErrorMessage("recipie-name");
    }
    
    if (ingredients.trim() === '') {
        let ingredientsError = "Please fill in ingredients.";
        appendErrorMessage(ingredientsError, "ingredients");
    }
    else{
        deleteErrorMessage("ingredients");
    }
    
    if (instructions.trim() === '') {
        let instructionsError = "Please fill in instructions.";
        appendErrorMessage(instructionsError, "instructions");
    }
    else{
        deleteErrorMessage("instructions");
    }

    for(let i in formErrors){
        if(formErrors[i] === true){
            return;
        }
    }

    postData(formData);

    form.submit();
})

function postData(formData){
    fetch(`https://api.bwt.ro/api/dev/FE/post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-STUDENT-HEADER": "PAUSAN_VICTOR"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function getData(){
    fetch(`https://api.bwt.ro/api/dev/FE/get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-STUDENT-HEADER": "PAUSAN_VICTOR"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        data = data["data"]["items"];
        return Object.keys(data).map((recipie => {
            return new MyRecipie(data[recipie]);
        }))
    })
    .then((recipies) => {
        Object.keys(recipies).forEach(recipie => {
            displayRecipie(recipies[recipie]);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function displayRecipie(recipie){
    let recipieCard = `
    <div class="card my-3" style="width: 100%">
        <h5 class="card-header">${recipie.data.recipie}</h5>
        <div class="card-body">
          <h5 class="card-title">
            ${recipie.data.ingredients}
          </h5>
          <p class="card-text">
            ${recipie.data.instructions}
          </p>
          <button id="${recipie.id}" class="delete-btn remove">
            <span id="${recipie.id}" class="text remove">Delete</span>
            <span id="${recipie.id}" class="icon remove">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="remove"
                id="${recipie.id}"
              >
                <path
                id="${recipie.id}"
                class="remove"
                  d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
                ></path>
              </svg>
            </span>
          </button>
        </div>
    `;

    let container = document.getElementById("recipie-display");
    container.innerHTML += recipieCard;
}

function deleteRecipie(id){
    let idObj = {
        "id": id
    }
    fetch(`https://api.bwt.ro/api/dev/FE/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-STUDENT-HEADER": "PAUSAN_VICTOR"
        },
        body: JSON.stringify(idObj)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const recipieSection = document.querySelector("#recipie-display");
        recipieSection.innerHTML = "";
        getData();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

getData();

const recipieSection = document.querySelector("#recipie-display");
recipieSection.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove")){
        let id = event.target.id;
        console.log(id);
        deleteRecipie(id);
    } 
});