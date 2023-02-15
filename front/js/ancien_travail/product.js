//récupération de l'id produit
const url = new URL(window.location.href);
const urlId = url.searchParams.get('id');
let panier=[];
let produit;
let positionProduit;
let url_dev ="http://127.0.0.1:3000";
//------------------------------------Classe constructor------------------------
//On crée une classe constructor pour l'ajout au localStorage
class Produit {

    constructor(id, quantite, couleur) {
        this.id = id;
        this.quantite = quantite;
        this.couleur = couleur;
    }

}

//------------------------------------Les fonctions-----------------------------
//Retour à la page d'index
function returnIndex(){

    document.location.href="/front/html/index.html"; 

}
//Affichage du produit
function showProduct(urlId) {

    fetch (`${url_dev}/api/products/${urlId}`)
    .then(function(res) {

        if (res.ok) {

            return res.json();

        }

    })
    .then(function(value) { 
        //Titre de la page
        document.querySelector("title").textContent = value.name;
        //Image
        let elImg = document.createElement("img");
        document.querySelector(".item__img").appendChild(elImg);
        elImg.setAttribute("src", value.imageUrl);
        elImg.setAttribute("alt", value.altTxt + ", " + value.name);

        //Ajout du titre / prix / description
        document.getElementById("title").textContent = value.name;
        document.getElementById("price").textContent = value.price;
        document.getElementById("description").textContent = value.description;

          //Les options de couleurs
          let nbColors = value.colors.length;
          //Boucle pour insertion
            for(let i =0;i < nbColors; i++){

                document.getElementById("colors").innerHTML += "<option value='" + value.colors[i] + "'>" + value.colors[i] + "</option>";
            
            }
        //Quantite minimum
        document.getElementById("quantity").setAttribute("value", 1);

        let elDivError = document.createElement("div");
        document.querySelector("article").appendChild(elDivError);
        elDivError.style.marginTop="5px";
        elDivError.style.width="90%";
        elDivError.setAttribute("id", "messages");
    })
    .catch(function(err) {

            // Une erreur est survenue
            alert("Une erreur est survenue au chargement du produit: "+err+". Merci de revenir.");
            returnIndex();
    
    });
}

