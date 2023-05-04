/*
Récupération des données des travaux
*/

//récupération du json contenant les travaux
const allWorks = async () => {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");
        const data = await responseWorks.json();
        return data;
    }catch(err){
        console.error(err);
        return [];
    }   
};

/*
Partie liée à la galerie des travaux
*/

//ciblage des éléments de la page liés à la galerie
const workFrame = document.querySelector(".gallery");
const sortFrame = document.querySelector("#sort-container");

/*
partie boutons de filtrage
*/

//création du conteneur des boutons filtres
const filterContainer = document.createElement("div");
filterContainer.setAttribute("class","filter-container");

//attachement du conteneur des boutons au DOM
const displayButton = () => {
    sortFrame.appendChild(filterContainer);
};

//Création dynamique des boutons
const createButton = async () => {
    try {
        //mise à zéro lors du rafraichessement de cette liste
        //(ajout ou suppression de travaux)
        filterContainer.innerHTML="";
        const allTheWorks = await allWorks(); 
        const eachWorkCategory = [];
        eachWorkCategory.push("Tous");
        for(let i = 0; i < allTheWorks.length; i++){
            eachWorkCategory.push(allTheWorks[i].category.name);
        }
        //utilisation de Set pour trier les catégories
        const setCategory = new Set(eachWorkCategory);
        const allCategories = [ ...setCategory];

        //création et intégration des boutons au DOM
        for(let i = 0; i < allCategories.length; i++){
            const button = document.createElement("button");
            button.setAttribute("class","filter-button");
            button.innerText = allCategories[i];
            filterContainer.appendChild(button);
            const id = "filter-button"+i;
            button.setAttribute("id",id);
            let test = false;
            if(id === "filter-button0"){
                test = true;
            }
            buttonClicked(id, allCategories[i], test);
        }
    }catch(err){
        console.log(err);
    }
};

createButton();

//fonction regroupant la création des boutons
const buttonClicked = (buttonId, categoryName, isItAllTheWork) => {
    const id = "#"+buttonId;
    const button = document.querySelector(id);

    if(isItAllTheWork){
        button.classList.add("button-clicked");
    }
    button.addEventListener("click", (e) => {
        if(isItAllTheWork === true){
            button.classList.add("button-clicked");
            getAllWorks();
        }else{ 
            button.classList.add("button-clicked");
            filteredWorks(categoryName);
        }
        removeOtherButtonsColor(e);
    });
};

//suppression de la couleur sur les boutons non sélectionnés
const removeOtherButtonsColor = (e) => {
    Array.from(document.querySelectorAll(".filter-button")).map(function(otherButton) {
        otherButton.classList.remove("button-clicked");
    });
    e.target.classList.add("button-clicked");
};

/*
Partie récupération des travaux
*/

//récupération de tous les travaux
const getAllWorks = async () => {
    try {
        const allTheWorks = await allWorks(); 
        generateFilter(allTheWorks);
    }catch(err){
        console.log(err);
    }
};

//récupération des travaux filtrés
const filteredWorks = async (categoryName) => {
    try {
        const filteredWorks = await allWorks();
        const result = filteredWorks.filter((element) => element.category.name === categoryName);
        generateFilter(result);
    }catch(err){
        console.log(err);
    }
};

//Boucles des travaux en fonction des filtres
const generateFilter = (works) => {
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
    }
};
 
//appel de la fonction permettant d'afficher tous les travaux
getAllWorks();
displayButton();

/*
partie dédiée à la la section administration et la fenêtre modale
*/

//token permettant de vérifier si l'utilisateur est connecté
const isToken = () => {
    const userToken = sessionStorage.getItem("token");
    if(userToken){
        Array.from(document.querySelectorAll(".admin")).map(function(admin) {
            admin.classList.remove("admin-disconnected");
        });
        return true;
    } else {
        Array.from(document.querySelectorAll(".admin")).map(function(admin) {
            admin.classList.add("admin-disconnected");
        });
        return false;
    }
};

//permet de tranférer le token aux requêtes fetch
const getToken = () => {
    try {
        const stringifiedToken = sessionStorage.getItem("token");
        const parsedToken = JSON.parse(stringifiedToken);
        const token = parsedToken.token;
        return token;
    }catch(err){
        console.log(err);
    }
};

