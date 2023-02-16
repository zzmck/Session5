//récupération de l'url et de l'id produit
const url = new URL(window.location.href);
const urlProductId = url.searchParams.get('id');

//Déclaration des variables
let cartProducts = [];
let positionProduit;

//--------------------------CLASSE CONSTRUCTOR---------------------------------------------
//#####Pour jout produit au LocalStorage#####
class NewLsProduct{
    constructor(id, quantity, color){
        this.id = id;
        this.quantity = Number(quantity);
        this.color = color;
    }
}

//###########Fonctions###########
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
//#####Titre de la page#####
function changeProductTitlePage(product){
    document.querySelector("title").textContent = product.name;
}
//#####Titre du produit#####
function changeProductTitle(product){
    document.getElementById("title").textContent = product.name;
}
//#####Image du produit#####
function changeProductImage(product){
    let elImg = document.createElement("img");
    document.querySelector(".item__img").appendChild(elImg);
    elImg.setAttribute("src", product.imageUrl);
    elImg.setAttribute("alt", `${product.altTxt},${product.name}`);
}
//#####Prix du produit#####
function changeProductPrice(product){
    document.getElementById("price").textContent = product.price;
}
//#####Description du produit######
function changeProductDescription(product){
    document.getElementById("description").textContent = product.description;
}
//#####Les couleurs du produit######
function changeProductColorOption(product){
    let nbColors = product.colors.length;
      for(let i =0;i < nbColors; i++){
        document.getElementById("colors").innerHTML += `<option value='${product.colors[i]}'>${product.colors[i]}</option>`;
      }
}
//#####Quantité par défaut à l'affichage#####
function changeProductQuantityDefault(){
    document.querySelector(".item__content__settings__quantity").children[0].textContent=PRODUCT_TITLE_QUANTITY;
    document.getElementById("quantity").setAttribute("min", PRODUCT_QUANTITY_MIN);
    document.getElementById("quantity").setAttribute("max", PRODUCT_QUANTITY_MAX);
    document.getElementById("quantity").setAttribute("value", PRODUCT_QUANTITY_MIN);
}
//#####Création d un event listener pour l'ajout au panier#####
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
//######Verification Erreur couleur valide#######
function verificationIsValidColor(){
    return ( 
        document.getElementById("colors").value != ""
    );
}
//######Verification Erreur quantité valide#####
function verificationIsValidQuantity(){
  return (
    document.getElementById("quantity").value >= PRODUCT_QUANTITY_MIN &&
    document.getElementById("quantity").value <= PRODUCT_QUANTITY_MAX
  );
}
//######Affichage DOM Erreur couleur valide######
function displayErrorMsgColor(){
    let msgError = ALERT_CHOOSE_COLOR;
    messageError(`${msgError}`);
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, TIME_DURATION_FOR_MESSAGE);
}
//######Affichage DOM Erreur quantité valide#####
function displayErrorMsgQuantity(){
    let msgError = `${ALERT_QUANTITY} ${document.getElementById("quantity").value} ${ALERT_IMPOSSIBLE}<br>${ALERT_BETWEEN_MIN_MAX}.<br>`;
    let detailMsgError = "";
    if (document.getElementById("quantity").value < PRODUCT_QUANTITY_MIN){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MIN;
        document.getElementById("quantity").value = PRODUCT_QUANTITY_MIN; 
    } else if (document.getElementById("quantity").value > PRODUCT_QUANTITY_MAX){ 
        detailMsgError = ALERT_QUANTITY_INSERT_MAX;
        document.getElementById("quantity").value = PRODUCT_QUANTITY_MAX;
    }
    messageError(`${msgError} ${detailMsgError}`)
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, TIME_DURATION_FOR_MESSAGE);
}
//######Traitement des messages de succès#######
//#####Message de succés pour l'ajout d'un produit au panier#####
function displaySuccessMsgAddProduct(){
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = `<p>${SUCCESS_ADD_TO_CART}</p>`;
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, TIME_DURATION_FOR_MESSAGE);
}
//#####Message de succés pour la mise à jour d'un produit au panier#####
function displaySuccessMsgUpdateProduct(){
    document.getElementById("messages").style.color = "white";
    document.getElementById("messages").style.borderRadius = "50px";
    document.getElementById("messages").style.backgroundColor = "green";
    document.getElementById("messages").style.textAlign = "center";
    document.getElementById("messages").innerHTML = `<p>${SUCCESS_MODIFICATION_IN_CART}</p>`;
    setTimeout(() => {
      document.getElementById("messages").innerHTML = "";
    }, TIME_DURATION_FOR_MESSAGE);
}
//######Mise en forme DOM pour les message d'erreurs########
function messageError(message){
    document.getElementById("messages").style.color="red";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="white";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML=`<p>${message}</p>`;
}  
//#####Affichage des erreurs sur la page#####
function errorMsg(message){
    document.querySelector(".item").innerHTML=`<center>${message}</center>`;
}
//#####Affichage des erreurs dans la console#####
function errorMsgConsole(message){
    console.error(message);
}

//######Ajout au panier#########
function addToCart(){
    if (!verificationIsValidQuantity()) {
      displayErrorMsgQuantity();
      return;
    }
    if (!verificationIsValidColor()) {
      displayErrorMsgColor();
      return;
    }
  let selectedQuantity = document.getElementById("quantity").value;
  let selectedColor = document.getElementById("colors").value;
  let addedProduct = new NewLsProduct(
    urlProductId,
    selectedQuantity,
    selectedColor
  );
  getLocalStorage();
  let productInCart = productIsInCart(addedProduct.id, addedProduct.color); 
  let productIdInCart = productIdIsInCart(addedProduct.id, addedProduct.color);
  if (productInCart == null) {
    if (productIdInCart == null) {   
        cartProducts.push(addedProduct);
    } else {
    for (i=0;i<cartProducts.length;i++){
        if(cartProducts[i].id === addedProduct.id){
            cartProducts.splice(i,0, addedProduct);
            break;
        }
    }
    }
    displaySuccessMsgAddProduct();
  } else {
    productInCart.quantity = Number(addedProduct.quantity);
    displaySuccessMsgUpdateProduct();
  }
  updateLocalStorage();
}
//#####Récupération du localstorage en JSON#####
function getLocalStorage(){
    if (localStorage.length != 0) return cartProducts = JSON.parse(localStorage.getItem("Panier"));
    else return null;
}
//#####Mise à jour du Locastorage#####
function updateLocalStorage(){
    for (i = 0; i < cartProducts.length; i++) {
      localStorage.setItem("Panier", JSON.stringify(cartProducts));
    }
}

//#####Vérification de la présence du produit dans le panier avec une couleur différente######
function productIdIsInCart(productId, productColor){  
    let products = cartProducts
    .filter(function (cartProduct) {
      return (
        cartProduct.id === productId && cartProduct.color != productColor
      );
    });
    if(products.length > 0 ) return products[0];
    else return null;
}
//#####Vérification de la présence du produit dans le panier avec la meme couleur######
function productIsInCart(productId, productColor){  
    let products = cartProducts
    .filter(function (cartProduct) {
      return (
        cartProduct.id === productId && cartProduct.color === productColor
      );
    });
    if(products.length > 0 ) return products[0];
    else return null;
}
//#####Récupération de la position d'index du produit déja existant#####
function productAlreadyExist(){
    for(i=0;i<cartProducts.length;i++){
        if(cartProducts[i].id===produit.id){
            positionProduit = i;
            return true;
            } else {
            return false;
        }
    }
}

//--------------Chargement de la page------------------
displayProduct();