//Ajout du produit
function traitement(){
    //Vérification des quantités
    if (document.getElementById("quantity").value <= 0 || document.getElementById("quantity").value > 100) {

        //alert("La quantité choisie pour votre produit n'est pas possible. Veuillez choisir une quantité différente.");
        //return false;
        if(document.getElementById("quantity").value<=0){
            //modificationQuantite(idDuProduit, couleurDuProduit, indexDuProduit, 1);
            //document.getElementById("quantity").style.border="3px solid red";
            messageError("Quantité "+document.getElementById("quantity").value+" impossible<br>il doit etre compris en 1 et 100.<br>Insertion minimum : 1</p>");
            setTimeout(() => {              
                document.getElementById("messages").innerHTML="";
            }, 2000);
        } else if (document.getElementById("quantity").value>100){
            //modificationQuantite(idDuProduit, couleurDuProduit, indexDuProduit, 100);
            //document.getElementById("quantity").style.border="3px solid red";  
            messageError("Quantité "+document.getElementById("quantity").value+" impossible<br>il doit etre compris en 1 et 100.<br>Insertion maximum : 100</p>");
            setTimeout(() => {              
                document.getElementById("messages").innerHTML="";
            }, 2000);
        }
    } else if(document.getElementById("colors").value===""){
        //Si la couleur n'est pas séléctionnée
        messageError("Merci de choisir une couleur.");
        setTimeout(() => {              
            document.getElementById("messages").innerHTML="";
        }, 2000);

    }
    else{
        //Si la couleur et la quantité est correct on créer un produit à insérer
        let quantite = document.getElementById("quantity").value;
        let couleur = document.getElementById("colors").value;
        produit = new Produit(urlId,quantite,couleur);

    //ANALYSE DU LS
    //Si le LS contient déjà au moins un article
    if (localStorage.length != 0 && panier.length=== 0 ){

        //console.log("Ls non vide");
        //On récupére le panier du LS
        productFullInformation = JSON.parse(localStorage.getItem("Panier"));
            //Pour chaque valeur du panier on l'inser dans notre tableau de travail "panier"
            for(i=0;i<productFullInformation.length;i++){

                let lSRetour= new Produit(productFullInformation[i].id, productFullInformation[i].quantite, productFullInformation[i].couleur);
                let addToPanier = panier.push(lSRetour);
                //On récupère l'index du produit qui correspond à notre future ajout pour l'insérer au bon emplacement
                if(productFullInformation[i].id===produit.id){
                    positionProduit = i;
                    console.log(positionProduit);
                }
            }

        //console.log(panier); 

    }
    

    //On filtre notre tableau "panier" pour savoir si un ID identique est déjà présent dans le LS
    let panierFiltreId =  panier.filter(function(panierFiltreId) { 
        //Si c'est le cas on insert son ID dans la variable panierFiltreId
        
        return panierFiltreId.id === produit.id;

    });
    //SI panierFiltreId est srtictement VIDE c'est qu'il n'existe pas dans le panier
    if (panierFiltreId.length === 0){
        //Insertion dans le panier
        //console.log("Aucun résultat pour cet Id");
        //console.log(produit.id);
        let addToPanier = panier.push(produit);

        console.log("Produit ajouté au panier");
        messageSuccessAdd();
    } else {
        //Le produit est déjà connu dans le panier
        //console.log("L'id existe " + panierFiltreId.length + " de fois dans le panier");
        
        //on vérifie que la couleur du produit est dans notre tableau
        var panierFiltreColor =  panierFiltreId.filter(function(panierFiltreColor) {
            //Si c'est le cas on retourne la couleur déjà dans le panier dans la variable panierFilterColor
            return panierFiltreColor.couleur === produit.couleur;
        
        });

        //Si panierFilterColor est sirectement VIDE c'est que la couleur est différente de celle connu dans le panier
        if (panierFiltreColor.length === 0){
            //On insert donc le nouveau produit à la suite du précédent grace à SPLICE et à l'index du précédent produit à ID identique
            //Insertion du produit dans le panier
            //console.log("Aucun résultat pour cette couleur sur cet Id");
            let addToPanier = panier.splice(positionProduit,0, produit);
            console.log("Produit ajouté au panier.")
            messageSuccessAdd();
        } else {
            //Dans le cas ou l'id est connu et que la couleur correspond on modifie la quantité du produit
            //console.log("Cet Id de cette couleur est déjà le panier, on modife la quantité.")
                
                for (i=0;i<panier.length;i++){
                
                    if((produit.id === panier[i].id) && (produit.couleur === panier[i].couleur)){
                        
                        //Le produit est connu dans la table. on modifie sa quantité
                        panier[i].quantite = produit.quantite;
                        console.log("Tout est bon, on modifie la quantité du produit");
                        messageSuccessMod();
                    }
                }
        }
    }


    //console.log(panier.length);

    //Une fois le traitement terminé on met en forme JSON les donnée du tableau panier pour inserer dans le LS
    for(i=0;i<(panier.length);i++){
        
        localStorage.setItem("Panier",JSON.stringify(panier));
    
    };
    }
}
function messageSuccessAdd(){
    //On agit sur le DOM pour le message d'ajout au panier
    document.getElementById("messages").style.color="white";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="green";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML="<p>Produit ajouté au panier</p>";
    //durée d'apparition sur 2sec
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);

}
function messageSuccessMod(){
    //On agit sur le DOM pour afficher le message de modification de quantité
    document.getElementById("messages").style.color="white";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="green";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML="<p>Quantité modifiée dans votre panier</p>";
    //Durée d'affichage de 2sec
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);

}
function messageError(message){
//On agit sur le DOM pour afficher le message d'erreur
document.getElementById("messages").style.color="red";
document.getElementById("messages").style.borderRadius="50px";
document.getElementById("messages").style.backgroundColor="white";
document.getElementById("messages").style.textAlign="center";                                     
document.getElementById("messages").innerHTML="<p>"+message+"</p>";
}
//------------------------------Chargement de la page-----------------------
//On affiche le produit
showProduct(urlId);
//Click ajout au panier
document.getElementById("addToCart").addEventListener('click', traitement);


