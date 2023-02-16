
//#####Déclaration des variables#####
let productsLs, article, divImg, img, divContent,i,jsonretour,divDetails,elH2,elPcouleur,elPrixTotal,divContentQtePrixDel,divQtePrix,elPquantite,elDivError,elInputQuantite,divDel,elPdelete,complitedProduct;
let productFullInformation = [];

//--------------------------CLASSE CONSTRUCTOR---------------------------------------------
//#####Classe produit#####
class Produits {

    constructor(id, color, quantity, name, image, imageAlt, description, price) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
        this.name = name;
        this.image = image;
        this.imagesAlt = imageAlt;
        this.description = description;
        this.price = price;
    }

}

//#####LES MESSAGES D ERREUR#####
//#####Les champs de formulaires#####
function errorFormMsg(inputName,errorColor,message){
    document.getElementById(inputName + "ErrorMsg").textContent = message;    
    document.getElementById(inputName).style.border=`3px solid ${errorColor}`;
    document.getElementById(inputName + "ErrorMsg").style.color = errorColor;
    disableButtonValidation();
}
//#####Les erreurs de quantités séléctionnées#####
function errorMsgQuantity(productPriceAlone, productIndex){
    let msgError = `${ALERT_QUANTITY}<br>${ALERT_BETWEEN_MIN_MAX}.<br>`;
    let detailMsgError = "";
    //Controle de quantité et action sur le DOM
    if (document.getElementById('cart__items').children[productIndex].querySelector("input").value < PRODUCT_QUANTITY_MIN){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MIN;
        document.getElementById('cart__items').children[productIndex].querySelector("input").value = PRODUCT_QUANTITY_MIN; 
    } else if (document.getElementById('cart__items').children[productIndex].querySelector("input").value > PRODUCT_QUANTITY_MAX){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MAX;
        document.getElementById('cart__items').children[productIndex].querySelector("input").value = PRODUCT_QUANTITY_MAX;
    }
    messageError(productIndex,`${msgError} ${detailMsgError}`)
    setTimeout(() => {              
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].innerHTML="";
    }, TIME_DURATION_FOR_MESSAGE);
    modificationQuantity(productPriceAlone,productIndex)
}
//#####Mise en forme DOM pour les messages d'erreurs######
function messageError(productIndex, message){
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].style.color="red";
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].style.borderRadius="50px";
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].style.backgroundColor="white";
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].style.textAlign="center";                                     
        document.getElementById('cart__items').children[productIndex].querySelector('.cart__item__content__settings').children[1].innerHTML=`<p>${message}</p>`;
}
//#####Affichage des messages d'erreurs globales#####
function errorMsg(message){
    document.querySelector(".cart").innerHTML=`<center>${message}</center>`;
}
//#####Affichage des messages d'erreurs globales dans la console######
function errorMsgConsole(message){
    console.error(message);
}

