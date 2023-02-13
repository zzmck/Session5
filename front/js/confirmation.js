
//Récupération de l'url
const url = new URL(window.location.href);
const urlId = url.searchParams.get('orderId');

//######Retour au panier######
function goToCart(){
    document.location.href = "/front/html/cart.html";
}
function messageError(message){
    document.querySelector(".confirmation").innerHTML = `<p>${message}</p>`;
}
function displayConfirmation(){
if(urlId === null){
    document.querySelector(".confirmation").textContent = "";
    let msgError = "Une erreur est survenue,<br>Retour au panier.";
    messageError(`${msgError}`);
    //Disparition au bout de 2 secondes
    setTimeout(() => {              
        document.querySelector(".confirmation").textContent = "";
        goToCart();
    }, 2000);

} else {
    let orderId = (document.querySelector("#orderId").textContent = urlId);
    //effacement du LocalStorage
    localStorage.clear("Panier");
}
}
//---------------Affichage de la page----------------
displayConfirmation();