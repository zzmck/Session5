//importation de l'application Shop
import {Application} from './application.js';

//Récupération de l'ID du produit demandé
const urlProductId = new URL(window.location.href).searchParams.get('id');
//----------------------
//Class d'initialisation
//----------------------
class Init{
    constructor(){
        this.shop = null;
    }
    launch(){
        this.shop = new Application({id:`${urlProductId}`,view:"oneId"}).get_one_product();
    }
}
//Lancement de l'application
new Init().launch();