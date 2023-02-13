//récupération de l'id produit
const url = new URL(window.location.href);
const urlProductId = url.searchParams.get('id');
//URL DE L API
let url_api ="http://127.0.0.1:3000/api";
let cartProducts = [];
let positionProduit;
//class constructor pour ajout au LS
class NewLsProduct{
    constructor(id, quantity, color){
        this.id = id;
        this.quantity = Number(quantity);
        this.color = color;
    }
}

//Fonctions
//######Retour à l'index######
function goToIndex(){
    document.location.href = "/front/html/index.html";
}
//######Recuperation du JSON######
function getProductApi(){
    return fetch (`${url_api}/products/${urlProductId}`)
    .then(function(product) {

        if (product.ok) {

            return product.json();

        }

    });
}

//######Affichage du produit########
function displayProduct(){
    getProductApi()
    .then(function(product){
        changeProductTitlePage(product);
        changeProductImage(product);
        changeProductTitle(product);
        changeProductPrice(product);
        changeProductDescription(product);
        changeProductColorOption(product);
        changeProductQuantityDefault(product);
        changeDisplayErrorMsg();
    })
    .catch(function (error) {
      alert(`Une erreur est survenue au chargement du produit: ${error}. Merci de revenir.`);
      goToIndex();
    });
}

//######Traitement DOM du produit########
function changeProductTitlePage(product){
    //Titre de la page
    document.querySelector("title").textContent = product.name;
}
function changeProductTitle(product){
    //titre du produit
    document.getElementById("title").textContent = product.name;
}
function changeProductImage(product){
    //Image du produit
    let elImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(elImg);
    elImg.setAttribute("src", product.imageUrl);
    elImg.setAttribute("alt", `${product.altTxt},${product.name}`);
}
function changeProductPrice(product){
    //Prix du produit
    document.getElementById("price").textContent = product.price;
}
function changeProductDescription(product){
    //description du produit
    document.getElementById("description").textContent = product.description;
}
function changeProductColorOption(product){
    //Les options de couleurs
    let nbColors = product.colors.length;
    //Boucle pour insertion
      for(let i =0;i < nbColors; i++){
        document.getElementById("colors").innerHTML += `<option value='${product.colors[i]}'>${product.colors[i]}</option>`;
        //document.getElementById("colors").innerHTML += "<option value='" + product.colors[i] + "'>" + product.colors[i] + "</option>";
      }
}
function changeProductQuantityDefault(){
    //Quantite par defaut 1
    document.getElementById("quantity").setAttribute("value", 1);
}

//######Traitement DOM des messages d erreurs######
function changeDisplayErrorMsg(){
    let elDivError = document.createElement("div");
    document.querySelector("article").appendChild(elDivError);
    elDivError.style.marginTop="5px";
    elDivError.style.width="90%";
    elDivError.setAttribute("id", "messages");
}
//######Verification Erreur remplissage#######
function verificationIsValidColor(){
    //Couleur non séléctionnée => Erreur
    return ( 
        document.getElementById("colors").value != ""
    );
}
function verificationIsValidQuantity(){
    //Quantite comprise entre 1 et 100 compris => verification OK
  return (
    document.getElementById("quantity").value >= 1 &&
    document.getElementById("quantity").value <= 100
  );
}
//######Traitement des différentes erreurs######
function displayErrorMsgColor(){
    let msgError = "Merci de choisir une couleur.";
    messageError(`${msgError}`);
    //Disparition au bout de 2 secondes
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);

}
function displayErrorMsgQuantity(){
    let msgError = `Quantité ${document.getElementById("quantity").value} impossible<br>il doit etre compris en 1 et 100.<br>`;
    let detailMsgError = "";
    //Controle de quantité et action sur le DOM
    if (document.getElementById("quantity").value <= 0){ 
        detailMsgError = "Insertion minimum : 1";
        document.getElementById("quantity").value = 1; 
    } else if (document.getElementById("quantity").value >= 101){ 
        detailMsgError = "Insertion maximum : 100";
        document.getElementById("quantity").value = 100;
    }
    messageError(`${msgError} ${detailMsgError}`)
    //Disparition au bout de 2 secondes
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);
}
//######Traitement des messages de succès#######
function displaySuccessMsgAddProduct(){
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = "<p>Produit ajouté au panier</p>";
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, 2000);
}
function displaySuccessMsgUpdateProduct(){
    //On agit sur le DOM pour afficher le message de modification de quantité
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = "<p>Quantité modifiée dans votre panier</p>";
    //Durée d'affichage de 2sec
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, 2000);
}
//######Affichage du message d'erreur########
function messageError(message){
    //On agit sur le DOM pour afficher le message d'erreur
    document.getElementById("messages").style.color="red";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="white";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML=`<p>${message}</p>`;
}

