
function showProduct() {
    fetch("http://127.0.0.1:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {          
          let nbProduct = value.length;    
          for(let i = 0;i < nbProduct; i++){

                   //lien
                   let elA = document.createElement("a");
                   document.querySelector("#items").appendChild(elA);
                   //alA.className = "cart__item";
                   elA.setAttribute("href", "./product.html?id=" + value[i]._id + "");
                  
                   //Article
                   let elArticle = document.createElement("article");
                   elA.appendChild(elArticle);

                   //Image
                  let elImg =document.createElement("img");
                  elArticle.appendChild(elImg);
                  elImg.setAttribute("src", value[i].imageUrl);
                  elImg.setAttribute("alt", value[i].altTxt);

                  //Titre
                  let elH3 = document.createElement("H3");
                  elArticle.appendChild(elH3);
                  elH3.className= "productName";
                  elH3.innerHTML= value[i].name;

                  //Description
                  let elP = document.createElement("p");
                  elArticle.appendChild(elP);
                  elP.className= "productDescription";
                  elP.innerHTML= value[i].description;

          }
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
  }
showProduct();