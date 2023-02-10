
//--------------------------LES CLASSES CONSTRUCTORS---------------------------------------------
class Prices {

    constructor(id, quantite) {
        this.id = id;
        this.quantite = quantite;
    }

}
class Produits {

    constructor(id, couleur, quantite, nom, image, imageAlt, description, prix) {
        this.id = id;
        this.couleur = couleur;
        this.quantite = quantite;
        this.nom = nom;
        this.image = image;
        this.imagesAlt = imageAlt;
        this.description = description;
        this.prix = prix;
    }

}

  
//-------------------------------------------------LES FONCTIONS-------------------------------------
//Création des deux tableaux neccessaire au traitement
var allProduct = [];
let panierReturn=[];
//Mise à 0 des valeurs de comptage
let nbDeValeur=0;
let totalPrix=0;
let totalQuantite=0;

//Récupération des valeurs LocalStorage + BackEnd
function recuperation(action){
fetch("http://127.0.0.1:3000/api/products")
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(value) {          
    //-----------------------------Traitement des valeurs recue du BACKEND ---------------------------------------------------
    //On récupére le panier dans le LocalStorage
    panierReturn = JSON.parse(localStorage.getItem("Panier"));
        //Pour chaque valeur présente dans le panier Ls
        for(x=0;x<panierReturn.length;x++){
            //Pour chaque valeur dans le JSON recue par le BACKEND
            for(i=0;i<value.length;i++){
                //On compare le produit dans le LS au produit Backend
                if(panierReturn[x].id === value[i]._id){
                    //On créer un produit contenant toutes ses valeurs BAckend pour le traitement
                    if(action!="delete"){

                    
                    let prodRetour = new Produits(value[i]._id, panierReturn[x].couleur, panierReturn[x].quantite, value[i].name, value[i].imageUrl, value[i].altTxt, value[i].description, value[i].price);
                    //On insert une ligne dans allProduct avec ses éléments.
                    let addToTransfert = allProduct.push(prodRetour);
                }
                } 
            }
        
        }
        //Nombre de produits créé dans allProduct
        nbDeValeur=allProduct.length;
        //console.log(allProduct);
        //Si le nombre de produit et VIDE
        if(nbDeValeur === 0){
            //On informe que le panier est vide
            document.getElementById("cartAndFormContainer").innerHTML="<h1>Votre panier est vide</h1>";
        }else{
            //Sinon on affiche le panier
            afficherLePanier();
        }
    })
