import { MyRecipie } from "./Models/myRecipie.js";
import { HtmlLoader } from "./pageContentLoader.js";
import { RecipieFetcher } from "./recipieFetcher.js";

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
    .then(data => {
        return data.map((recipie => {
            return new MyRecipie(recipie)
        }))
    })
    .then((recipie) => {
        let container = document.getElementById("recipie-display");
        displayRecipie(recipie, container);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function displayRecipie(recipie, container){
    let recipieCard = `
    <div class="card mb-3">
        <div class="row g-0">
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${recipie.name}</h5>
                    <p class="card-text">Ingredients:</p>
                    <p>${recipie.ingredients}</p>
                    <p class="card-text">${recipie.instructions}</p>
                </div>
            </div>
        </div>
    </div>
    `;

    container.innerHTML += recipieCard;
}

getData();