const urlProductId =WINDOW_URL.searchParams.get('id');
//---------------------------------------------------
//Class Application Client <=> Backend, Client <=> Ls
//---------------------------------------------------
export class Application{
    constructor(options){
        var defaultOptions = {
            tableProducts:[],
            id:"",
            view:""
        }
        var options = Object.assign(defaultOptions,options);

        this.tableProducts  =   options.tableProducts;
        this.id     =     options.id;
        this.view   =     options.view;
    }
    //Connexion API Backend
    async connectAPI(){
        const products = await fetch(`${API_PROTOCOL}://${API_URL}:${API_PORT}/api/products`);
        if (products.ok) {
            return products.json();
        }
    }
    //Resultat BackEND => selon la page demandée lancement de l'application
    get(){
        var Api = this;
            this.connectAPI()
            .then(function(result){
                Api.tableProducts=result;
                if(Api.view === "all"){
                    Api.showAllProducts(Api.tableProducts);
                } else if(Api.view === "oneId"){
                    var resultOne = result.find(item=>(item._id===Api.id))
                    Api.showOneProduct(resultOne);
                } else if(Api.view === "cart"){
                    Api.showCart();
                } else if(Api.view === "confirmation"){
                    Api.orderConfirmation();
                }
            })
            .catch(function(error) {
                console.log("Marche pas ton api mec; " + error);
            
            })
        
    }
    //Application Tous les produits
    showAllProducts(input){
        input.forEach(element => {
            document.querySelector("#items").innerHTML += new Template(element).allProducts();
        });
    }
    //Application pour un produit
    showOneProduct(input){
        new Template(input).oneProduct();
    }
    //Application Panier
    showCart(){
        let tableProduct = this.tableProducts;
        let lsProducts = new Cart();
        let i=0;
        if(JSON.parse(localStorage.getItem("panier")).length===0){
            document.querySelector(".cart").innerHTML = `<div id='empty'>${MESSAGE_ALERT_CARTEMPTY}</div>`;
            document.querySelector("#empty").setAttribute("align","center");
        } else {
            document.querySelector("main").innerHTML += new Template().domMessages();
            lsProducts.cartLs.forEach(function(element, index){
                let sameProduct = tableProduct.find(p=>(p._id===element.id));
                new Template().cartProducts(element,sameProduct,index);
            });
            for(let i=0;i<lsProducts.cartLs.length;i++){
                document.querySelectorAll("p.deleteItem")[i].addEventListener("click",new Cart().remove);
                document.querySelectorAll("input.itemQuantity")[i].addEventListener('change',new Controls().quantityCart);
            }
            
            document.getElementById("order").style.display='none';
            new Cart().totalNumberProduct();
            new Cart().totalCartPrice();
        }
    }
    //Aplication Ajout au panier
    addTocart(){
        if(!new Controls().color("colors")){
            new Template().showMessages("error",MESSAGE_ERROR_SELECTCOLOR);
            return false;
        }
        let selectedQuantity = document.getElementById("quantity").value;
        let selectedColor = document.getElementById("colors").value;
         
        new Cart().add({id:urlProductId, color:selectedColor, quantity:selectedQuantity});
        new Template().showMessages("success",MESSAGE_SUCCESS_ADDTOCART);
    }
    //application Envoi du formulaire de commande
    sendForm(){
        let productsIdOrder=[];
        let productsLs=JSON.parse(localStorage.getItem("panier"));     
        for(let x=0;x<productsLs.length;x++){
            productsIdOrder.push(productsLs[x].id);
            }   
        let contactforBack = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        }
        let backOrder = {
            contact:contactforBack,
            products:productsIdOrder
        }
        fetch(`${API_PROTOCOL}://${API_URL}:${API_PORT}/api/products/order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(backOrder),
          })
            .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                })
            .then(function (data) {
                location.href = `/front/html/confirmation.html?orderId=${data.orderId}`;
              })
            .catch(function (err) {
              console.log(err);
            });
   
    }
    //Application confirmation de commande
    orderConfirmation(){
            const urlId = url.searchParams.get('orderId');
            if(urlId === null){
                document.querySelector(".confirmation").textContent = "";
                messageError(MESSAGE_ERROR_CONFIRMATION);
                setTimeout(() => {              
                    document.querySelector(".confirmation").textContent = "";
                }, 2000);

            } else {
                document.querySelector("#orderId").textContent = urlId;
                localStorage.clear("Panier");
            }
           
        function messageError(message){
            document.querySelector(".confirmation").innerHTML = `<p>${message}</p>`;
        }
    }
    
}
//------------------------------
//Class fonctionnement du panier
//------------------------------
export class Cart{
    constructor(){
        let cartLs = localStorage.getItem('panier');
        if(cartLs === null){
            this.cartLs = [];
        } else {
            this.cartLs = JSON.parse(cartLs);
        }
        this.save();
    }
    //Sauvegarde du panier dans le Localstorage
    save(){
        localStorage.setItem('panier',JSON.stringify(this.cartLs));
    }
    //Ajout de produit au localStorage
    add(product){
        let foundProduct = this.cartLs.find(p=> (p.id === product.id && p.color === product.color));
        if(foundProduct!=undefined){
            foundProduct.quantity=product.quantity;
        } else {
            if(this.cartLs.length===0){
                this.cartLs.push(product);
            } else if (foundProduct = this.cartLs.find(p=> (p.id === product.id))) {
                let newCart = this.cartLs;
                for(let i=0;i<newCart.length;++i){
                    if(newCart[i].id===product.id){
                        newCart.splice(i,0,product);
                        break;
                    }
                }
                localStorage.removeItem('panier');
                localStorage.setItem('panier',JSON.stringify(newCart));
            } else {
                this.cartLs.push(product);
            }
            
        }
        this.save();
    }
    //Supprimer un produit du localStorage
    remove(){
        let articleRemoved = this.parentNode.parentNode.parentNode.parentNode;
        let idProduct = articleRemoved.dataset['id'];
        let colorProduct = articleRemoved.dataset['color'];
        let oldCart = JSON.parse(localStorage.getItem('panier'));
        let newCart = [];
        for(let i=0;i<oldCart.length;i++){
            if(oldCart[i].id === idProduct && oldCart[i].color === colorProduct){} else{
                newCart.push({id:oldCart[i].id,color:oldCart[i].color,quantity:oldCart[i].quantity});
            }
        } 
        localStorage.removeItem('panier');
        localStorage.setItem('panier',JSON.stringify(newCart));
        new Template().showMessages("success",MESSAGE_SUCCESS_DELETEFORMCART);
        document.querySelector("#cart__items").innerHTML="";
        new Application({view:"cart"}).get();

    }
    //Changer la quantité d'un produit dans le LocalStorage
    changeQuantity(quantity,index){
        this.cartLs[index]['quantity']=quantity;
        this.save();
        this.totalNumberProduct();
        this.totalCartPrice();
    }
    //Calcul du nombre total d'articles dans le panier
    totalNumberProduct(){
        let number=Number(0);
        for(let product of this.cartLs){
            number+=Number(product.quantity);
        }
        
        document.querySelector("#totalQuantity").textContent=number;
        return;
    }
    //calcul du prix total du panier
    totalCartPrice(){
        let price = this;
        let total = 0;
        new Application().connectAPI().then(function(result){
            for(let product of price.cartLs){
                let priceOfProduct = result.find(d=>d._id===product.id);
                total+=product.quantity * priceOfProduct.price
            }
            document.querySelector("#totalPrice").textContent= total;
            return;
        })
        
    }
}
//------------------------------
//Class utile aux affichages DOM
//------------------------------
export class Template{
    constructor(options){
        var defaultOptions = {
            _id         :   "id error",
            colors      :   [],
            imageUrl    :   "url error",
            altTxt      :   "alt error",
            name        :   "name error",
            price       :   "price error",
            description :   "description error",
            quantity : "quantity error"
        }
        var options = Object.assign(defaultOptions,options);

        this.colors =   options.colors;
        this._id     =   options._id;
        this.imageUrl =   options.imageUrl;
        this.altTxt =   options.altTxt;
        this.name   =   options.name;
        this.price  =   options.price;
        this.description    =   options.description;
        this.quantity   =   options.quantity;

    }
    //Affichage de tous les produits
    allProducts(){
        return `
        <a href="./product.html?id=${this._id}">
          <article>
            <img src="${this.imageUrl}" alt="${this.altTxt}">
            <h3 class="productName">${this.name}</h3>
            <p class="productDescription">${this.description}</p>
          </article>
        </a>`;
    }
    //Afficheg d'un produit
    oneProduct(){
            this.colors.forEach(p => {
                document.getElementById("colors").innerHTML += `<option value='${p}'>${p}</option>`;
            });
        document.querySelector(".item__img").innerHTML = `<img src="${this.imageUrl}" alt="${this.altTxt}">`;
        document.querySelector("title").textContent = this.name;
        document.querySelector("#title").textContent = this.name;
        document.querySelector("#price").textContent = this.price;
        document.querySelector("#description").textContent = this.description;
        document.querySelector("article").innerHTML+=this.domMessages();
        document.querySelector("#quantity").setAttribute("min",APP_MINIMUMQUANTITY);
        document.querySelector("#quantity").setAttribute("max",APP_MAXIMUMQUANTITY);
        document.querySelector("#quantity").setAttribute("value",APP_MINIMUMQUANTITY);
        document.querySelector(".item__content__settings__quantity").firstElementChild.textContent=DOM_NUMBERACCEPTQUANTITY;
        document.querySelector("#quantity").addEventListener('change',new Controls().quantityOneProduct);
        document.querySelector("#addToCart").addEventListener("click",new Application().addTocart);
    }
    //Affichage du panier
    cartProducts(ls,api,index){
        document.querySelector("#cart__items").innerHTML+=`
        <article class="cart__item" data-id="${ls.id}" data-color="${ls.color}">
                <div class="cart__item__img">
                  <img src="${api.imageUrl}" alt="${api.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${api.name}</h2>
                    <p>${ls.color}</p>
                    <p>${api.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Quantité : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity_${index}"  min="${APP_MINIMUMQUANTITY}" max="${APP_MAXIMUMQUANTITY}" value="${ls.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </articles>
        `;
        document.getElementById("firstName").addEventListener("change",new Controls().controlsForm);
        document.getElementById("lastName").addEventListener("change",new Controls().controlsForm);
        document.getElementById("address").addEventListener("change",new Controls().controlsForm);
        document.getElementById("city").addEventListener("change",new Controls().controlsForm);
        document.getElementById("email").addEventListener("change",new Controls().controlsForm);
        document.getElementById("order").addEventListener("click",new Application().sendForm);
        
    }
    //Affichage des messages d'erreurs / d'alerte et succès
    domMessages(){
        return `
        <div id='containerMessagesSuccess' class='divHidden'>
            <span id='messageSuccess' class='message'></span>
        </div>
        <div id='containerMessagesAlert' class='divHidden'>
            <span id='messageAlert' class='message'></span>
        </div>
        <div id='containerMessagesError' class='divHidden'>
            <span id='messageError' class='message'></span>
        </div>`;
    }
    //Affichage des messages d'erreurs / Alert / Success
    showMessages(type,message){
        //Class de gestion des messages 
        class messageTypes{
            constructor(options){
                this.type = options.type;
                this.message = options.message;
                let container;
                let containerMessage;
                let classMessage;
                switch(this.type){
                    case "success":
                        container = "#containerMessagesSuccess";
                        containerMessage = "#messageSuccess";
                        classMessage = "divMessage success";
                        setTimeout(this.hideMessagesSuccess,2000);
                    break;
                    case "alert":
                        container = "#containerMessagesAlert";
                        containerMessage = "#messageAlert";
                        classMessage = "divMessageAlerts alert";
                        setTimeout(this.hideMessagesAlert,2000);
                    break;
                    case "error":
                        container = "#containerMessagesError";
                        containerMessage = "#messageError";
                        classMessage = "divMessageAlerts error";
                        setTimeout(this.hideMessagesError,2000);
                    break;
                    default:
                    break;
                }
                document.querySelector(`${container}`).setAttribute("class",`${classMessage}`);
                document.querySelector(`${containerMessage}`).textContent=this.message;

            }
            //Masquer les messages success
            hideMessagesSuccess(){
                document.querySelector("#containerMessagesSuccess").setAttribute("class","divHidden");
                document.querySelector("#messageSuccess").textContent="";
            }
            //Masquer les messages error
            hideMessagesError(){
                document.querySelector("#containerMessagesError").setAttribute("class","divHidden");
                document.querySelector("#messageError").textContent="";
            }
            //Masquer les messages alert
            hideMessagesAlert(){
                document.querySelector("#containerMessagesAlert").setAttribute("class","divHidden");
                document.querySelector("#messageAlert").textContent="";
            }
        }
        //Lancement de l'affichage
         new messageTypes({type:type,message:message});
    
    }
}
//------------------------------
//Class de controle des elements
//------------------------------
export class Controls{
    //Controle de la quantité des produits du panier
    quantityCart(indexItem){
        let resultIndex=indexItem.target.attributes.name.nodeValue;
        let index = resultIndex.replace("itemQuantity_","");
        let quantityDom = document.querySelectorAll("input.itemQuantity")[`${index}`].value;
    if(quantityDom < APP_MINIMUMQUANTITY){ 
        document.querySelectorAll("input.itemQuantity")[`${index}`].value=APP_MINIMUMQUANTITY; 
        new Template().showMessages("alert",MESSAGE_ALERT_MINIMUMQUANTITY);
        quantityDom=APP_MINIMUMQUANTITY;
    }
    if(quantityDom > APP_MAXIMUMQUANTITY){ 
        document.querySelectorAll("input.itemQuantity")[`${index}`].value=APP_MAXIMUMQUANTITY;
        new Template().showMessages("alert",MESSAGE_ALERT_MAXIMUMQUANTITY);
        quantityDom=APP_MAXIMUMQUANTITY;
    }
    new Cart().changeQuantity(quantityDom,index);
    new Template().showMessages("success",MESSAGE_SUCCESS_NEWQUANTITY+ " "+quantityDom+".");
    }
    //Controle de la quantité du produit seul
    quantityOneProduct(indexItem){
            let index = indexItem.target.id;
        let quantityDom = document.getElementById(`${index}`).value;
        if(quantityDom < APP_MINIMUMQUANTITY){ 
            document.getElementById(`${index}`).value=APP_MINIMUMQUANTITY; 
            new Template().showMessages("alert",MESSAGE_ALERT_MINIMUMQUANTITY);
        }
        if(quantityDom > APP_MAXIMUMQUANTITY){ 
            document.getElementById(`${index}`).value=APP_MAXIMUMQUANTITY;
            new Template().showMessages("alert",MESSAGE_ALERT_MAXIMUMQUANTITY);
        }
    }
    //Controle de la séléction d'une couleur
    color(element){
        return ( 
            document.getElementById(element).value != ""
        );
        
    }
    //controle de la présence d'un produit dans le panier
    productIsInCart(productId){
        let products = new Cart.filter(function (element) {
          return (
            element.id === productId
          );
        });
        if(products.length > 0 ) return products[0];
        else return null;
    }
    //controle des champs du formulaire de commande
    controlsForm(){
        //---------------------------------------------------
        //Création d'une class de controle pour le formulaire
        //---------------------------------------------------
        class controlInputs {
            constructor() {
                let firstname;
                let lastname;
                let address;
                let city;
                let email;

                let valueFirstName = document.getElementById("firstName").value;
                let valueLastName = document.getElementById("lastName").value;
                let valueAddress = document.getElementById("address").value;
                let valueCity = document.getElementById("city").value;
                let valueEmail = document.getElementById("email").value
                
                if (form("firstName", valueFirstName)) {firstname = true;} else {firstname = false;}
                if (form("lastName", valueLastName)) {lastname = true;} else {lastname = false;}
                if (form("address", valueAddress)) {address = true;} else {address = false;}
                if (form("city", valueCity)) {city = true;} else {city = false;}
                if (form("email",valueEmail)) {email = true;} else {email = false;}

                if(firstname&&lastname&address&city&email){
                    new Template().showMessages("success",MESSAGE_SUCCESS_CANORDER);
                    document.getElementById("order").style.display="block";
                }
                else{
                    document.getElementById("order").style.display="none";
                }
            }
        }
        //Mise en forme des messages sous les champs
        function errorFormMsg(inputName,errorColor,message){
            document.getElementById(inputName + "ErrorMsg").textContent = message;    
            document.getElementById(inputName).style.border=`3px solid ${errorColor}`;
            document.getElementById(inputName + "ErrorMsg").style.color = errorColor;
        }
        //Controle des formats d'entrée dans les champs formulaire
        function form(inputName, inputValue){
            if(inputValue.length===0){ 
                errorFormMsg(inputName,"","");
                return false; }        
            else if (inputName != "address" && inputName!="email" && inputValue.match(/[0-9]/i)){
                errorFormMsg(inputName,"orange",MESSAGE_FORM_NONUMBER);
                return false;
            } else if (inputName != "address" && inputName != "email" && inputValue.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)){
                errorFormMsg(inputName,"orange",MESSAGE_FORM_CARACTERE);
                return false;
            }
            else if(inputName === "email" && (!inputValue.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || inputValue.match(" "))){
                errorFormMsg(inputName,"orange",MESSAGE_FORM_EMAIL);
            } else {
                errorFormMsg(inputName,"green",MESSAGE_FORM_GOODINPUT);
                return true;
            }
        }
        new controlInputs();
    }
    
}