.catch(function(err) {
    //PANIER N EXISTE PAS OU UN PROBLEME AVEC LA RECUPERATION DU JSON EST ARRIVE
    if(nbDeValeur===0){
        //On averti de l'erreur
        //alert("Une erreur est survenue au chargement du panier. Merci de revenir.");
        //on affiche que le panier est vide
        document.getElementById("cartAndFormContainer").innerHTML="<h1>Votre panier est vide</h1>";
    }
            
});
}
//Affichage du panier
function afficherLePanier(){
    //On vide le DOM pour partir sur une base propre
    document.querySelector("#cart__items").textContent="";
    //On passe les quantités et prix à 0
    totalPrix = 0;
    totalQuantite=0;
//Pour chaque produit récupéré dans allProduct
for(i=0;i<nbDeValeur;i++){
    //console.log(allProduct);
    //console.log(nbDeValeur);
    //On crée nos variables ID COULEUR et INDEX
    let idDuProduit = allProduct[i].id;
    let couleurDuProduit = allProduct[i].couleur;
    let indexDuProduit = i;

                    //Affichage des produits en boucle CREATION DU DOM
                    //Article
                    let article = document.createElement("article");
                    document.querySelector("#cart__items").appendChild(article);
                    article.className = "cart__item";
                    article.setAttribute("data-id", allProduct[i].id);
                    //div
                    let divImg = document.createElement("div");
                    article.appendChild(divImg);
                    //class = cart__item__img
                    divImg.className = "cart__item__img";
                        //img
                        let img = document.createElement("img");
                        divImg.appendChild(img);
                            //src
                            img.setAttribute('src', allProduct[i].image);
                            //alt
                            img.setAttribute('alt', allProduct[i].imagesAlt);
                    
                    //div
                    let divContent = document.createElement("div");
                    article.appendChild(divContent);
                        //class = cart__item__content
                        divContent.className = "cart__item__content";
            
                    //div
                    let divDetails = document.createElement("div");
                    divContent.appendChild(divDetails);
                        //class = cart__item__content__description
                        divDetails.className = "cart__item__content__description";
                        //H2
                        let elH2 = document.createElement("h2");
                        divDetails.appendChild(elH2);
                            //Name du produit
                            elH2.textContent= allProduct[i].nom;
                        //p
                        let elPcouleur = document.createElement("p");
                        divDetails.appendChild(elPcouleur);
                            //Couleur du produit
                            elPcouleur.textContent = allProduct[i].couleur;
                        //p
                        let elPrixTotal = document.createElement("p");
                        divDetails.appendChild(elPrixTotal);
                            //prix total
                            elPrixTotal.textContent = allProduct[i].prix;
                    
                    //div
                    let divContentQtePrixDel = document.createElement("div");
                    divContent.appendChild(divContentQtePrixDel);
                        //class  cart__item__content__settings
                        divContentQtePrixDel.className = "cart__item__content__settings";
            
                    //div
                    let divQtePrix = document.createElement("div");
                    divContentQtePrixDel.appendChild(divQtePrix);
                        //class cart__item__content__settings__quantity
                        divQtePrix.className = "cart__item__content__settings__quantity";
                        //p Qté :
                        let elPquantite = document.createElement("p");
                        divQtePrix.appendChild(elPquantite); 
                        let elDivError = document.createElement("div");
                        divContentQtePrixDel.appendChild(elDivError);
                        //input
                            let elInputQuantite = document.createElement("input");
                            elPquantite.appendChild(elInputQuantite);
                            //type number
                            elInputQuantite.setAttribute("type", "number");
                            //class itemQuantity
                            elInputQuantite.setAttribute("class", "itemQuantity");
                            //name itemQuantity
                            elInputQuantite.setAttribute("name", "itemQuantity");
                            //min 1
                            elInputQuantite.setAttribute("min", 1);
                            //max 100
                            elInputQuantite.setAttribute("max",100);
                            //value = PRICE
                            elInputQuantite.setAttribute("value",allProduct[i].quantite);
                            elInputQuantite.addEventListener("change", (e) => {
                                e.preventDefault;
                                if(modificationQuantite(idDuProduit, couleurDuProduit, indexDuProduit, elInputQuantite.value)){
                                    console.log("Modifié dans le Localstorage");
                                } else {
                                    if(elInputQuantite.value<=0){
                                        modificationQuantite(idDuProduit, couleurDuProduit, indexDuProduit, 1);
                                        elInputQuantite.style.border="3px solid red";
                                        elDivError.style.color="red";
                                        elDivError.style.borderRadius="50px";
                                        elDivError.style.backgroundColor="white";
                                        elDivError.style.textAlign="center"; 
                                        elDivError.innerHTML="<p>Quantité "+elInputQuantite.value+" impossible<br>il doit etre compris entre 1 et 100.<br>Insertion minimum : 1</p>";
                                        setTimeout(afficherLePanier,4000);
                                    } else if (elInputQuantite.value>100){
                                        modificationQuantite(idDuProduit, couleurDuProduit, indexDuProduit, 100);
                                        elInputQuantite.style.border="3px solid red";
                                        elDivError.style.color="red";
                                        elDivError.style.borderRadius="50px";
                                        elDivError.style.backgroundColor="white";
                                        elDivError.style.textAlign="center"; 
                                        elDivError.innerHTML="<p>Quantité "+elInputQuantite.value+" impossible<br>il doit etre compris entre 1 et 100.<br>Insertion maximum : 100</p>";
                                        setTimeout(afficherLePanier,4000);
                                    }
                                }
                               });
                    
                    
                            //div
                    let divDel = document.createElement("div");
                    divContentQtePrixDel.appendChild(divDel);
                        //class  cart__item__content__settings__delete
                        divDel.className = "cart__item__content__settings__delete";
                        //p
                        let elPdelete = document.createElement("p");
                        divDel.appendChild(elPdelete);
                            //class deleteItem
                            elPdelete.setAttribute("class", "deleteItem");
                            //Supprimer
                            elPdelete.textContent="Supprimer";
                            elPdelete.addEventListener("click", (e) => {
                                e.preventDefault;
                                article.innerHTML="";
                                article.style.color="white";
                                article.style.borderRadius="50px";
                                article.style.backgroundColor="green";
                                article.style.textAlign="center";
                                article.style.height="25px";
                                article.style.padding="20px";
                                article.innerHTML="Suppression en cours";
                                setTimeout(deleteItem, 2000, idDuProduit, couleurDuProduit, indexDuProduit);
                               });
//A chaque affichage de produit on inser le prix et la quantité du produit total à tous les autres produits
totalPrix = (totalPrix + (allProduct[i].prix * allProduct[i].quantite));
totalQuantite = totalQuantite + Number(allProduct[i].quantite);
}
//On affiche le prix et la quantite total
document.getElementById("totalQuantity").textContent = totalQuantite;
document.getElementById("totalPrice").textContent = totalPrix;

}
//Modification de la quantité
function modificationQuantite(id, couleur, index, quantiteDuProduit){
    
    if(quantiteDuProduit<=0 || quantiteDuProduit>100){
        console.log("La quantité demandée : "+quantiteDuProduit+" est invalide elle doit etre entre 1 et 100");
        return false;
    } else {
    //Dans mon retour panier on vérifie que l'index envoyé corresponde bien à cet article ( id / Couleur)
    if(panierReturn.indexOf(id) === panierReturn.indexOf(couleur)){
        //Si c'est bon on modifie la quantité dans la table panierReturn
        panierReturn[index].quantite = quantiteDuProduit;
    }

    //Injection des donnée dans le LocalStorage
    localStorage.setItem("Panier",JSON.stringify(panierReturn));
    //Quantité modifié => prix et quantité total modifié :
    //On modifie notre table de traitement allProduct
    allProduct[index].quantite = quantiteDuProduit;
    mAjPrix();
    return true;
    }

}
//Mise à jour des prix
function mAjPrix(){
        //On boucle cette table pour compter le nombre de produit et la quantité total
        let compteurPrix = 0;
        let compteurQte = 0;
        for (i=0;i<allProduct.length;i++){
            compteurPrix = compteurPrix + (allProduct[i].quantite * allProduct[i].prix);
            //console.log(compteurPrix);
            compteurQte = Number(compteurQte) + Number(allProduct[i].quantite);
            //console.log(compteurQte);
        }
        //console.log(compteurPrix + ' => ' + compteurQte);
        //On affiche sur la page les modifications
        let totQte = document.getElementById("totalQuantity");
        totQte.textContent = Number(compteurQte);
        let totPrix = document.getElementById("totalPrice");
        totPrix.textContent = Number(compteurPrix);
        return true;
}
//Suppression d'un produit
function deleteItem(id, couleur, index){

    //On supprime dans notre table panierReturn
    //Vérification que le produit identifié soit bon (ID et Couleur)
    if(panierReturn.indexOf(id) === panierReturn.indexOf(couleur)){
        //On passe nos lignes produit à VIDE
        panierReturn[index]="";
        allProduct[index]="";
    }
    //On filtre pour enlever les lignes VIDE
    panierReturn = panierReturn.filter(panierReturn => panierReturn != '');
    allProduct = allProduct.filter(allProduct => allProduct != '');
    //On envoi le résultat au localStorage
    localStorage.setItem("Panier",JSON.stringify(panierReturn));
    recuperation("delete");
    return true;
}

