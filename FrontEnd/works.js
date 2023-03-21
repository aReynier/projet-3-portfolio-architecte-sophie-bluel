console.log("Le fichier Javascript est bien lié à la page HTML");

//récupération du json contenant les travaux
//exectuter en fonction async avec await pour éviter les promises imbriquées
// a noter que le retour devra aussi se faire en await
//penser au try and catch

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
    }
    
}

//ciblage de l'élément de la page et suppression de l'affichage fixe des projets
const workFrame = document.querySelector(".gallery");
workFrame.innerHTML="";

//boucle de tous les travaux
const getAllWorks = async () => {
    try {
        const works = await allWorks(); 
        console.log("travaux appelés dynamiquement");
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
    }
};

getAllWorks();

categoryPlace = document.querySelector("#portfolio");

//création des boutons de catégorie
const buttonAll = document.createElement("button");
buttonAll.innerText = "Tous";

    buttonAll.addEventListener("click", function () {
        console.log("all the works");
        getAllWorks();
    });

    
const buttonObject = document.createElement("button");
buttonObject.innerText = "Objets";
    
    buttonObject.addEventListener("click", function () {
        workFrame.innerHTML="";
    });

const buttonAppartment = document.createElement("button");
buttonAppartment.innerText = "Appartements";

    buttonAppartment.addEventListener("click", function () {
        console.log("appartments");
        workFrame.innerHTML="";
    });
    
const buttonHotel = document.createElement("button");
buttonHotel.innerText = "Hôtels & restaurants";

    buttonHotel.addEventListener("click", function () {
        console.log("Hôtels & restaurants");
        workFrame.innerHTML="";
    });
    
categoryPlace.appendChild(buttonAll);
categoryPlace.appendChild(buttonObject);
categoryPlace.appendChild(buttonAppartment);
categoryPlace.appendChild(buttonHotel);