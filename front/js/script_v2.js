//Déclaration des variables
let elA,elArticle,elImg,elH3,elP;

//######Recuperation du JSON de l'API######
function getProductsApi(){
    return fetch (`${URL_API}:${PORT_API}/${URL_ALL_PRODUCT}`)
    .then(function(products) {

        if (products.ok) {

            return products.json();

        }

    });
}
//######   DOM   ######
//######Modification de l'url du produit######
function changeProductLink(productsInc){
    elA = document.createElement("a");
    document.querySelector("#items").appendChild(elA);
    elA.setAttribute("href", productsInc);
}
//######Modification du produit Article######
function changeProductArticle(){
    elArticle = document.createElement("article");
    elA.appendChild(elArticle);
}
//######Modification de l'image######
function changeProductImage(productsIncUrl,productsIncAlt){
    elImg =document.createElement("img");
    elArticle.appendChild(elImg);
    elImg.setAttribute("src", productsIncUrl);
    elImg.setAttribute("alt", productsIncAlt);
}
//######Modification du titre######
function changeProductTitle(productsInc){
    elH3 = document.createElement("H3");
    elArticle.appendChild(elH3);
    elH3.className= "productName";
    elH3.innerHTML= productsInc;
}
//######Modification de la description######
function changeProductDescription(productsInc){
    elP = document.createElement("p");
    elArticle.appendChild(elP);
    elP.className= "productDescription";
    elP.innerHTML= productsInc;
}

//######Affichage du produit######
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
//######Les erreurs######
//######Affichage des messages d'erreurs sur la page######
function errorMsg(message){
    document.querySelector("#items").innerHTML=`<center>${message}</center>`;
}
//######Affichage des messages d'erreurs dans la console######
function errorMsgConsole(message){
    console.error(message);
}

//######Chargement de la page######
displayProducts();