
let url_api ="http://127.0.0.1:3000/api";
let productsLs;
let article;
let divImg;
let img;
let divContent;
let i; 
let jsonretour;
let divDetails;
let elH2;
let elPcouleur;
let elPrixTotal;
let divContentQtePrixDel;
let divQtePrix;
let elPquantite;
let elDivError;
let elInputQuantite;
let divDel;
let elPdelete; 
let complitedProduct;
let addToTransfert = [];

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
                                   
                        addToTransfert.push(complitedProduct);
                        
                }
            }
        }
        displayCart(addToTransfert);
    })
    .catch(function (error) {
        alert(`Une erreur est survenue au chargement du panier:  ${error}. Merci de revenir.`);
    });
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
function changeDomDivDetails(productName,productColor,productPrice){
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
            elPrixTotal.textContent = productPrice;
    
}
function changeDomDivContentQtePriceDel(){
    divContentQtePrixDel = document.createElement("div");
    divContent.appendChild(divContentQtePrixDel);
        divContentQtePrixDel.className = "cart__item__content__settings";
}
function changeDomDivQuantityPrice(productQuantity){
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
                            addEventListQuantity();
}
function changeDomDivDelete(){
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
            addEvelentListDelete();
           
}
//#######Action de modifications############
function addEventListQuantity(){
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
}
function addEvelentListDelete(){
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
}
//########Affichage##########
function displayCart(addToTransfert){
   //On vide le DOM pour partir sur une base propre
   document.querySelector("#cart__items").textContent="";
   //On passe les quantités et prix à 0
   totalPrice = 0;
   totalQuantity = 0;   
    for(x=0;x<addToTransfert.length;x++){
        changeDomArticle(addToTransfert[x].id);
        changeDomImage(addToTransfert[x].image,addToTransfert[x].imagesAlt);
        changeDomDivContent();
        changeDomDivDetails(addToTransfert[x].name,addToTransfert[x].color,addToTransfert[x].price);
        changeDomDivContentQtePriceDel();
        changeDomDivQuantityPrice(addToTransfert[x].quantity);
        changeDomDivDelete();
    }

}

getTotalProducts();