// fonction de déconnection si token périmé
const tokenStatus = (serverStatus) => {
    if(serverStatus !== 204 && serverStatus !== 201){
        alert("Vous avez été déconnecté, veuillez vous reconnecter");
        sessionStorage.removeItem("token");
        location.reload();
    }
};
/*
Partie déconnexion
*/

//fonction de deconnexion
const logOut = (logoutButton) => {
    logoutButton.addEventListener( "click", (event) => {
        event.preventDefault();
        sessionStorage.removeItem("token");
        location.reload();
    });
};

//déconnexion au clic du lien logout
const linkLogOut = () => {
    if(!isToken()){
        return false;
    }else{
        const htmlLinkLogOut = document.querySelector(".login");
        htmlLinkLogOut.innerText="logout";
        logOut(htmlLinkLogOut);
    }
};

linkLogOut();

/*
Interface d'aministration
*/

//création de affichage de l'en-tête d'amninistration
const adminHeader = () => {
    if(!isToken()){
        return false;
    }
    const globalBody = document.querySelector("#head");
    const adminHeaderBar = document.createElement("div");
    adminHeaderBar.setAttribute("class","admin-header admin admin-disconnected");
    const adminHeaderContainer = document.createElement("div");
    adminHeaderContainer.setAttribute("class","admin-link");
    const adminHeaderIcon = document.createElement("i");
    adminHeaderIcon.setAttribute("class","fa-regular fa-pen-to-square");
    const adminHeaderText = document.createElement("p");
    adminHeaderText.innerText = "Mode édition";

    const publishButton = document.createElement("button");
    publishButton.setAttribute("class","publish");
    publishButton.innerText = "publier les changements";
    logOut(publishButton);

    globalBody.appendChild(adminHeaderBar);
    adminHeaderBar.appendChild(adminHeaderContainer);
    adminHeaderContainer.appendChild(adminHeaderIcon);
    adminHeaderContainer.appendChild(adminHeaderText);
    adminHeaderBar.appendChild(publishButton);
};

adminHeader();

//création et affichage des liens d'administrations de section spécifique
const adminLinks = (idChildName, parentName) => {
    if(!isToken()){
        return false;
    }
    const adminLinkContainer = document.createElement("a");
    adminLinkContainer.setAttribute("href","");
    adminLinkContainer.setAttribute("class","admin-link admin-link-modify admin admin-disconnected");
    adminLinkContainer.setAttribute("id", idChildName);
    const adminLinkIcon = document.createElement("i");
    adminLinkIcon.setAttribute("class","fa-regular fa-pen-to-square");
    const adminLinkText = document.createElement("p");
    adminLinkText.innerText = "modifier";

    parentName.appendChild(adminLinkContainer);
    adminLinkContainer.appendChild(adminLinkIcon);
    adminLinkContainer.appendChild(adminLinkText);
};

const editPictureLink = document.querySelector("#edit-picture-link");
const editBiographyLink = document.querySelector("#edit-biography-link");
const editPortfolioLink = document.querySelector("#edit-portfolio-link");

adminLinks("edit-picture", editPictureLink);
adminLinks("edit-biography", editBiographyLink);
adminLinks("edit-project", editPortfolioLink);

/*
fenêtre modale
*/

//création et affichage de la base de fenêtre modale
const createBaseModal = () => {
    const body = document.querySelector("body");

    const createModalWindow = document.createElement("aside");
    createModalWindow.setAttribute("id","modal");
    createModalWindow.setAttribute("class","modal modal-hidden");
    createModalWindow.setAttribute("aria-hidden","true");
    createModalWindow.setAttribute("role","dialog");
    createModalWindow.setAttribute("aria-modal","false");
    createModalWindow.setAttribute("aria-labelledby","title-modal");

    const modalContainer = document.createElement("div");
    modalContainer.setAttribute("class","modal-container");
    
    const modalWindow = document.createElement("div");
    modalWindow.setAttribute("class","modal-window");

    body.appendChild(createModalWindow);
    createModalWindow.appendChild(modalContainer);
    modalContainer.appendChild(modalWindow);
};

