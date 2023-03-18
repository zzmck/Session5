//importation de l'application Shop
import {Application} from './application.js';
//----------------------
//Class d'initialisation
//----------------------
class init{
    constructor(){
        this.shop = null;
    }
    init(){
        this.shop = new Application({view:"cart"});
        this.shop.get_all_products();
    }
}
//Lancement de l'application
var app = new init();
app.init();