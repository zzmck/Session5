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
    //Connexion API Backend All products
    async connectAPIAllProducts(){
        const products = await fetch(`${API_PROTOCOL}://${API_URL}:${API_PORT}/${APP_BACKEND_URL_GET_PRODUCT}`);
        if (products.ok) {
            return products.json();
        }
    }
    //Connexion API Backend One product
    async connectAPIOneProduct(){
        const products = await fetch(`${API_PROTOCOL}://${API_URL}:${API_PORT}/${APP_BACKEND_URL_GET_PRODUCT}/${this.id}`);
        if (products.ok) {
             return products.json();
        }
    }
    //Resultat AllProduct BackEND => selon la page demandée lancement de l'application
    get_all_products(){
        var Api = this;
            this.connectAPIAllProducts()
            .then(function(result){
                Api.tableProducts=result;
                if(Api.view === "all"){
                    Api.showAllProducts(Api.tableProducts);
                } else if(Api.view === "cart"){
                    Api.showCart();
                } else if(Api.view === "confirmation"){
                    Api.orderConfirmation();
                }
            })
            .catch(function(error) {
                new Template().messageErrorAPI(error);
            })
        
    }
    //Resultat OneProducts BackEND
    get_one_product(){
     var Api = this;
        this.connectAPIOneProduct()
        .then(function(result){
            if(!result){
                new Template().messageErrorAPI(MESSAGE_ERROR_PRODUCTNOTFOUND);
            }else if(Api.view === "oneId"){
                Api.showOneProduct(result);
            }
        })
        .catch(function(error) {
            new Template().messageErrorAPI(error);
        })
    }
    //Application tous les produits
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
    showCart() {    
    const cart = new Cart();
    const template = new Template();
    const controls = new Controls();
    const tableProducts = this.tableProducts;
  
    if (cart.cartLs.length === 0) {
      document.querySelector(".cart").innerHTML = `<div id='empty'>${MESSAGE_ALERT_CARTEMPTY}</div>`;
      document.querySelector("#empty").setAttribute("align", "center");
      return;
    }
  
    document.querySelector("main").innerHTML += template.domMessages();
  
    cart.cartLs.forEach(function (element, index) {
      const sameProduct = tableProducts.find((p) => p._id === element.id);
      template.cartProducts(element, sameProduct, index);
    });
  
    const deleteItems = document.querySelectorAll("p.deleteItem");
    deleteItems.forEach((item) => item.addEventListener("click", cart.remove));
  
    const quantityInputs = document.querySelectorAll("input.itemQuantity");
    quantityInputs.forEach((input) => input.addEventListener('change', controls.quantityCart));
  
  
    cart.totalNumberProduct();
    cart.totalCartPrice();

    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let email = document.getElementById("email");
    let address = document.getElementById("address");
    let city = document.getElementById("city");

        firstName.addEventListener("blur", () => {
            new Controls().validateInput(firstName);
        });
        lastName.addEventListener("blur", () => {
            new Controls().validateInput(lastName);
        });
        email.addEventListener("blur", () => {
            new Controls().validateInput(email);
        });
        address.addEventListener("blur", () => {
            new Controls().validateInput(address);
        });
        city.addEventListener("blur", () => {
            new Controls().validateInput(city);
        });
        document.getElementById("order").addEventListener("click", (e)=>{new Controls().validateForm(e)});

    }
    //Application Ajout au panier
    addTocart() {
        const selectedColor = document.getElementById("colors").value;
        const selectedQuantity = document.getElementById("quantity").value;
        const urlProductId = WINDOW_URL.searchParams.get('id');
      
        if (!new Controls().color("colors")) {
          new Template().showMessages("error", MESSAGE_ERROR_SELECTCOLOR);
          return;
        }
      
        new Cart().add({ id: urlProductId, color: selectedColor, quantity: selectedQuantity });
        new Template().showMessages("success", MESSAGE_SUCCESS_ADDTOCART);
    }
    //Application Envoi du formulaire de commande
    sendForm() {
        let productsIdOrder = [];
        let productsLs = JSON.parse(localStorage.getItem("panier"));
        for (let x = 0; x < productsLs.length; x++) {
          productsIdOrder.push(productsLs[x].id);
        }
        let contactForBack = {
          firstName: document.getElementById("firstName").value.trim(),
          lastName: document.getElementById("lastName").value.trim(),
          address: document.getElementById("address").value.trim(),
          city: document.getElementById("city").value.trim(),
          email: document.getElementById("email").value.trim()
        };
        let backOrder = {
          contact: contactForBack,
          products: productsIdOrder
        };
        fetch(`${API_PROTOCOL}://${API_URL}:${API_PORT}/${APP_BACKEND_URL_SEND_ORDER}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(backOrder)
        })
          .then(function (response) {
            if (response.ok) {
              return response.json();
            }
          })
          .then(function (data) {
            location.href = `/${APP_FRONTEND_URL_ORDER}=${data.orderId}`;
          })
          .catch(function (error) {
            new Template().showMessages("error", MESSAGE_ERROR_API + " : " + error);
          });
    }
    //Application confirmation de commande
    orderConfirmation(){
        const urlId = WINDOW_URL.searchParams.get('orderId');
        if(urlId === null){
            new Template().showMessages("error",MESSAGE_ERROR_CONFIRMATION);
        } else {
            document.querySelector("#orderId").textContent = urlId;
            localStorage.removeItem("panier");
        }
    }

}
//------------------------------
//Class fonctionnement du panier
//------------------------------
class Cart{
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
        let foundProduct = this.cartLs.find(p => p.id === product.id && p.color === product.color);
        if(foundProduct !== undefined){
            foundProduct.quantity = product.quantity;
        } else {
            let sameProduct = this.cartLs.find(p => p.id === product.id);
            if (sameProduct !== undefined) {
                let index = this.cartLs.indexOf(sameProduct);
                this.cartLs.splice(index+1, 0, product);
            } else {
                this.cartLs.push(product);
            }
        }
        this.save();
    }
    //Suppression d'un produit DOM et localstorage
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
        new Application({view:"cart"}).get_all_products();

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
        new Application().connectAPIAllProducts().then(function(result){
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
class Template{
    constructor(product){
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
        var product = Object.assign(defaultOptions,product);

        this.colors =   product.colors;
        this._id     =   product._id;
        this.imageUrl =   product.imageUrl;
        this.altTxt =   product.altTxt;
        this.name   =   product.name;
        this.price  =   product.price;
        this.description    =   product.description;
        this.quantity   =   product.quantity;

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
    //Affiche d'un produit
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
    }
    //Creation DOM des messages d'erreurs / d'alerte et succès
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
    //Affichage du message d'erreur liè à l'API
    messageErrorAPI(message){
        document.querySelector("main").innerHTML=`
        <div class="limitedWidthBlock">
        <div class="titles">
          <h1>${MESSAGE_ERROR_API}</h1>
          <h2>${message}</h2>
        </div>
        </div>
        `;
    }
}
//------------------------------
//Class de controle des elements
//------------------------------
class Controls{
    constructor() {
        this.form=document.querySelector("form");
    }
    //Controle de la quantité des produits du panier ( avec gestion DOM pour plusieurs produits )
    quantityCart(indexItem){
        let resultIndex=indexItem.target.attributes.name.nodeValue;
        let index = resultIndex.replace("itemQuantity_","");
        let quantityDom = parseInt(document.querySelectorAll("input.itemQuantity")[index].value);
        
        if(quantityDom < APP_MINIMUMQUANTITY){ 
            document.querySelectorAll("input.itemQuantity")[index].value=APP_MINIMUMQUANTITY; 
            new Template().showMessages("alert",MESSAGE_ALERT_MINIMUMQUANTITY);
            quantityDom=APP_MINIMUMQUANTITY;
        }
        if(quantityDom > APP_MAXIMUMQUANTITY){ 
            document.querySelectorAll("input.itemQuantity")[index].value=APP_MAXIMUMQUANTITY;
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
        let products = new Cart().cartLs.filter(function (element) {
          return (
            element.id === productId
          );
        });
        if(products.length > 0 ) {
          return products[0];
        } else {
          return null;
        }
    }
    //Formulaire : controle individuel des champs
    validateInput(input) {
            const inputValue = input.value.trim();
            const inputName = input.getAttribute("name");
    
            if (inputValue.length === 0) {
                this.errorFormMsg(inputName, "red", MESSAGE_FORM_EMPTY);
                return false;
            } else if (inputName !== "address" && inputName !== "email" && inputValue.match(/[0-9]/i)) {
                this.errorFormMsg(inputName, "orange", MESSAGE_FORM_NONUMBER);
                return false;
            } else if (inputName !== "address" && inputName !== "email" && inputValue.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)) {
                this.errorFormMsg(inputName, "orange", MESSAGE_FORM_CARACTERE);
                return false;
            } else if (inputName === "email" && (!inputValue.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || inputValue.match(" "))){
                this.errorFormMsg(inputName, "orange", MESSAGE_FORM_EMAIL);
                return false;
            } else {
                this.errorFormMsg(inputName, "green", MESSAGE_FORM_GOODINPUT);
                return true;
            }
    }
    //Formulaire : validation du formulaire avant envoi de commande
    validateForm(e) {
            e.preventDefault();
            const inputs = document.querySelectorAll("input[type=text],input[type=email]");
            let formIsValid = true;
    
            inputs.forEach(input => {
                const isValid = this.validateInput(input);
                if (!isValid) {
                    formIsValid = false;
                }
            });
    
            if (formIsValid) {
                new Application().sendForm();
            }
    }
    //Formulaire : Mise en forme des messages sous les champs
    errorFormMsg(inputName,errorColor,message){
            document.getElementById(inputName + "ErrorMsg").textContent = message;    
            document.getElementById(inputName).style.border=`3px solid ${errorColor}`;
            document.getElementById(inputName + "ErrorMsg").style.color = errorColor;
    }
}