createBaseModal();

//affichage de la fenêtre modale au clic sur le lien du portfolio
const displayModal = () => {
    if(!isToken()){
        return false;
    }
    const projectModal = document.querySelector("#edit-project");
    projectModal.addEventListener("click", (event) => {
        event.preventDefault();
        const modalWindow = document.querySelector("#modal");
        modalWindow.classList.remove("modal-hidden");
        // regarder pour le remettre lors de la fermeture de la modale
        modalWindow.removeAttribute("aria-hidden");
        modalWindow.setAttribute("aria-modal","true");
    });
};

/*
récupération travaux fenêtre administation
*/
//récupération dynamique des travaux dans la fenêtre modale
const adminGetAllWorks = async () => {
    try{
        //supression de la liste de travaux
        const works = await allWorks(); 
        const adminWorks = document.querySelector("#photo-edit-container");
        adminWorks.innerHTML="";
        for(let i=0; i < works.length; i++){
            //création d'éléments
            const containerElement = document.createElement("div");
            containerElement.setAttribute("class","photo-edit-card");
            const imageWrapperElement = document.createElement("figure");
            const iconWrapper = document.createElement("div");
            iconWrapper.setAttribute("class","icon-container-wrapper");
            const trashIconWrapper = document.createElement("div");
            trashIconWrapper.setAttribute("class","icon-container trash-icon-container");
            trashIconWrapper.setAttribute("id",works[i].id);
            const trashIcon = document.createElement("i");
            trashIcon.setAttribute("class","fa-solid fa-trash-can");
            const arrowIconWrapper = document.createElement("div");
            arrowIconWrapper.setAttribute("class","icon-container arrow-icon-container");
            const arrowIcon = document.createElement("i");
            arrowIcon.setAttribute("class","fa-solid fa-arrows-up-down-left-right");
            const imageElement = document.createElement("img");
            imageElement.src = works[i].imageUrl;
            imageElement.setAttribute("alt",works[i].title);
            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.innerText = "éditer";

            //insertion de l'élément dans le DOM
            adminWorks.appendChild(containerElement);
            containerElement.appendChild(imageWrapperElement);
            imageWrapperElement.appendChild(iconWrapper);
            iconWrapper.appendChild(trashIconWrapper);
            trashIconWrapper.appendChild(trashIcon);
            iconWrapper.appendChild(arrowIconWrapper);
            arrowIconWrapper.appendChild(arrowIcon);
            imageWrapperElement.appendChild(imageElement);
            imageWrapperElement.appendChild(figcaptionElement);
        }
        deleteWork();
    }catch(err){
        console.log(err);
    }
};

/*
fenêtre modale
*/
// création de la première fenêtre modale
const createModalWindow = () => {
    const modalWindow = document.querySelector(".modal-window");
    modalWindow.setAttribute("class","modal-window");

    const closeIcon = document.createElement("i");
    closeIcon.setAttribute("class", "fa-solid fa-xmark");

    const adminTitle = document.createElement("h2");
    adminTitle.setAttribute("class","admin-title");
    adminTitle.setAttribute("id","title-modal");
    adminTitle.innerText = "Galerie photo";

    const photoEditContainer = document.createElement("div");
    photoEditContainer.setAttribute("id","photo-edit-container");

    const hr = document.createElement("hr");

    const addPhotoButton = document.createElement("button");
    addPhotoButton.setAttribute("class","modal-button");
    addPhotoButton.innerText = "Ajouter une photo";

    const deleteGallery = document.createElement("a");
    deleteGallery.setAttribute("href","");
    deleteGallery.setAttribute("id","delete");
    deleteGallery.innerText = "Supprimer la galerie";

    modalWindow.appendChild(closeIcon);
    modalWindow.appendChild(adminTitle);
    modalWindow.appendChild(photoEditContainer);
    modalWindow.appendChild(hr);
    modalWindow.appendChild(addPhotoButton);
    modalWindow.appendChild(deleteGallery);
    adminGetAllWorks();
    deleteAllWorks();
};

