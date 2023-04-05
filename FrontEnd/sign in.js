
// Début du code du login
let userEmail = document.getElementById("email");
let userPassword = document.getElementById("password");

//création du message d'erreur
const emailError = document.createElement("p");
emailError.innerText = "Erreur dans l’identifiant ou le mot de passe";
const parentToAppend = document.getElementById("loginMessage");

//évènement une fois que l'utilisateur clique sur "se connecter"
const getDataTest = document.getElementById("signIn").addEventListener("submit", (event) => {
    try {
        event.preventDefault();
        const valueUserEmail = userEmail.value;
        const valueUserPassword = userPassword.value;

        //test local storage 1
        console.log("email enregistré");
        localStorage.setItem("user email", userEmail.value);
        const storageEmail = localStorage.getItem("user email");
        console.log(storageEmail);

        //test local storage 2
        const user = {
            email: userEmail.value,
            password: userPassword.value
        };
        localStorage.setItem("identifiants", JSON.stringify(user));
        console.log(user);

        testLogin(valueUserEmail, valueUserPassword);
        
        const userToken = JSON.parse(localStorage.getItem("token"));
        console.log(userToken);
        console.log(userToken.userId);

        //à revoir, comportement imparfait, message d'erreur'qui persiste
        //si première identification ratée
        if (userToken.userId === undefined) {
            //permet d'éviter le comportement par défaut de rechargement de page
            //event.preventDefault();
            //affichage du message d'erreur
            parentToAppend.innerHTML = "";
            parentToAppend.appendChild(emailError);
        } else {
            parentToAppend.innerHTML = "";
            alert("connexion réussie");
            window.location.href = "index.html"
        };

    } catch (error) {
        console.log(error);
    }

});

const testLogin = async (valueUserEmail, valueUserPassword) => {
    try {
        const responseLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                email: valueUserEmail,
                password: valueUserPassword
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=utf-8",
                //permet de contourner l'erreur CORS
                "Access-Control-Allow-Origin": "*"
            },
        });
        console.log("server status: " + responseLogin.status + responseLogin);
        const token = await responseLogin.json();
        console.log(token);
        const strigifiedToken = JSON.stringify(token);
        localStorage.setItem("token", strigifiedToken);
    } catch (err) {
        console.error(err);
    };
};
