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
    //Recupère le localstorage clé Panier
    getPanierLocalStorage(){
        JSON.parse(localStorage.getItem('panier'));
    }
    //Supprime la clé Panier du localStorage
    removePanierLocalStorage(){
        localStorage.removeItem('panier');
    }
    //Insert les données dans le localstorage clé Panier
    setitemsPanierLocalStorage(newCart){
        localStorage.setItem('panier',JSON.stringify(newCart));
    }
    //Application tous les produits
    showAllProducts(products){
        products.forEach(product => {
            new Template().allProducts(product);
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
            controls.validateInput(firstName);
        });
        lastName.addEventListener("blur", () => {
            controls.validateInput(lastName);
        });
        email.addEventListener("blur", () => {
            controls.validateInput(email);
        });
        address.addEventListener("blur", () => {
            controls.validateInput(address);
        });
        city.addEventListener("blur", () => {
            controls.validateInput(city);
        });
        document.getElementById("order").addEventListener("click", (e)=>{controls.validateForm(e)});

    }
    //Application Ajout au panier
    addTocart() {
        const selectedColor = document.getElementById("colors").value;
        const selectedQuantity = document.getElementById("quantity").value;
        const urlProductId = WINDOW_URL.searchParams.get('id');
        const template = new Template();
        const controls = new Controls();

        if (!controls.color("colors")) {
            template.showMessages("error", MESSAGE_ERROR_SELECTCOLOR);
          return;
        }
        
        new Cart().add({ id: urlProductId, color: selectedColor, quantity: Number(selectedQuantity) });
        template.showMessages("success", MESSAGE_SUCCESS_ADDTOCART);
        controls.oneProductQuantityColor();
        template.oneProductQuantityNumber(1);

        //new Application({ id: urlProductId,view:"oneId"}).get_one_product();
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
        const template = new Template();
        if(urlId === null){
            template.showMessages("error",MESSAGE_ERROR_CONFIRMATION);
        } else {
            template.showOrderId(urlId);
            this.removePanierLocalStorage();
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
        new Application().setitemsPanierLocalStorage(this.cartLs);
    }
    //Ajout de produit au localStorage
    add(product){
        let foundProduct = this.cartLs.find( p => p.id === product.id && p.color === product.color );
        if( foundProduct !== undefined ){
                foundProduct.quantity += product.quantity;
        } else {
            let sameProduct = this.cartLs.find( p => p.id === product.id );
            if ( sameProduct !== undefined ) {
                let index = this.cartLs.indexOf(sameProduct);
                this.cartLs.splice(index+1, 0, product);
            } else {
                this.cartLs.push(product);
            }
        }
        new Application().setitemsPanierLocalStorage(this.cartLs);
    }
    //Suppression d'un produit DOM et localstorage
    remove(){
        let articleRemoved = this.parentNode.parentNode.parentNode.parentNode;
        let idProduct = articleRemoved.dataset['id'];
        let colorProduct = articleRemoved.dataset['color'];
        const application = new Application();
        const template = new Template();
        let oldCart = application.getPanierLocalStorage();
        let newCart = [];
        for( let i = 0 ; i < oldCart.length ; i++){
            if( oldCart[i].id === idProduct && oldCart[i].color === colorProduct ){ } else {
                newCart.push({ 
                    id:oldCart[i].id,
                    color:oldCart[i].color,
                    quantity:oldCart[i].quantity
                 });
            }
        }
        application.removePanierLocalStorage();
        application.setitemsPanierLocalStorage(newCart);
        template.showMessages("success",MESSAGE_SUCCESS_DELETEFORMCART);
        template.blankCartItems();
        new Application({view:"cart"}).get_all_products();

    }
    //Changer la quantité d'un produit dans le LocalStorage
    changeQuantity(quantity,index){
        this.cartLs[index]['quantity']=quantity;
        new Application().setitemsPanierLocalStorage(this.cartLs);
        this.totalNumberProduct();
        this.totalCartPrice();
    }
    //Calcul du nombre total d'articles dans le panier
    totalNumberProduct(){
        let number=Number(0);
        for(let product of this.cartLs){
            number+=Number(product.quantity);
        }
        new Template().showTotalNumberProduct(number);
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
            new Template().showTotalCartPrice(total);
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
    allProducts(product){
        document.querySelector("#items").innerHTML += `
        <a href="./product.html?id=${product._id}">
          <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
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
        document.querySelector("#price").textContent = this.price.toLocaleString();
        document.querySelector("#description").textContent = this.description;
        document.querySelector("article").innerHTML+=this.domMessages();
        document.querySelector("#quantity").setAttribute("min",APP_MINIMUMQUANTITY);
        document.querySelector("#quantity").setAttribute("max",APP_MAXIMUMQUANTITY);
        document.querySelector("#quantity").setAttribute("value",APP_MINIMUMQUANTITY);
        document.querySelector(".item__content__settings__quantity").firstElementChild.textContent=DOM_NUMBERACCEPTQUANTITY;
        document.querySelector("#colors").addEventListener('change',new Controls().oneProductQuantityColor);
        document.querySelector("#quantity").addEventListener('change',new Controls().oneProductQuantityColor);
        document.getElementById("quantity").setAttribute("disabled","");
        document.querySelector("#addToCart").addEventListener("click",new Application().addTocart);
    }
    //Vide la DOM du panier
    blankCartItems(){
        document.querySelector("#cart__items").innerHTML="";
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
                    <p>${api.price.toLocaleString()} €</p>
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
    //Désactive ou acive l'input quantité dans One product
    oneProductQuantityDisabled(state){
        const quantityInput = document.getElementById("quantity");
        if ( state ){ quantityInput.setAttribute("disabled",""); }
        else { quantityInput.removeAttribute("disabled",""); }
    }
    //Modifie la quantité maximum de l'input quantité dans one product
    oneProductQuantityAttibuteMax(valueMax){
        document.querySelector("#quantity").setAttribute("max",valueMax);
    }
    //Insert la valeur de l'input quantité dans one product 
    oneProductQuantityNumber(number){
        document.getElementById("quantity").value=number;
    }
    //Désactive ou active le bouton d'envoi de formulaire dans one product
    buttomAddtoCartDisabled(state){
        const buttomAddtoCart = document.getElementById("addToCart");
        if ( state ){ buttomAddtoCart.setAttribute("disabled",""); }
        else { buttomAddtoCart.removeAttribute("disabled",""); }
    }
    //Affichage du message de quantité possible dans oneproduct
    messageQuantityPossible(message){
        document.querySelector(".item__content__settings__quantity").firstElementChild.textContent=message;
    }
    //Controle quantité couleur dans oneproduction => Actions sur le DOM
    oneProductQuantityColor_modification(disabledQuantity,maximumQuantity,disabledButtom){
        this.oneProductQuantityDisabled(disabledQuantity);
        this.oneProductQuantityAttibuteMax(maximumQuantity);
        this.messageQuantityPossible(`Nombre d'article(s) (${APP_MINIMUMQUANTITY}-${maximumQuantity})`);
        this.buttomAddtoCartDisabled(disabledButtom);
    }
    //Affiche le montant total du panier
    showTotalCartPrice(total){
        document.querySelector("#totalPrice").textContent= total.toLocaleString();
    }
    //Affiche la qauntité total du panier
    showTotalNumberProduct(number){
        document.querySelector("#totalQuantity").textContent=number.toLocaleString();
    }
    //Formulaire : Mise en forme des messages sous les champs
    errorFormMsg(inputName,errorColor,message){
        document.getElementById(inputName + "ErrorMsg").textContent = message;    
        document.getElementById(inputName).style.border=`3px solid ${errorColor}`;
        document.getElementById(inputName + "ErrorMsg").style.color = errorColor;
    }
    //affiche le numéro de commande dans confirmation
    showOrderId(urlId){
        document.querySelector("#orderId").textContent = urlId;
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
        const template = new Template();
        
        if(quantityDom < APP_MINIMUMQUANTITY){ 
            document.querySelectorAll("input.itemQuantity")[index].value=APP_MINIMUMQUANTITY; 
            template.showMessages("alert",MESSAGE_ALERT_MINIMUMQUANTITY);
            quantityDom=APP_MINIMUMQUANTITY;
        }
        if(quantityDom > APP_MAXIMUMQUANTITY){ 
            document.querySelectorAll("input.itemQuantity")[index].value=APP_MAXIMUMQUANTITY;
            template.showMessages("alert",MESSAGE_ALERT_MAXIMUMQUANTITY);
            quantityDom=APP_MAXIMUMQUANTITY;
        }
        new Cart().changeQuantity(quantityDom,index);
        template.showMessages("success",MESSAGE_SUCCESS_NEWQUANTITY+ " "+quantityDom+".");
    }
    //Controle Selection de la couleur et de la quantité sur OnePorduct
    oneProductQuantityColor(){
        const template = new Template();
        let colorSelected=document.querySelector("#colors").value;
        let quantityDom=document.querySelector("#quantity").value;
        let isExist = new Controls().productIsInCart(colorSelected);

        if (!new Controls().color("colors")) {
            template.oneProductQuantityDisabled(true);
            template.oneProductQuantityNumber(1);
            return;
        }
        template.oneProductQuantityDisabled(false);
        if(quantityDom < APP_MINIMUMQUANTITY){ 
            template.oneProductQuantityNumber(1);
        }
        if(isExist){
            const quantityInLs = isExist.quantity;
            const restQuantity = Number(APP_MAXIMUMQUANTITY) - Number(quantityInLs);
            if(restQuantity===0){
                template.oneProductQuantityColor_modification(true,restQuantity,true);
                template.oneProductQuantityNumber(0);
                template.messageQuantityPossible(`Limite des ${APP_MAXIMUMQUANTITY} produits atteind.`);
                return;
            }
            if(quantityDom > restQuantity){
                template.oneProductQuantityNumber(restQuantity);
            }
            template.oneProductQuantityColor_modification(false,restQuantity,false);
            return;
        } else {
            if(quantityDom > APP_MAXIMUMQUANTITY){
                template.oneProductQuantityNumber(APP_MAXIMUMQUANTITY);
            }
            template.oneProductQuantityColor_modification(false,APP_MAXIMUMQUANTITY,false);
        }
    }
    //Controle de la séléction d'une couleur
    color(element){
        return ( 
            document.getElementById(element).value != ""
        );       
    }
    //controle de la présence d'un produit dans le panier (id via URL et couleur en paramètre)
    productIsInCart(productColor){
        const productId = new URL(window.location.href).searchParams.get('id');
        let products = new Cart().cartLs.filter(function (element) {
          return (
            (element.id === productId)&&(element.color === productColor)
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
            const template = new Template();

            if (inputValue.length === 0) {
                template.errorFormMsg(inputName, "red", MESSAGE_FORM_EMPTY);
                return false;
            } else if (inputName !== "city" && inputName !== "address" && inputName !== "email" && inputValue.match(/[0-9]/i)) {
                template.errorFormMsg(inputName, "orange", MESSAGE_FORM_NONUMBER);
                return false;
            } else if (inputName !== "address" && inputName !== "email" && inputValue.match(/[ýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s\.\,\\\@\!\\[\]\&\(\)\|\_\/\%\^\*+\°\§\€\&\"\`\=\+\¤\¨:]/)) {
                template.errorFormMsg(inputName, "orange", MESSAGE_FORM_CARACTERE);
                return false;
            } else if (inputName === "email" && (!inputValue.match(/^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/) || inputValue.match(" "))){
                template.errorFormMsg(inputName, "orange", MESSAGE_FORM_EMAIL);
                return false;
            } else {
                template.errorFormMsg(inputName, "green", MESSAGE_FORM_GOODINPUT);
                return true;
            }
    }
    //Formulaire : validation du formulaire avant envoi de commande
    validateForm(e) {
            e.preventDefault();
            let formIsValid = true;
            const inputs = document.querySelectorAll("input[type=text],input[type=email]");
    
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
}
