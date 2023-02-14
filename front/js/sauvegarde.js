//#######Action de modifications############
function addEventListQuantity(productId,productColor,productIndex,productPrice){
    elInputQuantite.addEventListener("change", (e) => {
        e.preventDefault;
        if(modificationQuantity(productId,productColor,productIndex, elInputQuantite.value,productPrice)){
            console.log("Modifié dans le Localstorage");
        } else {
            if(elInputQuantite.value<=0){
                modificationQuantity(productId,productColor,productIndex, 1,productPrice);
                elInputQuantite.style.border="3px solid red";
                elDivError.style.color="red";
                elDivError.style.borderRadius="50px";
                elDivError.style.backgroundColor="white";
                elDivError.style.textAlign="center"; 
                elDivError.innerHTML="<p>Quantité "+elInputQuantite.value+" impossible<br>il doit etre compris entre 1 et 100.<br>Insertion minimum : 1</p>";
                setTimeout(afficherLePanier,4000);
            } else if (elInputQuantite.value>100){
                modificationQuantity(productId,productColor,productIndex, 100,productPrice);
                elInputQuantite.style.border="3px solid red";
                elDivError.style.color="red";
                elDivError.style.borderRadius="50px";
                elDivError.style.backgroundColor="white";
                elDivError.style.textAlign="center"; 
                elDivError.innerHTML="<p>Quantité "+elInputQuantite.value+" impossible<br>il doit etre compris entre 1 et 100.<br>Insertion maximum : 100</p>";
                setTimeout(afficherLePanier,4000);
            }
        }
       });
}
function addEvelentListDelete(){
    elPdelete.addEventListener("click", (e) => {
        e.preventDefault;
        article.innerHTML="";
        article.style.color="white";
        article.style.borderRadius="50px";
        article.style.backgroundColor="green";
        article.style.textAlign="center";
        article.style.height="25px";
        article.style.padding="20px";
        article.innerHTML="Suppression en cours";
        setTimeout(deleteItem, 2000, idDuProduit, couleurDuProduit, indexDuProduit);
       });
}
//Modification de la quantité
function modificationQuantity(productId,productColor,productIndex, productQuantity,productPrice){
    
    if(productQuantity<=0 || productQuantity>100){
        console.log(`La quantité demandée : ${productQuantity} est invalide elle doit etre entre 1 et 100`);
        return false;
    } else {
    //Dans mon retour panier on vérifie que l'index envoyé corresponde bien à cet article ( id / Couleur)
    if(productFullInformation.indexOf(productId) === productFullInformation.indexOf(productColor)){
        //Si c'est bon on modifie la quantité dans la table panierReturn
        productFullInformation[productIndex].quantite = productQuantity;
    }

    //Injection des donnée dans le LocalStorage
    localStorage.setItem("Panier",JSON.stringify(productFullInformation));
    //Quantité modifié => prix et quantité total modifié :
    //On modifie notre table de traitement allProduct
    productFullInformation[productIndex].quantite = productQuantity;
    modificationPrice(productId,productIndex,productQuantity,productPrice);
    return true;
    }

}
//Mise à jour des prix
function modificationPrice(productId,productIndex, productQuantity,productPrice){
    //On boucle cette table pour compter le nombre de produit et la quantité total
    let compteurPrix = 0;
    let compteurQte = 0;
    for (i=0;i<productFullInformation.length;i++){
        compteurPrix = compteurPrix + (productQuantity * productPrice);
        //console.log(compteurPrix);
        compteurQte = Number(compteurQte) + Number(productQuantity);
        //console.log(compteurQte);
    }
    //console.log(compteurPrix + ' => ' + compteurQte);
    //On affiche sur la page les modifications
    let totQte = document.getElementById("totalQuantity");
    totQte.textContent = Number(compteurQte);
    let totPrix = document.getElementById("totalPrice");
    totPrix.textContent = Number(compteurPrix);
    return true;
}
//Suppression d'un produit
function deleteItem(id, couleur, index){

    //On supprime dans notre table panierReturn
    //Vérification que le produit identifié soit bon (ID et Couleur)
    if(productFullInformation.indexOf(id) === productFullInformation.indexOf(couleur)){
        //On passe nos lignes produit à VIDE
        productFullInformation[index]="";
        allProduct[index]="";
    }
    //On filtre pour enlever les lignes VIDE
    productFullInformation = productFullInformation.filter(panierReturn => panierReturn != '');
    allProduct = allProduct.filter(allProduct => allProduct != '');
    //On envoi le résultat au localStorage
    localStorage.setItem("Panier",JSON.stringify(productFullInformation));
    recuperation("delete");
    return true;
    }