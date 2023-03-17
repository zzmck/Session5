//importation de l'application Shop
import {Application} from './shopModule/application.js';

//Récupération de l'ID du produit demandé
const url = new URL(window.location.href);
const urlProductId = url.searchParams.get('id');
//----------------------
//Class d'initialisation
//----------------------
class init{
    constructor(){
        this.shop = null;
    }
    init(){
        this.shop = new Application({id:`${urlProductId}`,view:"oneId"});
        this.shop.get();
    }
}
//Lancement de l'application
var app = new init();
app.init();