
//Récupération de l'url
const url = new URL(window.location.href);
const urlId = url.searchParams.get('orderId');
let orderId = (document.querySelector("#orderId").textContent = urlId);

//effacement du LocalStorage
localStorage.clear("Panier");