//récupération de l'id produit
const url = new URL(window.location.href);
const urlId = url.searchParams.get('id');
let panier=[];
let produit;

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

    document.location.href="http://127.0.0.1:5000/front/html/index.html"; 

}
//Affichage du produit
function showProduct(urlId) {

    fetch("http://127.0.0.1:3000/api/products/" + urlId + "")
    .then(function(res) {

        if (res.ok) {

            return res.json();

        }

    })
    .then(function(value) { 

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
        //document.getElementsByClassName
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
        messageError("Merci de choisir une couleur.");
        setTimeout(() => {              
            document.getElementById("messages").innerHTML="";
        }, 2000);

    }
    else{
            
        let quantite = document.getElementById("quantity").value;
        let couleur = document.getElementById("colors").value;
        produit = new Produit(urlId,quantite,couleur);

 
    if (localStorage.length != 0 && panier.length=== 0 ){

        console.log("Ls non vide");
        panierReturn = JSON.parse(localStorage.getItem("Panier"));

            for(i=0;i<panierReturn.length;i++){

                let lSRetour= new Produit(panierReturn[i].id, panierReturn[i].quantite, panierReturn[i].couleur);
                let addToPanier = panier.push(lSRetour);
            
            }

        console.log(panier); 

    }

    let panierFiltreId =  panier.filter(function(panierFiltreId) { 

        return panierFiltreId.id === produit.id;

    });

    if (panierFiltreId.length === 0){

        //console.log("Aucun résultat pour cet Id");
        //console.log(produit.id);
        let addToPanier = panier.push(produit);

        console.log("Produit ajouté au panier");
        messageSuccessAdd();
    } else {

        //console.log("L'id existe " + panierFiltreId.length + " de fois dans le panier");
        
        //on vérifie que la couleur est dans notre tableau
        var panierFiltreColor =  panierFiltreId.filter(function(panierFiltreColor) {
            
            return panierFiltreColor.couleur === produit.couleur;
        
        });


        if (panierFiltreColor.length === 0){

            //console.log("Aucun résultat pour cette couleur sur cet Id");
            let addToPanier = panier.push(produit);
            console.log("Produit ajouté au panier.")
            messageSuccessAdd();
        } else {
        
            //console.log("Cet Id de cette couleur est déjà le panier, on modife la quantité.")
                
                for (i=0;i<panier.length;i++){
                
                    if((produit.id === panier[i].id) && (produit.couleur === panier[i].couleur)){
                        
                        //Le produit est connu dans la table. on modifie sa quantité
                        panier[i].quantite = produit.quantite;
                        console.log("Tout est bon, on modifi la quantité du produit");
                        messageSuccessMod();
                    }
                }
        }
    }


    console.log(panier.length);
    
    for(i=0;i<(panier.length);i++){
        
        localStorage.setItem("Panier",JSON.stringify(panier));
    
    };
    }
}
function messageSuccessAdd(){
    document.getElementById("messages").style.color="white";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="green";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML="<p>Produit ajouté au panier</p>";
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);

}
function messageSuccessMod(){
    document.getElementById("messages").style.color="white";
    document.getElementById("messages").style.borderRadius="50px";
    document.getElementById("messages").style.backgroundColor="green";
    document.getElementById("messages").style.textAlign="center";                                     
    document.getElementById("messages").innerHTML="<p>Quantité modifiée dans votre panier</p>";
    setTimeout(() => {              
        document.getElementById("messages").innerHTML="";
    }, 2000);

}
function messageError(message){
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