//######Ajout au panier#########
function addToCart(){
     //Vérification des quantités
    if (!verificationIsValidQuantity()) {
      displayErrorMsgQuantity();
      return;
    }
    //Vérification de la couleur
    if (!verificationIsValidColor()) {
      displayErrorMsgColor();
      return;
    }
    //Si la couleur et la quantité est correct on créer un produit à insérer
  let selectedQuantity = document.getElementById("quantity").value;
  let selectedColor = document.getElementById("colors").value;
  let addedProduct = new NewLsProduct(
    urlProductId,
    selectedQuantity,
    selectedColor
  );
   //ANALYSE DU LS
  //récupération du LS
  getLocalStorage();
  //Si le LS contient l'article correspondant à la couleur et à l'ID
  let productInCart = productIsInCart(addedProduct.id, addedProduct.color); 
  let productIdInCart = productIdIsInCart(addedProduct.id, addedProduct.color);
  if (productInCart == null) {
    if (productIdInCart == null) {   
    //Pas d'ID correspondant dans le tableau
        cartProducts.push(addedProduct);
    } else {
        //Id déjà connu et couleur différente
        //On l'insert à la suite du précedent
    for (i=0;i<cartProducts.length;i++){
        if(cartProducts[i].id === addedProduct.id){
            cartProducts.splice(i,0, addedProduct);
            break;
        }
    }
    }
    displaySuccessMsgAddProduct();
  } else {
    //ID et Couleur identique on modifie la quantité
    productInCart.quantity = Number(addedProduct.quantity);
    
    displaySuccessMsgUpdateProduct();
  }
  updateLocalStorage();

}
function getLocalStorage(){
    if (localStorage.length != 0) return cartProducts = JSON.parse(localStorage.getItem("Panier"));
    else return null;
}

function updateLocalStorage(){
    //Pour toutes les valeurs du tableau cartProduct on insert dans le localstorage
    for (i = 0; i < cartProducts.length; i++) {
      localStorage.setItem("Panier", JSON.stringify(cartProducts));
    }
}
function productIdIsInCart(productId, productColor){  
    let products = cartProducts
    //Filtre le panier => Si un element correspond aux meme critères on le retourne dans la fonction.
    .filter(function (cartProduct) {
      return (
        cartProduct.id === productId && cartProduct.color != productColor
      );
    });
    if(products.length > 0 ) return products[0];
    else return null;
}
function productIsInCart(productId, productColor){  
    let products = cartProducts
    //Filtre le panier => Si un element correspond aux meme critères on le retourne dans la fonction.
    .filter(function (cartProduct) {
      return (
        cartProduct.id === productId && cartProduct.color === productColor
      );
    });
    if(products.length > 0 ) return products[0];
    else return null;
}
function productAlreadyExist(){
    //pour toutes les valeurs dans le LS on vérifie la présence de l'ID
    for(i=0;i<cartProducts.length;i++){
    //On récupère l'index du produit qui correspond à notre future ajout pour l'insérer au bon emplacement
        if(cartProducts[i].id===produit.id){
            positionProduit = i;
            return true;
            } else {
            return false;
        }
    }
}

//--------------Chargement de la page------------------
//On affiche le produit
displayProduct();
//Click pour ajout au panier
document.getElementById("addToCart").addEventListener("click", addToCart);