//fenêtre suivante de la modale, permettant d'ajouter un projet à la galerie
const modalWindowAddPhoto = () => {
    const buttonSubmitPhoto = document.querySelector(".modal-button");
    buttonSubmitPhoto.addEventListener("click", () => {
        
        const modalWindow = document.querySelector(".modal-window");
        modalWindow.innerHTML="";
        const iconWrapper = document.createElement("div");
        iconWrapper.setAttribute("class","icon-wrapper");
        const arrowIcon = document.createElement("i");
        arrowIcon.setAttribute("class","fa-solid fa-arrow-left");
        const closeIcon = document.createElement("i");
        closeIcon.setAttribute("class", "fa-solid fa-xmark delete-project");
        
        const adminTitle = document.createElement("h2");
        adminTitle.setAttribute("class","admin-title");
        adminTitle.innerText = "Ajout photo";
        
        const submitPhotoFrame = document.createElement("div");
        submitPhotoFrame.setAttribute("class","submit-photo-frame");
        const submitPhotoPreview = document.createElement("div");
        submitPhotoPreview.setAttribute("class","submit-photo-preview submit-no-photo-preview");
        const submitPhotoPreviewImage = document.createElement("img");
        submitPhotoPreviewImage.setAttribute("class","submit-photo-preview-image");
        submitPhotoPreviewImage.setAttribute("src","");
        submitPhotoPreviewImage.setAttribute("alt","prévisualisation de l'image");
        
        const divPreviewTrashIcon = document.createElement("div");
        divPreviewTrashIcon.setAttribute("class","icon-container preview-container-icon-trash");
        const previewTrashIcon = document.createElement("i");
        previewTrashIcon.setAttribute("class", "fa-solid fa-trash-can");
        previewTrashIcon.setAttribute("id","preview-trash");
        
        const submitPhotoContentIcon = document.createElement("i");
        submitPhotoContentIcon.setAttribute("class","fa-sharp fa-regular fa-image");

        const submitPhotoForm = document.createElement("form");
        submitPhotoForm.setAttribute("class","submit-photo-form");
        submitPhotoForm.setAttribute("id","button-submit-photo-form");

        const submitPhotoContentButton = document.createElement("input");
        submitPhotoContentButton.setAttribute("class","submit-photo-content-button");
        submitPhotoContentButton.setAttribute("id","new-project-image");
        submitPhotoContentButton.setAttribute("type","file");
        submitPhotoContentButton.setAttribute("name","image");
        submitPhotoContentButton.setAttribute("accept","image/png, image/jpeg");
        submitPhotoContentButton.required = true;
        submitPhotoContentButton.innerText="+ Ajouter photo";

        const submitPhotoContentLabel = document.createElement("label");
        submitPhotoContentLabel.setAttribute("for","new-project-image");
        submitPhotoContentLabel.setAttribute("id","image-preview");
        submitPhotoContentLabel.innerText = "+ Ajouter photo";
        const submitPhotoContentText = document.createElement("p");
        submitPhotoContentText.setAttribute("class","submit-photo-content-text");
        submitPhotoContentText.innerText = "jpg, png : 4mo max";

        const submitPhotoFormTitleLabel = document.createElement("label");
        submitPhotoFormTitleLabel.setAttribute("for","title");
        submitPhotoFormTitleLabel.innerText = "Titre";
        const submitPhotoFormTitleInput = document.createElement("input");
        submitPhotoFormTitleInput.setAttribute("type","text");
        submitPhotoFormTitleInput.setAttribute("name","title");
        submitPhotoFormTitleInput.setAttribute("id","title");
        submitPhotoFormTitleInput.setAttribute("class","submit-photo-form-input");
        submitPhotoFormTitleInput.required = true;

        const submitPhotoFormCategoryLabel = document.createElement("label");
        submitPhotoFormCategoryLabel.setAttribute("for","category");
        submitPhotoFormCategoryLabel.innerText = "Catégorie";
        const submitPhotoFormCategoryInput = document.createElement("select");
        submitPhotoFormCategoryInput.setAttribute("name","category");
        submitPhotoFormCategoryInput.setAttribute("id","category");
        submitPhotoFormCategoryInput.setAttribute("class","submit-photo-form-input");
        submitPhotoFormCategoryInput.required = true;

        const submitPhotoFormCategoryOption0 = document.createElement("option");
        submitPhotoFormCategoryOption0.setAttribute("value","");

        const submitPhotoFormCategoryOption1 = document.createElement("option");
        submitPhotoFormCategoryOption1.setAttribute("value","1");
        submitPhotoFormCategoryOption1.innerText = "Objets";

        const submitPhotoFormCategoryOption2 = document.createElement("option");
        submitPhotoFormCategoryOption2.setAttribute("value","2");
        submitPhotoFormCategoryOption2.innerText = "Appartements";

        const submitPhotoFormCategoryOption3 = document.createElement("option");
        submitPhotoFormCategoryOption3.setAttribute("value","3");
        submitPhotoFormCategoryOption3.innerText = "Hôtels & restaurants";

        const submitPhotoFormHr = document.createElement("hr");

        const submitPhotoFormSubmit = document.createElement("input");
        submitPhotoFormSubmit.setAttribute("id","submit-photo-form-submit");
        submitPhotoFormSubmit.setAttribute("type","submit");
        submitPhotoFormSubmit.setAttribute("value","valider");

        const errorMessage = document.createElement("p");
        errorMessage.innerText = "Veuillez remplir tous les champs d'envoi";
        errorMessage.setAttribute("class","missing-information no-missing-information");

        const divNewProject = document.createElement("div");
        divNewProject.setAttribute("class","new-project");
        const textDivNewProject = document.createElement("p");
        textDivNewProject.innerText = "Projet ajouté avec succès";

        modalWindow.appendChild(iconWrapper);
        iconWrapper.appendChild(arrowIcon);
        previousWindowModal();
        iconWrapper.appendChild(closeIcon);
        closeModalCross();
        modalWindow.appendChild(adminTitle);

        modalWindow.appendChild(submitPhotoForm);
        submitPhotoForm.appendChild(submitPhotoFrame);

        submitPhotoFrame.appendChild(submitPhotoPreview);
        submitPhotoPreview.appendChild(submitPhotoPreviewImage);
        submitPhotoPreview.appendChild(divPreviewTrashIcon);
        divPreviewTrashIcon.appendChild(previewTrashIcon);
        submitPhotoFrame.appendChild(submitPhotoContentIcon);
        submitPhotoFrame.appendChild(submitPhotoContentButton);
        submitPhotoFrame.appendChild(submitPhotoContentLabel);
        submitPhotoFrame.appendChild(submitPhotoContentText);

        submitPhotoForm.appendChild(submitPhotoFormTitleLabel);
        submitPhotoForm.appendChild(submitPhotoFormTitleInput);
        submitPhotoForm.appendChild(submitPhotoFormCategoryLabel);
        submitPhotoForm.appendChild(submitPhotoFormCategoryInput);
        
        submitPhotoFormCategoryInput.appendChild(submitPhotoFormCategoryOption0);
        submitPhotoFormCategoryInput.appendChild(submitPhotoFormCategoryOption1);
        submitPhotoFormCategoryInput.appendChild(submitPhotoFormCategoryOption2);
        submitPhotoFormCategoryInput.appendChild(submitPhotoFormCategoryOption3);
        
        submitPhotoForm.appendChild(submitPhotoFormHr);
        submitPhotoForm.appendChild(submitPhotoFormSubmit);
        submitPhotoForm.appendChild(divNewProject);
        divNewProject.appendChild(textDivNewProject);
        submitPhotoForm.appendChild(errorMessage);

        addProject();
        testSizePreviewImage();
    });
};