//---------------------------------------------------VALIDATION DE LA COMMANDE--------------------------------------------
//Vérification
//Variables de controle des champs
let validationAddress=false;
let validationCity=false;
let validationEmail=false;
let validationNom=false;
let validationPrenom=false;
//Table des Id pour le backend
let panierReturnId=[];
//-----------------------------------Les fonctions--------------------------------
//Controle champ unique selon la valeur
function verificationDeRemplissage(nomChamp, valeur){
    //on récupére le nom du champ
    //let valeurEntree = document.getElementById(nomChamp).value;
    //console.log(valeurEntree.value.length);
    //Si le champ est vide
    if(valeur.length === 0){
        document.getElementById(nomChamp + "ErrorMsg").textContent = "Le champ ne doit pas etre vide";    
        document.getElementById(nomChamp).style.border="3px solid red";
        document.getElementById(nomChamp + "ErrorMsg").style.color="red";
        document.getElementById("order").style.display = "none";
        return false;
        //Si le champ contient des nombres ( sauf adresse et email )
    } else if (nomChamp != "address" && nomChamp!="email" && valeur.match(/[0-9]/i)){
            document.getElementById(nomChamp + "ErrorMsg").textContent = "Le champ ne doit pas contenir de nombre [0-9]";    
            document.getElementById(nomChamp).style.border="3px solid orange";
            document.getElementById(nomChamp + "ErrorMsg").style.color="orange";
            document.getElementById("order").style.display = "none";
            return false;
        //si les champs contiennent des caractères spéciaux (sauf email)
    } else if (nomChamp != "email" && valeur.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)){
        document.getElementById(nomChamp + "ErrorMsg").textContent = "Le champ ne doit pas contenir de caractères spéciaux";    
        document.getElementById(nomChamp).style.border="3px solid orange";
        document.getElementById(nomChamp + "ErrorMsg").style.color="orange";
        document.getElementById("order").style.display = "none";
        return false;
        //Validation du champ email uniquement
    }
    else if(nomChamp === "email" && (!valeur.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || valeur.match(" "))){
        document.getElementById(nomChamp + "ErrorMsg").textContent = "L'email doit etre sous la forme : 'mail@mail.fr' et ne doit pas contenir d'espace";    
        document.getElementById(nomChamp).style.border="3px solid orange";
        document.getElementById(nomChamp + "ErrorMsg").style.color="orange";
        document.getElementById("order").style.display = "none";

    } else {
        //Sinon c'est que c'est valide
    document.getElementById(nomChamp).style.border="3px solid green";
    document.getElementById(nomChamp + "ErrorMsg").style.color="green";
    document.getElementById(nomChamp + "ErrorMsg").textContent="Valide";
    return true;
}
}
//Controle général pour envoi
function verification(){
    //On récupére toutes les informations des champs et on test chaque partie indépendamment
    //Si toutes les valeurs renvoies TRUE on valide le panier
        nom = document.getElementById("firstName").value;
        prenom = document.getElementById("lastName").value;
        adresse = document.getElementById("address").value;
        ville = document.getElementById("city").value;
        email = document.getElementById("email").value;
        //Recupération des dernières infos panier
        panierReturn = JSON.parse(localStorage.getItem("Panier"));
        //Pour chaque valeur présente dans le panier Ls
        for(x=0;x<panierReturn.length;x++){
        //Pour chaque valeur dans le JSON recue par le BACKEND
        //on récupère les ID des produits
        panierReturnId.push(panierReturn[x].id);
        }
        let contactforBack = {
            firstName: prenom,
            lastName: nom,
            address: adresse,
            city: ville,
            email: email
        }
        let backOrder = {
            contact:contactforBack,
            products:panierReturnId
        }
        fetch("http://127.0.0.1:3000/api/products/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backOrder),
      })
        .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
        .then(function (data) {
          location.href = `http://127.0.0.1:5000/front/html/confirmation.html?orderId=${data.orderId}`;
        })
        .catch(function (err) {
          console.log(err);
        });
        
}
//Affichage du bouton d'envoi si tout est bon
function envoiForm(){
    if(validationAddress && validationCity && validationEmail && validationNom && validationPrenom){
        console.log("Tous les champs sont bon");
        document.getElementById("order").style.display = "block";
    } else {
        document.getElementById("order").style.display = "none";
    }
    }

