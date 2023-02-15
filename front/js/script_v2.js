//URL DE L API
let elA;
let elArticle;
let elImg;
let elH3;
let elP;

//######Recuperation du JSON######
function getProductsApi(){
    return fetch (`${URL_API}:${PORT_API}/${URL_ALL_PRODUCT}`)
    .then(function(products) {

        if (products.ok) {

            return products.json();

        }

    });
}

//######Traitement DOM du produit########
function changeProductLink(productsInc){
    elA = document.createElement("a");
    document.querySelector("#items").appendChild(elA);
    elA.setAttribute("href", productsInc);
}

function changeProductArticle(){
    elArticle = document.createElement("article");
    elA.appendChild(elArticle);
}

function changeProductImage(productsIncUrl,productsIncAlt){
    elImg =document.createElement("img");
    elArticle.appendChild(elImg);
    elImg.setAttribute("src", productsIncUrl);
    elImg.setAttribute("alt", productsIncAlt);
}

function changeProductTitle(productsInc){
    elH3 = document.createElement("H3");
    elArticle.appendChild(elH3);
    elH3.className= "productName";
    elH3.innerHTML= productsInc;
}

function changeProductDescription(productsInc){
    elP = document.createElement("p");
    elArticle.appendChild(elP);
    elP.className= "productDescription";
    elP.innerHTML= productsInc;
}

//Affichage des produits en boucle
function displayProducts(){
    getProductsApi()
    .then(function(product){
        let nbProduct = product.length;    
          for(let i = 0;i < nbProduct; i++){
            let productLink = `${LINK_PRODUCT}${product[i]._id}`;
            let productUrlImage = `${product[i].imageUrl}`;
            let productAltText = `${product[i].altTxt}`;
            let productName = `${product[i].name}`;
            let productDescription = `${product[i].description}`;

            changeProductLink(productLink);
            changeProductArticle();
            changeProductImage(productUrlImage, productAltText);
            changeProductTitle(productName);
            changeProductDescription(productDescription);

        }
    })
    .catch(function(error) {
        errorMsg(`${ALERT_PRODUCTS_LOAD}. <br>${ALERT_COME_BACK_LATER}`);
        errorMsgConsole(`${ALERT_PRODUCTS_LOAD} ${error}.`);
    
    });
}
function errorMsg(message){
    document.querySelector("#items").innerHTML=`<center>${message}</center>`;
}
function errorMsgConsole(message){
    console.error(message);
}
//--------------Chargement de la page------------------
//On affiche les produits
displayProducts();