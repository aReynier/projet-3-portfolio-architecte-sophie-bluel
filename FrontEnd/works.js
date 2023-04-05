//récupération du json contenant les travaux
const allWorks = async () => {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");
        console.log("server status: " + responseWorks.status);
        const data = await responseWorks.json();
        console.log(data);
        return data;
    }catch(err){
        console.error(err);
        return [];
    };   
};

//ciblage de l'élément de la page
const workFrame = document.querySelector(".gallery");
const sortFrame = document.querySelector("#sort-container");

const filteredWorks = async (categoryName) => {
    try {
        workFrame.innerHTML="";
        const filteredWorks = await allWorks();
        const result = filteredWorks.filter((element) => element.category.name == categoryName);
        console.log(result);
        getFilteredWorks(result);
    }catch(err){
        console.log(err);
    };
};

//création du conteneur des boutons filtres
const filterContainer = document.createElement("div");
filterContainer.setAttribute("class","filterContainer");

//attachement des boutons au DOM
const displayButton = () => {
    sortFrame.appendChild(filterContainer);
};

//suppresion de la couleur sur les boutons non sélectionnés
const removeOtherButtonsColor = (e) => {
    Array.from(document.querySelectorAll('.filterButton')).map(function(otherButton) {
                console.log(otherButton);
                otherButton.classList.remove("buttonClicked");
      });
      e.target.classList.add("buttonClicked");
  }            

//fonction regroupant la création des boutons
const createButton = (buttonTitle, categoryName, isItAllTheWork) => {
        const button = document.createElement("button");
        button.innerText = buttonTitle;
        button.setAttribute("class","filterButton");
        if(isItAllTheWork){
            button.classList.add("buttonClicked");
        };

        button.addEventListener("click", (e) => {
        if(isItAllTheWork == true){
            button.classList.add("buttonClicked");
            getAllWorks();
        }else{ 
            button.classList.add("buttonClicked");
            filteredWorks(categoryName);
        }
        removeOtherButtonsColor(e);
    });
    filterContainer.appendChild(button);
};

const buttonAll = createButton("tous", "Objets", true);
const buttonObject = createButton("Objets", "Objets", false);
const buttonAppartment = createButton("Appartements", "Appartements", false);
const buttonHotel = createButton("Hotels & restaurants", "Hotels & restaurants", false);

//test de création dynamique des boutons
// const test = async () => {
//     try {
//         const allTheWorks = await allWorks(); 
//         const arrayTest = [];
//             for(let i=0; i < allTheWorks.length; i++){
//                 arrayTest.push(allTheWorks[i].category.name);
//             };
//         console.log(arrayTest);
//         const logSetElement = () => {
//             const button = createButton("\"" + allTheWorks.category.name + "\", \"" + allTheWorks[i].category.name + "\", " + false);
//         }
//         const setTest = new Set(arrayTest).forEach(logSetElement);
//     }catch(err){
//         console.log(err);
//     }
// };
// test();

//Récupération des travaux
const getAllWorks = async () => {
    try {
        const allTheWorks = await allWorks(); 
        getFilteredWorks(allTheWorks);
    }catch(err){
        console.log(err);
    }
};

//Boucles des travaux en fonction des filtres
const getFilteredWorks = (works) => {
    try{
        //supression de la liste de travaux
        workFrame.innerHTML="";
        for(let i=0; i < works.length; i++){
            //création d'éléments
            const figureElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            imageElement.src = works[i].imageUrl;
            imageElement.setAttribute("alt",works[i].title);
            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.innerText = works[i].title;

            //insertion de l'élément dans le DOM
            workFrame.appendChild(figureElement);
            figureElement.appendChild(imageElement);
            figureElement.appendChild(figcaptionElement);
        }
    }catch(err){
        console.log(err);
    };
};

getAllWorks();
displayButton();


const userToken = JSON.parse(localStorage.getItem("token"));
if (userToken.userId !== undefined) {
    alert("l'utilisateur est connecté");
}