//partie ajout de l'image de prévilusalisation
const testSizePreviewImage = () => {
    let imageUrl = document.querySelector("#new-project-image");
    imageUrl.addEventListener("change", () => {
        if(imageUrl.files[0].size > 4000000){
            alert("le fichier est trop lourd, il ne sera pas chargé");
            const clearPreviewInput = document.getElementById("new-project-image");
            if(clearPreviewInput.value !==""){
                clearPreviewInput.value = "";
            }
        }else{
            previewImage();
        }
    });
};

//traitement des données liées à l'image de prévisualisation du formulaire
const previewImage = () => {
    let imageUrl = document.querySelector("#new-project-image");
    const fileExtentionRegex = /\.(jpe?g|png)$/i;
    if(imageUrl.files.length === 0 || !fileExtentionRegex.test(imageUrl.files[0].name)){
        const clearPreviewInput = document.getElementById("new-project-image");
        if(clearPreviewInput.value !==""){
            clearPreviewInput.value = "";
        }
        return;
    }
    const div = document.querySelector(".submit-photo-preview");
    div.classList.remove("submit-no-photo-preview");

    const file = imageUrl.files[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", (event) => {
        displayPreview(event);
        const submitButton = document.querySelector("#submit-photo-form-submit");
        submitButton.classList.add("submit-ready");
    });
};