//Controle indépendant des champs
document.getElementById("firstName").addEventListener("change",() => {
    let valeurEntree = document.getElementById("firstName").value;
    if(verificationDeRemplissage("firstName", valeurEntree)){
        validationNom = true;
        envoiForm();
    }
})
document.getElementById("lastName").addEventListener("change",() => {
    let valeurEntree = document.getElementById("lastName").value;
    if(verificationDeRemplissage("lastName", valeurEntree)){
        validationPrenom = true;
        envoiForm();
    }
})
document.getElementById("address").addEventListener("change",() => {
    let valeurEntree = document.getElementById("address").value;
    if(verificationDeRemplissage("address", valeurEntree)){
        validationAddress = true;
        envoiForm();
    }
})
document.getElementById("city").addEventListener("change",() => {
    let valeurEntree = document.getElementById("city").value;
    if(verificationDeRemplissage("city", valeurEntree)){
        validationCity = true;
        envoiForm();
    }
})
document.getElementById("email").addEventListener("change",() => {
    let valeurEntree = document.getElementById("email").value;
    if(verificationDeRemplissage("email", valeurEntree)){
        validationEmail = true;
        envoiForm();
    }
})

//Evenements lors du click formulaire
document.getElementById("order").addEventListener("click",verification);

//---------------------------------------Execution de la page--------------------------------
//On masque le bouton de validation
document.getElementById("order").style.display = "none";
//On lance le script de récupéartion des données
recuperation();                                    