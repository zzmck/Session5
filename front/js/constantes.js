const WINDOW_URL = new URL(window.location.href);

const API_PROTOCOL = "http";
const API_URL = "127.0.0.1";
const API_PORT = "3000";

const APP_MINIMUMQUANTITY=1;
const APP_MAXIMUMQUANTITY=100;
const APP_BACKEND_URL_GET_PRODUCT="api/products";
const APP_BACKEND_URL_SEND_ORDER="api/products/order";
const APP_FRONTEND_URL_ORDER="front/html/confirmation.html?orderId";

const DOM_NUMBERACCEPTQUANTITY=`Nombre d'article(s) (${APP_MINIMUMQUANTITY}-${APP_MAXIMUMQUANTITY}) : `

const MESSAGE_SUCCESS_ADDTOCART = "Produit ajouté au panier.";
const MESSAGE_SUCCESS_DELETEFORMCART = "Le produit à été supprimé.";
const MESSAGE_SUCCESS_NEWQUANTITY = "La nouvelle quantitée du produit à été modifiée à ";
const MESSAGE_SUCCESS_CANORDER = "Vous pouvez commander";

const MESSAGE_ERROR_SELECTCOLOR = "Merci de choisir une couleur.";
const MESSAGE_ERROR_CONFIRMATION= "Un problème est survenu";
const MESSAGE_ERROR_API = "Une erreur est survenue ";
const MESSAGE_ERROR_PRODUCTNOTFOUND ="Produit introuvable";

const MESSAGE_ALERT_MINIMUMQUANTITY = `La quantité minimum est de ${APP_MINIMUMQUANTITY} article.`;
const MESSAGE_ALERT_MAXIMUMQUANTITY = `La quantité maximum est de ${APP_MAXIMUMQUANTITY} articles.`;
const MESSAGE_ALERT_CARTEMPTY = "Votre panier est vide";

const MESSAGE_FORM_NONUMBER = "Aucun nombre n'est accepté.";
const MESSAGE_FORM_CARACTERE = "Aucun caractère spécial n'est accepté";
const MESSAGE_FORM_EMAIL = "L'email doit être sous la forme : mail@provider.ext, sans espace.";
const MESSAGE_FORM_EMPTY = "Le champ ne doit pas être vide.";
const MESSAGE_FORM_GOODINPUT = "Complet";