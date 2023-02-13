//URL DE L API
let url_api ="http://127.0.0.1:3000/api";
let elA;
let elArticle;
let elImg;
let elH3;
let elP;

//######Recuperation du JSON######
function getProductsApi(){
    return fetch (`${url_api}/products`)
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
            let productLink = `./product.html?id=${product[i]._id}`;
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
      // Une erreur est survenue
      alert(`Une erreur est survenue au chargement des produits: ${error}. Merci de revenir.`);
           
    });
}

//--------------Chargement de la page------------------
//On affiche les produits
displayProducts();