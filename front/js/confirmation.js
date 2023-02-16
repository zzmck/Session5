
//Récupération de l'url
const url = new URL(window.location.href);
const urlId = url.searchParams.get('orderId');

//######Retour au panier######
function goToCart(){
    document.location.href = LOCATION_CART;
}
function messageError(message){
    document.querySelector(".confirmation").innerHTML = `<p>${message}</p>`;
}
function displayConfirmation(){
if(urlId === null){
    document.querySelector(".confirmation").textContent = "";
    messageError(ALERT_CONFIRMATION_CART);
    setTimeout(() => {              
        document.querySelector(".confirmation").textContent = "";
        goToCart();
    }, TIME_DURATION_FOR_MESSAGE);

} else {
    let orderId = (document.querySelector("#orderId").textContent = urlId);
    localStorage.clear("Panier");
}
}
//---------------Affichage de la page----------------
displayConfirmation();