//##########FORMULAIRE#########
//Déclaration des variables
let validationAddress=false;
let validationCity=false;
let validationEmail=false;
let validationNom=false;
let validationPrenom=false;
//#####Creation des event listener pour les champs du formulaire#####
function eventListenerform(){
    document.getElementById("firstName").addEventListener("change",() => {
        let inputValue = document.getElementById("firstName").value;
        if(controlFormInput("firstName", inputValue)){
            validationNom = true;
            disableEnableButtonValidation();
        }
    })
    document.getElementById("lastName").addEventListener("change",() => {
        let inputValue = document.getElementById("lastName").value;
        if(controlFormInput("lastName", inputValue)){
            validationPrenom = true;
            disableEnableButtonValidation();
        }
    })
    document.getElementById("address").addEventListener("change",() => {
        let inputValue = document.getElementById("address").value;
        if(controlFormInput("address", inputValue)){
            validationAddress = true;
            disableEnableButtonValidation();
        }
    })
    document.getElementById("city").addEventListener("change",() => {
        let inputValue = document.getElementById("city").value;
        if(controlFormInput("city", inputValue)){
            validationCity = true;
            disableEnableButtonValidation();
        }
    })
    document.getElementById("email").addEventListener("change",() => {
        let inputValue = document.getElementById("email").value;
        if(controlFormInput("email", inputValue)){
            validationEmail = true;
            disableEnableButtonValidation();
        }
    })
}
//#####Creation de l'event listener pour le bouton d'envoi du formulaire#####
function eventListenerSendForm(){
    document.getElementById("order").addEventListener("click",sendForm);
}
//#####Controle des champs du formulaire#####
function controlFormInput(inputName, inputValue){
    if(inputValue.length === 0){
        errorFormMsg(inputName,COLOR_MESSAGE_FATAL,ALERT_FORM_NOT_EMPTY);
        return false;
    } else if (inputName != "address" && inputName!="email" && inputValue.match(/[0-9]/i)){
            errorFormMsg(inputName,COLOR_MESSAGE_MEDIUM,ALERT_FORM_NO_NUMBER);
            return false;
    } else if (inputName != "address" && inputName != "email" && inputValue.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)){
        errorFormMsg(inputName,COLOR_MESSAGE_MEDIUM,ALERT_FORM_NO_SPECIAL_CARACTERS);
        return false;
    }
    else if(inputName === "email" && (!inputValue.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || inputValue.match(" "))){
        errorFormMsg(inputName,COLOR_MESSAGE_MEDIUM,ALERT_FORM_EMAIL);
    } else {
        errorFormMsg(inputName,COLOR_MESSAGE_GOOD,SUCCESS_FORM);
    return true;
}
}
//#####Switch activation désactivation du bouton de formulaire#####
function disableEnableButtonValidation(){
    if(validationAddress && validationCity && validationEmail && validationNom && validationPrenom){
        enableButtonValidation();
    } else {
        disableButtonValidation();
    }
}
//#####Active le bouton de validation pour envoi du formulaire######
function enableButtonValidation(){
    document.getElementById("order").setAttribute("value", BUTTON_VALIDATION_ENABLE);
    document.getElementById("order").removeAttribute("disabled");
}
//#####Désactiver le bouton de validation tant que les champs de formulaires ne sont pas bon##### 
function disableButtonValidation(){
    document.getElementById("order").setAttribute("value", BUTTON_VALIDATION_DISABLE);
    document.getElementById("order").setAttribute("disabled", "disabled");    
}
//#######Envoi du formulaire########
function sendForm(){
    let productsIdOrder=[];
    inputFirstame = document.getElementById("firstName").value;
    inputLastname = document.getElementById("lastName").value;
    inputAddress = document.getElementById("address").value;
    inputCity = document.getElementById("city").value;
    inputEmail = document.getElementById("email").value;

    for(x=0;x<productsLs.length;x++){
    productsIdOrder.push(productsLs[x].id);
    }
    let contactforBack = {
        firstName: inputFirstame,
        lastName: inputLastname,
        address: inputAddress,
        city: inputCity,
        email: inputEmail
    }
    let backOrder = {
        contact:contactforBack,
        products:productsIdOrder
    }
        fetch(`${URL_API}:${PORT_API}/${URL_ORDER_PRODUCT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backOrder),
      })
        .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
        .then(function (data) {
            location.href = `${LOCATION_ORDER_CONFIRMATION}${data.orderId}`;
          })
        .catch(function (err) {
          console.log(err);
        });
        
}

//#####Panier VIDE#####
function cartIsEmpty(){
    if(productsLs.length===0){
        localStorage.removeItem("Panier");
        showProducts();
    }   
}
//#####Envoi au LocalStorage#####
function sendLocalStorage(){
    localStorage.setItem("Panier", JSON.stringify(productsLs));
}
//#####Suppression des produits du panier#####
function deleteAllProducts(){
    document.getElementById("cart__items").textContent="";
}

//#######SUPPRESSION D UN PRODUIT############
//####Création de l'event listener pour la suppression#####
function eventListenerProductDelete(productIndex){
    elPdelete.addEventListener("click", (e) => {
        e.preventDefault;
        deleteProductOnAllProduct(productIndex);
        deleteProductOnLs(productIndex);
        displayCart(productFullInformation);
        cartIsEmpty();
       });
}
//#####Suppression dans le local storage#####
function deleteProductOnLs(productIndex){
    productsLs.splice(productIndex,1);
    sendLocalStorage();
}
//#####Suppression dans le tableau de contenu global#####
function deleteProductOnAllProduct(productIndex){
    productFullInformation.splice(productIndex,1);
}

//#######QUANTITES#########
//#####Creation de l'event listener#####
function eventListenerProductQuantity(productPriceAlone,productIndex){
    elInputQuantite.addEventListener("change", (e) => {
        e.preventDefault;
        modificationQuantity(productPriceAlone,productIndex);
    });
}
//#####Modification des quantité au changement#####
function modificationQuantity(productPriceAlone,productIndex){
    let productQuantitySelector = document.getElementById('cart__items').children[productIndex].querySelector("input").value;
        if(verificationQuantity(productQuantitySelector)){
            newProductPrice = Number(productPriceAlone) * Number(productQuantitySelector);
            displayProductPrice(newProductPrice,productIndex);
            productsLs[productIndex].quantity = Number(productQuantitySelector);
            sendLocalStorage();
            countTotalPrice();    
        }
        else {
            errorMsgQuantity(productPriceAlone, productIndex);
            return;
        };
}
//#####Vérification de la quantite choisie#####
function verificationQuantity(newProductQuantity){
    return (
        newProductQuantity >= PRODUCT_QUANTITY_MIN &&
        newProductQuantity <= PRODUCT_QUANTITY_MAX
      );
}
//#####Affichage du nouveau prix du produit#####
function displayProductPrice(newProductPrice,productIndex){
    document.getElementById('cart__items').children[productIndex].childNodes[1].childNodes[0].childNodes[2].textContent = newProductPrice;
}

//#########PRIX########
//#####Calcul du prix produit et global du panier#####
function countTotalPrice(){
    let countProductQuantity,countProductPrice,totalProductQuantity,totalProductPrice;
    totalProductQuantity=0;
    totalProductPrice=0;
    for(x=0;x<productsLs.length;x++){
    countProductQuantity = Number(productsLs[x].quantity);
    countProductPrice = Number(productFullInformation[x].price);
    totalProductQuantity = Number(totalProductQuantity) + Number(countProductQuantity);
    totalProductPrice = Number(totalProductPrice) + (Number(countProductPrice) * Number(countProductQuantity));
    }
    displayTotalPrice(totalProductQuantity,totalProductPrice);
}
//#####Affichage du prix et de la quantité global du panier#####
function displayTotalPrice(totalProductQuantity,totalProductPrice){
    document.getElementById("totalQuantity").textContent = Number(totalProductQuantity);
    document.getElementById("totalPrice").textContent = Number(totalProductPrice);
    return true;
}

//#######DOM##########
//#####Modification de l'article#####
function changeDomArticle(productId){
    article = document.createElement("article");
    document.querySelector("#cart__items").appendChild(article);
    article.className = "cart__item";
    article.setAttribute("data-id", productId);
}
//#####Modification de l'image#####
function changeDomImage(productImg,productImgAlt){
    divImg = document.createElement("div");
    article.appendChild(divImg);
    divImg.className = "cart__item__img";
        img = document.createElement("img");
        divImg.appendChild(img);
            img.setAttribute('src', productImg);
            img.setAttribute('alt', productImgAlt);
}
//#####Modification du contenu#####
function changeDomDivContent(){
    divContent = document.createElement("div");
    article.appendChild(divContent);
        divContent.className = "cart__item__content";
}
//#####Modification des détails#####
function changeDomDivDetails(productName,productColor,productPriceByQuantity){
    divDetails = document.createElement("div");
    divContent.appendChild(divDetails);
        divDetails.className = "cart__item__content__description";
        elH2 = document.createElement("h2");
        divDetails.appendChild(elH2);
            elH2.textContent= productName;
        elPcouleur = document.createElement("p");
        divDetails.appendChild(elPcouleur);
            elPcouleur.textContent = productColor;
        elPrixTotal = document.createElement("p");
        divDetails.appendChild(elPrixTotal);
            elPrixTotal.textContent = productPriceByQuantity;
    
}
//#####Modification du contenu quantité prix suppression#####
function changeDomDivContentQtePriceDel(){
    divContentQtePrixDel = document.createElement("div");
    divContent.appendChild(divContentQtePrixDel);
        divContentQtePrixDel.className = "cart__item__content__settings";
}
//#####Modification des quantités#####
function changeDomDivQuantity(productIndex,productQuantity,productPriceAlone){
    divQtePrix = document.createElement("div");
    divContentQtePrixDel.appendChild(divQtePrix);
        divQtePrix.className = "cart__item__content__settings__quantity";
                        //p Qté :
                        elPquantite = document.createElement("p");
                        divQtePrix.appendChild(elPquantite); 
                        elDivError = document.createElement("div");
                        divContentQtePrixDel.appendChild(elDivError);
                        //input
                            elInputQuantite = document.createElement("input");
                            elPquantite.appendChild(elInputQuantite);
                            //type number
                            elInputQuantite.setAttribute("type", "number");
                            //class itemQuantity
                            elInputQuantite.setAttribute("class", "itemQuantity");
                            //name itemQuantity
                            elInputQuantite.setAttribute("name", "itemQuantity");
                            //min 1
                            elInputQuantite.setAttribute("min", PRODUCT_QUANTITY_MIN);
                            //max 100
                            elInputQuantite.setAttribute("max", PRODUCT_QUANTITY_MAX);
                            //value = PRICE
                            elInputQuantite.setAttribute("value",productQuantity);
                            eventListenerProductQuantity(productPriceAlone,productIndex);
}
//#####Modification de la suppression#####
function changeDomDivDelete(productIndex){
    divDel = document.createElement("div");
    divContentQtePrixDel.appendChild(divDel);
        divDel.className = "cart__item__content__settings__delete";
        elPdelete = document.createElement("p");
        divDel.appendChild(elPdelete);
            elPdelete.setAttribute("class", "deleteItem");
            elPdelete.textContent="Supprimer";
            eventListenerProductDelete(productIndex);
           
}

//########Affichage de la page##########
function displayCart(productFullInformation){
    deleteAllProducts();
     for(x=0;x<productFullInformation.length;x++){
        let productIndex = x;
        let productId = productFullInformation[x].id;
        let productImage = productFullInformation[x].image;
        let productImageAlt = productFullInformation[x].imageAlt;
        let productColor = productFullInformation[x].color;
        let productName = productFullInformation[x].name;
        let productQuantity = productFullInformation[x].quantity;
        let productPriceAlone = productFullInformation[x].price;
        let productPriceByQuantity = productPriceAlone * productQuantity;
        totalPrice = totalPrice + (productPriceAlone * productQuantity);
        totalQuantity = totalQuantity + productQuantity;
         changeDomArticle(productId);
         changeDomImage(productImage,productImageAlt);
         changeDomDivContent();
         changeDomDivDetails(productName,productColor,productPriceByQuantity);
         changeDomDivContentQtePriceDel();
         changeDomDivQuantity(productIndex,productQuantity,productPriceAlone);
         changeDomDivDelete(productIndex);
         eventListenerform();
         disableEnableButtonValidation();
         eventListenerSendForm();
     }
     countTotalPrice();
 }
//######Recuperation du JSON API######
function getProductsApi(){
    return fetch (`${URL_API}:${PORT_API}/${URL_ALL_PRODUCT}`)
    .then(function(productsApi) {

        if (productsApi.ok) {

            return productsApi.json();

        }

    });
}
//######Recuperation du LocalStorage en JSON#########
function getProductsLs(){
    productsLs = JSON.parse(localStorage.getItem("Panier"));
}
//######Mise en corélation des deux Json pour sortir un tableau de traitement complet###############
function getTotalProducts(){
    productFullInformation = [];
    getProductsLs();
    getProductsApi()
    .then(function(productsApi){
        for(x=0;x<productsLs.length;x++){
            for(i=0;i<productsApi.length;i++){
                if(productsLs[x].id === productsApi[i]._id){
                    complitedProduct = new Produits(
                        productsApi[i]._id, 
                        productsLs[x].color, 
                        productsLs[x].quantity, 
                        productsApi[i].name, 
                        productsApi[i].imageUrl,
                        productsApi[i].altTxt,
                        productsApi[i].description, 
                        productsApi[i].price
                        );
                        productFullInformation.push(complitedProduct);
                }
            }
        }
        displayCart(productFullInformation);
    })
    .catch(function (error) {
        errorMsg(`${ALERT_CART_LOAD}.<br> ${ALERT_COME_BACK_LATER}`);
        errorMsgConsole(`${ALERT_CART_LOAD}  ${error}.`);
    });
}
//#####Chargement de la page SI lea panier n'est pas vide#####
function showProducts(){
    if(!localStorage.getItem("Panier")){
        document.querySelector("#cartAndFormContainer").innerHTML=ALERT_CART_IS_EMPTY;
    } else {
        getTotalProducts();
    }
}
showProducts(); 