//insertion dans le DOM de l'image de prévisualisation du formulaire
const displayPreview = (event) => {
    const imageDiv = document.querySelector(".submit-photo-preview-image");
    imageDiv.src = event.target.result;
    const addPhotoButton = document.querySelector("#image-preview");
    addPhotoButton.classList.add("submit-no-photo-preview");
    const trashIcon = document.querySelector("#preview-trash");
    trashIcon.addEventListener("click", () => {
        removeDisplayPreview();
    });
};

//suppression de l'image de prévisualisation du formulaire
const removeDisplayPreview = () => {
    const addPhotoButton = document.querySelector("#image-preview");
    const div = document.querySelector(".submit-photo-preview");
    div.classList.add("submit-no-photo-preview");
    addPhotoButton.classList.remove("submit-no-photo-preview");
    const submitButton = document.querySelector("#submit-photo-form-submit");
    submitButton.classList.remove("submit-ready");
    //suppression de l'url de la photo
    const clearPreviewInput = document.getElementById("new-project-image");
    if(clearPreviewInput.value !==""){
        clearPreviewInput.value = "";
    }
    const previewImage = document.querySelector(".submit-photo-preview-image");
    previewImage.src = "";
};

//code servant à revenir à la précédente fenêtre modale
const previousWindowModal = () => {
    const arrowIcon = document.querySelector(".fa-arrow-left");
    arrowIcon.addEventListener("click", () => {
        const modalWindowPhoto = document.querySelector(".modal-window");
        modalWindowPhoto.innerHTML="";
        createModalWindow();
        const modalWindow = document.querySelector("#modal");
        modalWindow.classList.remove("modal-hidden");
        closeModalCross();
        modalWindowAddPhoto();
    });
};

/*
Fonctions de fermeture de la fenêtre modale
 */
//fonction générale de fermeture de la modale
const closeModal = () => {
    const modalWindow = document.querySelector(".modal");
    modalWindow.classList.add("modal-hidden");
    modalWindow.setAttribute("aria-hidden","true");
    modalWindow.setAttribute("aria-modal","false");
};

//fermeture de la fenêtre modale au clic sur la croix
const closeModalCross = () => {
    const closeIcon = document.querySelector(".fa-xmark");
    closeIcon.addEventListener("click", () => {
        closeModal();
    });
};

//fermeture au clic en dehors de la fenêtre modale
const closeModalClickOut = () => {
    const modalWrapper = document.querySelector(".modal-container");
    const modalWindow = document.querySelector(".modal-window");
    modalWindow.addEventListener("click", (event) => {
        event.stopPropagation();
    });
    modalWrapper.addEventListener("click", () => {
        closeModal();
    });
};

//fermeture de la fenêtre modale à l'appui de la touche Escape
const closeModalKey = () => {
    document.addEventListener("keydown", (event) => {
        if(event.key === "Escape" || event.key === "Esc" || event.keCode === 32) {
            closeModal();
        }
    });
};

/*
Suppression des projets
*/
//évènement au clic sur la corbeille de chaque projet
const deleteWork = () => {
    const deleteWorkIcon = document.querySelectorAll(".trash-icon-container");
    Array.from(deleteWorkIcon).forEach( icon => {
        icon.addEventListener("click", async (event) => {
            //la page se recharge après la suppression d'un projet
            event.preventDefault();
            if(confirm("Voulez-vous supprimer ce projet?")){
                const token = getToken();
                await actionDeleteWork(icon.id, token);
                adminGetAllWorks();
                createButton();
                getAllWorks();
                return false; 
            }
        }, false );
    });
};

