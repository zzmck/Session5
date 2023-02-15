//récupération de l'id produit
const url = new URL(window.location.href);
const urlProductId = url.searchParams.get('id');

//URL DE L API
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
    document.location.href = LOCATION_INDEX;
}
//######Recuperation du JSON######
function getProductApi(){
    return fetch (`${URL_API}:${PORT_API}/${URL_ALL_PRODUCT}/${urlProductId}`)
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
        eventListenerAddToCart();
        changeDisplayErrorMsg();
    })
    .catch(function (error) {        
        errorMsg(`${ALERT_PRODUCT_LOAD}.<br> ${ALERT_COME_BACK_LATER}`);
        errorMsgConsole(`${ALERT_PRODUCT_LOAD} ${error}.`);
        setTimeout(goToIndex, TIME_DURATION_FOR_MESSAGE);
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
function eventListenerAddToCart(){
document.getElementById("addToCart").addEventListener("click", addToCart);
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
    return ( 
        document.getElementById("colors").value != ""
    );
}
function verificationIsValidQuantity(){
  return (
    document.getElementById("quantity").value >= PRODUCT_QUANTITY_MIN &&
    document.getElementById("quantity").value <= PRODUCT_QUANTITY_MAX
  );
}
//######Traitement des différentes erreurs######
function displayErrorMsgColor(){
    let msgError = ALERT_CHOOSE_COLOR;
    messageError(`${msgError}`);
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, TIME_DURATION_FOR_MESSAGE);

}
function displayErrorMsgQuantity(){
    let msgError = `${ALERT_QUANTITY} ${document.getElementById("quantity").value} ${ALERT_IMPOSSIBLE}<br>${ALERT_BETWEEN_MIN_MAX}.<br>`;
    let detailMsgError = "";
    //Controle de quantité et action sur le DOM
    if (document.getElementById("quantity").value < PRODUCT_QUANTITY_MIN){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MIN;
        document.getElementById("quantity").value = PRODUCT_QUANTITY_MIN; 
    } else if (document.getElementById("quantity").value > PRODUCT_QUANTITY_MAX){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MAX;
        document.getElementById("quantity").value = PRODUCT_QUANTITY_MAX;
    }
    messageError(`${msgError} ${detailMsgError}`)
    //Disparition au bout de 2 secondes
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, TIME_DURATION_FOR_MESSAGE);
}
//######Traitement des messages de succès#######
function displaySuccessMsgAddProduct(){
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = `<p>${ALERT_ADD_TO_CART}</p>`;
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, TIME_DURATION_FOR_MESSAGE);
}
function displaySuccessMsgUpdateProduct(){
    //On agit sur le DOM pour afficher le message de modification de quantité
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = `<p>${ALERT_MODIFICATION_IN_CART}</p>`;
    //Durée d'affichage de 2sec
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, TIME_DURATION_FOR_MESSAGE);
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
function errorMsg(message){
    document.querySelector(".item").innerHTML=`<center>${message}</center>`;

}
function errorMsgConsole(message){
    console.error(message);
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
