const  ENDPOINT = "http://localhost:3000/api/products/"
// function to fetch all Kanaps
/* getKanaps renvoi le resultat du fetch au format json -res.json()- */
const getKanapById = async(endpoint = ENDPOINT, id) =>{
    return await ((await fetch(endpoint+id)).json())
}

//Récuperation du localStorage
function storageCart() {
    return JSON.parse(localStorage.getItem('storageCart'));
}

//Function getCartPoduct
// la variable cart contient le retour du localStorage
//let Kanaps est un tableau vide
const getCartProduct = async()=>{
    let cart = storageCart();
    let kanaps = [];
    //Pour chaque produit de mon panier, je récupere le produit +son id
    //Puis je push dans le tableau kanaps
    for (let product of cart) {
        let kanap = await getKanapById(ENDPOINT, product.id);
        //Methode de la classe Object
        // qui permet d'ajouter des attributs  a Kanap our récupérer la qty et la couleur
        Object.defineProperty(kanap, 'qty', {
            value: product.qty
        });

        Object.defineProperty(kanap, 'color', {
            value: product.color
        });
        kanaps.push(kanap);
    }
    return kanaps;
}



//function pour creer et insérer les éléments dans la page Panier

const displayCart = (cart) =>{
    cart.forEach(product => {
        document.querySelector("#cart__items").innerHTML +=`<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

    })
}


const createTotal = async (selectors, total) =>{
    let element = document.querySelector(selectors);
    element.textContent = await total;
}

/**
 * Function cacul des prix totaux
 * @returns {Promise<number>}
 */
const totalPrice = async()=>{
    //récupération de Kanaps
    const cart = await getCartProduct();
    let price = 0;
    for ( let product of cart){
        price += product.price * product.qty;
    }
    return price;
    //let kanapsPrice = price + kanap.price +=;
}

const totalQty = async()=>{
    //récupération de Kanaps
    const cart = await getCartProduct();
    let quantity = 0;
    for ( let product of cart){
        quantity += product.qty;
    }
    return quantity;
    //let kanapsPrice = price + kanap.price +=;
}

//Function écoute changement quantité
const updateValue = async()=>{
    let qtyValue = document.querySelectorAll(".itemQuantity");

//Faire une boucle pour que l'ecoute se fasse sur chaque élément du panier
    let i = 0;
    let cart = storageCart();
    for ( let input of qtyValue){
        //Ecoute les changements sur l'élément input
        input.addEventListener("change", function(){
            const article = input.closest('article.cart__item');
            const articleId = article.dataset.id;
            const articleColor = article.dataset.color;
            const value = input.value;
            for( let item of cart){
                if (item.color === articleColor && item.id === articleId ){
                    item.qty = Number(value);
                    console.log(item.qty);
                    window.localStorage.setItem("storageCart", JSON.stringify(cart));
                    createTotal("#totalPrice", totalPrice());
                    createTotal("#totalQuantity",totalQty());
                }
            }
        });
    }
}

/**
 * Function suppression d'article dans le localStorage
 * Récuperation du Local Storage
 * Ecoute du Bouton Supprimer +Boucler sur chaques elements
 */
const deleteItem = async() =>{
    let deleteButtonTab = document.querySelectorAll(".deleteItem");
    let i = 0;
    let cart = storageCart();
    for ( let deleteButton of deleteButtonTab){
        deleteButton.addEventListener("click",function (){
            const article = deleteButton.closest('article.cart__item');
            const articleId = article.dataset.id;
            const articleColor = article.dataset.color;
            /*
            console.log(articleId+" "+ articleColor);
            console.log(cart)
            for ( let product of cart){
              console.log(product);
              //console.log(product.id !== articleId || product.color !== articleColor);
            }
            */
            cart = cart.filter(product => product.id !== articleId || product.color !== articleColor);
            window.localStorage.setItem("storageCart", JSON.stringify(cart));
            createTotal("#totalPrice", totalPrice());
            createTotal("#totalQuantity",totalQty());
            article.remove();
        });
    }
}



const isInputValide = (form) => {
    let valid = true;

    for (let input of form) {
        if (input.id === "order") {
            continue;
        }
        let textRGEX = /^[a-zA-Z]+$/;
        if (input.id === "email") {
            textRGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        }

        const inputValue = input.value;
        let error = input.nextElementSibling;
        const inputTestResult = textRGEX.test(inputValue);

        if (inputTestResult === false) {
            error.innerText = "Veuillez verifier votre saisie"
            valid = false;
            //Afficher un message d'erreur si pour les champs mal renseigné
            input.reportValidity();
        } else {
            error.innerText = "";


        }
    }
    return valid;
}


const formValidation = async () => {
    let form = document.querySelectorAll("form input");
    let buttonOrder = document.getElementById("order");
    let resultInputValide;
    buttonOrder.addEventListener("click",function (e)
    {
        resultInputValide = isInputValide(form);
        if(resultInputValide===false){
            e.preventDefault();
        }
    });


//Stocker mon return de is InputValide
//Si valide === true faire traitement
//Else isInputValid

        /*    if (valid === true){
            contactObject = {
                contact: {
                    firstName: form.firstName,
                    lastName: string,
                    address: string,
                    city: string,
                    email: string
                },
                products: [string]
            }
            }
        //});
    });*/
}





//Récupérer les données saisies par l'utilisateur

//Méthode POST sur l'API
//Faire un Objet Contact




//Execution de la function getCartProduct
(async () => {
    displayCart(await getCartProduct());
    await totalPrice();
    await totalQty();
    //Execution affichage des totaux sur le dom
    await createTotal("#totalPrice", totalPrice());
    await createTotal("#totalQuantity",totalQty());
    await updateValue();
    await deleteItem();
    await formValidation();
}) ();








