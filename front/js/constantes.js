const URL_API = "http://127.0.0.1";
const PORT_API = "3000";

const URL_ALL_PRODUCT = "api/products";
const URL_ONE_PRODUCT = "api/product";
const URL_ORDER_PRODUCT = "api/products/order";

const LOCATION_ORDER_CONFIRMATION = "/front/html/confirmation.html?orderId=";
const LOCATION_CART = "/front/html/cart.html";
const LOCATION_INDEX = "/front/html/index.html";

const LINK_PRODUCT = "./product.html?id=";

const PRODUCT_QUANTITY_MIN = 1;
const PRODUCT_QUANTITY_MAX = 100;
const TIME_DURATION_FOR_MESSAGE = 2000;

const ALERT_PRODUCTS_LOAD = 'Une erreur est survenue au chargement des produits:';
const ALERT_PRODUCT_LOAD = 'Une erreur est survenue au chargement du produit:';
const ALERT_CART_LOAD = 'Une erreur est survenue au chargement du panier:';
const ALERT_COME_BACK_LATER = "Merci de revenir.";
const ALERT_CHOOSE_COLOR = "Merci de choisir une couleur.";
const ALERT_QUANTITY = "Erreur de quantité";
const ALERT_IMPOSSIBLE = "impossible";
const ALERT_BETWEEN_MIN_MAX = `il doit etre compris entre ${PRODUCT_QUANTITY_MIN} et ${PRODUCT_QUANTITY_MAX}.`;
const ALERT_QUANTITY_INSERT_MIN = `Insertion minimum : ${PRODUCT_QUANTITY_MIN}`;
const ALERT_QUANTITY_INSERT_MAX = `Insertion maximum : ${PRODUCT_QUANTITY_MAX}`;
const ALERT_ADD_TO_CART = "Produit ajouté au panier";
const ALERT_MODIFICATION_IN_CART = "Quantité modifiée dans votre panier";
const ALERT_COLOR_FATAL = "red";
const ALERT_COLOR_MEDIUM = "orange";
const ALERT_COLOR_GOOD = "green";
const ALERT_FORM_NOT_EMPTY = "Le champ ne doit pas etre vide";
const ALERT_FORM_NO_NUMBER = "Le champ ne doit pas contenir de nombre [0-9]";
const ALERT_FORM_NO_SPECIAL_CARACTERS = "Le champ ne doit pas contenir de caractères spéciaux";
const ALERT_FORM_EMAIL = "L'email doit etre sous la forme : 'mail@mail.fr' et ne doit pas contenir d'espace";
const ALERT_FORM_SUCCESS = "Valide";
const ALERT_CONFIRMATION_CART = "Une erreur est survenue,<br>Retour au panier.";
const ALERT_CART_IS_EMPTY = "<h1>Votre Panier</h1><h2><center>Votre Panier est vide</center></h2>";