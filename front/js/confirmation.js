//importation de l'application Shop
import {Application} from './application.js';
//----------------------
//Class d'initialisation
//----------------------
class Init{
    constructor(){
        this.shop = null;
    }
    launch(){
        this.shop = new Application({view:"confirmation"}).get_all_products();
    }
}
//Lancement de l'application
new Init().launch();