// requête fetch de la suppression du projet
const actionDeleteWork = async (projectNumber, token) => {
    try {
        const responseDelete = await fetch("http://localhost:5678/api/works/"+ projectNumber, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "accept": "*/*",
                "authorization": "Bearer " + token 
            },
        });
        tokenStatus(responseDelete.status);
    } catch (err) {
        console.error(err);
    }
};

//evènement au clic du lien pour supprimer tous les travaux
const deleteAllWorks = () => {
    const deleteAllProjectLink = document.querySelector("#delete");
    deleteAllProjectLink.addEventListener("click", async (event) => {
        event.preventDefault();
        if(confirm("attention, cette action supprimera tous les projets publiés de façon irréversible, êtes-vous sûr?")){
            await actionDeleteAllWorks(getToken());
            adminGetAllWorks();
            createButton();
            getAllWorks();
        }
    });
};

//suppression de tous les projets
const actionDeleteAllWorks = async (token) => {
    try {
        const works = await allWorks(); 
        let projectId = [];
        for (let i = 0; i < works.length; i++){
            projectId.push(works[i].id);
        }
        for (let i = 0; i < projectId.length; i++){
            const responseDeleteAll = await fetch("http://localhost:5678/api/works/" + projectId[i], {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "accept": "*/*",
                    "authorization": "Bearer " + token 
                },
            });
            tokenStatus(responseDeleteAll.status);
            deleteAllWorks();    
        }
    } catch (err) {
        console.error(err);
    }
};

/*
Ajout d'un nouveau projet
*/
//partie de code servant à ajouter un nouveau projet au moyen de formData
const sendNewprojectFiles = async (imageUrl, title, category) => {
    try {
        const projectTitle = title;
        const projectImageUrl = imageUrl;
        const projectCategoryId = category;

        let sendNewProject = new FormData();
        sendNewProject.append("image", projectImageUrl);
        sendNewProject.append("title", projectTitle);
        sendNewProject.append("category", projectCategoryId);

        let object = {};
        sendNewProject.forEach((value, key) => (object[key] = value));
        await actionSendProjectFile(getToken(), sendNewProject);
        newProjectConfirmation();
    }catch(err){
        console.error(err);
    }
};

//notification d'ajout de projet
const newProjectConfirmation = () => {
    const divNewProject = document.querySelector(".new-project");
    divNewProject.classList.add("class","sent");
    setTimeout( ()=> {
        divNewProject.classList.remove("sent");
    }, 1000);
};

//bouton valider: ajouter projet
const addProject = () => {
    try {
        const addPhotoButton = document.querySelector("#submit-photo-form-submit");
        addPhotoButton.addEventListener("click", async (event) => {
            event.preventDefault();
            let imageUrl = document.querySelector("#new-project-image");
            let title = document.querySelector("#title");
            let categoryId = document.querySelector("#category");

            const message = document.querySelector(".missing-information");
            if(!imageUrl.value || !title.value || !categoryId.value){
                message.classList.remove("no-missing-information");
                return;
            }

            const imageFile = imageUrl.files[0];

            let projectImageUrl = imageFile;
            let projectTitle = title.value;
            let projectCategoryId = categoryId.value;

            message.classList.add("no-missing-information");
            await sendNewprojectFiles(projectImageUrl,projectTitle,projectCategoryId);
            document.getElementById("button-submit-photo-form").reset();
            removeDisplayPreview();
            createButton();
            getAllWorks();
        });
    }catch(err){
        console.log(err);
    }
};

//envoi des projets au back-end
const actionSendProjectFile = async (token, project) => {
    try {
        const responseSendProject = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                // "Content-Type": "multipart/formData",
                // "accept": "application/json",
                "authorization": "Bearer " + token 
            },
            body: project
        });
        tokenStatus(responseSendProject.status);
    } catch (err) {
        console.error(err);
    }
};

//appel de la fonction pour afficher la fenêtre modale
createModalWindow();
displayModal();
modalWindowAddPhoto();

//fonctions de fermeture de la modale
closeModalCross();
closeModalClickOut();
closeModalKey();