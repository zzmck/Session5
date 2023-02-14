
let url_api ="http://127.0.0.1:3000/api";
let productsLs, article, divImg, img, divContent,i,jsonretour,divDetails,elH2,elPcouleur,elPrixTotal,divContentQtePrixDel,divQtePrix,elPquantite,elDivError,elInputQuantite,divDel;
let elPdelete,complitedProduct;
let productFullInformation = [];

//--------------------------LES CLASSES CONSTRUCTORS---------------------------------------------
class Prices {

    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }

}
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
//######Recuperation du JSON API######
function getProductsApi(){
    return fetch (`${url_api}/products`)
    .then(function(productsApi) {

        if (productsApi.ok) {

            return productsApi.json();

        }

    });
}
//######Recuperation du LS#########
function getProductsLs(){
    productsLs = JSON.parse(localStorage.getItem("Panier"));
}
//######Mise en corélation des deux Json pour sortir un tableau de traitement complet###############
function getTotalProducts(){
    getProductsLs();
    getProductsApi()
    .then(function(productsApi){ 
        //Pour chaque valeur présente dans le panier Ls
        for(x=0;x<productsLs.length;x++){
            //Pour chaque valeur dans le JSON recue par le BACKEND
            for(i=0;i<productsApi.length;i++){
                //On compare le produit dans le LS au produit Backend
                if(productsLs[x].id === productsApi[i]._id){
                    //On créer un produit contenant toutes ses valeurs BAckend pour le traitement
                    //On insert une ligne dans allProduct avec ses éléments.
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
        alert(`Une erreur est survenue au chargement du panier:  ${error}. Merci de revenir.`);
    });
}
//########Affichage##########
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
         changeDomDivQuantity(productId,productColor,productIndex,productQuantity,productPriceAlone,productPriceByQuantity);
         changeDomDivDelete(productIndex);
         eventListenerform();
         showHideButtonValidation();
         eventListenerSendForm();
     }
     countTotalPrice();
 }
//#######Affichage du panier##########
function changeDomArticle(productId){
    article = document.createElement("article");
    document.querySelector("#cart__items").appendChild(article);
    article.className = "cart__item";
    article.setAttribute("data-id", productId);
}
function changeDomImage(productImg,productImgAlt){
    divImg = document.createElement("div");
    article.appendChild(divImg);
    divImg.className = "cart__item__img";
        img = document.createElement("img");
        divImg.appendChild(img);
            img.setAttribute('src', productImg);
            img.setAttribute('alt', productImgAlt);
}
function changeDomDivContent(){
    divContent = document.createElement("div");
    article.appendChild(divContent);
        divContent.className = "cart__item__content";
}
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
function changeDomDivContentQtePriceDel(){
    divContentQtePrixDel = document.createElement("div");
    divContent.appendChild(divContentQtePrixDel);
        divContentQtePrixDel.className = "cart__item__content__settings";
}
function changeDomDivQuantity(productId,productColor,productIndex,productQuantity,productPriceAlone,productPriceByQuantity){
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
                            elInputQuantite.setAttribute("min", 1);
                            //max 100
                            elInputQuantite.setAttribute("max",100);
                            //value = PRICE
                            elInputQuantite.setAttribute("value",productQuantity);
                            eventListenerProductQuantity(productPriceAlone,productIndex);
}
function changeDomDivDelete(productIndex){
    divDel = document.createElement("div");
    divContentQtePrixDel.appendChild(divDel);
        //class  cart__item__content__settings__delete
        divDel.className = "cart__item__content__settings__delete";
        //p
        elPdelete = document.createElement("p");
        divDel.appendChild(elPdelete);
            //class deleteItem
            elPdelete.setAttribute("class", "deleteItem");
            //Supprimer
            elPdelete.textContent="Supprimer";
            eventListenerProductDelete(productIndex);
           
}

//#######Modification des quantités#########
function eventListenerProductQuantity(productPriceAlone,productIndex){
    elInputQuantite.addEventListener("change", (e) => {
        e.preventDefault;
        let productQuantitySelector = document.getElementById('cart__items').children[productIndex].querySelector("input").value;
        //Vérification de la nouvelle quantité (entre 1 et 100)
        if(verificationQuantity(productQuantitySelector)){
            newProductPrice = Number(productPriceAlone) * Number(productQuantitySelector);
            displayProductPrice(newProductPrice,productIndex);
            productsLs[productIndex].quantity = Number(productQuantitySelector);
            sendLocalStorage();
            countTotalPrice();    
        }
        else {
            console.log("Quantité impossible doit etre compris en 1 et 100");
            document.getElementById('cart__items').children[productIndex].querySelector("input").value = "100";
        };
        //modificationQuantity(productId,productColor,productIndex, elInputQuantite.value,productPrice);
        //Sinon message d'erreur
    });
}
function verificationQuantity(newProductQuantity){
    return (
        newProductQuantity >= 1 &&
        newProductQuantity <= 100
      );
}
function displayProductPrice(newProductPrice,productIndex){
    document.getElementById('cart__items').children[productIndex].childNodes[1].childNodes[0].childNodes[2].textContent = newProductPrice;
}
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
function displayTotalPrice(totalProductQuantity,totalProductPrice){
    document.getElementById("totalQuantity").textContent = Number(totalProductQuantity);
    document.getElementById("totalPrice").textContent = Number(totalProductPrice);
    return true;
}

//#######Supprimer un produit############
function eventListenerProductDelete(productIndex){
    elPdelete.addEventListener("click", (e) => {
        e.preventDefault;
        deleteProduct(productIndex);
        countTotalPrice();
       });
}
function deleteProduct(productIndex){
    productsLs.splice(productIndex,1);
    sendLocalStorage();
    var deleteOnDom = document.getElementById("cart__items");
    deleteOnDom.removeChild(deleteOnDom.childNodes[productIndex]);   
}
function sendLocalStorage(){
    localStorage.setItem("Panier", JSON.stringify(productsLs));
}
function errorMsg(){}
function deleteAllProducts(){
    document.querySelector("#cart__items").textContent="";
}

//##########Formulaire#########
let validationAddress=false;
let validationCity=false;
let validationEmail=false;
let validationNom=false;
let validationPrenom=false;
function eventListenerform(){
    document.getElementById("firstName").addEventListener("change",() => {
        let inputValue = document.getElementById("firstName").value;
        if(controlFormInput("firstName", inputValue)){
            validationNom = true;
            showHideButtonValidation();
        }
    })
    document.getElementById("lastName").addEventListener("change",() => {
        let inputValue = document.getElementById("lastName").value;
        if(controlFormInput("lastName", inputValue)){
            validationPrenom = true;
            showHideButtonValidation();
        }
    })
    document.getElementById("address").addEventListener("change",() => {
        let inputValue = document.getElementById("address").value;
        if(controlFormInput("address", inputValue)){
            validationAddress = true;
            showHideButtonValidation();
        }
    })
    document.getElementById("city").addEventListener("change",() => {
        let inputValue = document.getElementById("city").value;
        if(controlFormInput("city", inputValue)){
            validationCity = true;
            showHideButtonValidation();
        }
    })
    document.getElementById("email").addEventListener("change",() => {
        let inputValue = document.getElementById("email").value;
        if(controlFormInput("email", inputValue)){
            validationEmail = true;
            showHideButtonValidation();
        }
    })
}
function eventListenerSendForm(){
    document.getElementById("order").addEventListener("click",sendForm);
}
function controlFormInput(inputName, inputValue){
    if(inputValue.length === 0){
        errorFormMsg(inputName,"red","Le champ ne doit pas etre vide");
        return false;
    } else if (inputName != "address" && inputName!="email" && inputValue.match(/[0-9]/i)){
            errorFormMsg(inputName,"orange","Le champ ne doit pas contenir de nombre [0-9]");
            return false;
    } else if (inputName != "address" && inputName != "email" && inputValue.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)){
        errorFormMsg(inputName,"orange","Le champ ne doit pas contenir de caractères spéciaux");
        return false;
    }
    else if(inputName === "email" && (!inputValue.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || inputValue.match(" "))){
        errorFormMsg(inputName,"orange","L'email doit etre sous la forme : 'mail@mail.fr' et ne doit pas contenir d'espace");
    } else {
        errorFormMsg(inputName,"green","Valide");
    return true;
}
}
function showHideButtonValidation(){
    if(validationAddress && validationCity && validationEmail && validationNom && validationPrenom){
        document.getElementById("order").style.display = "block";
    } else {
        document.getElementById("order").style.display = "none";
    }
}
function errorFormMsg(inputName,errorColor,message){
    document.getElementById(inputName + "ErrorMsg").textContent = message;    
    document.getElementById(inputName).style.border=`3px solid ${errorColor}`;
    document.getElementById(inputName + "ErrorMsg").style.color = errorColor;
    document.getElementById("order").style.display = "none";
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
        fetch("http://127.0.0.1:3000/api/products/order", {
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
            location.href = `/front/html/confirmation.html?orderId=${data.orderId}`;
          })
        .catch(function (err) {
          console.log(err);
        });
        
}

getTotalProducts(); 