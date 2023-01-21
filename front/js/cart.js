const  ENDPOINT = "http://localhost:3000/api/products/"

/**
 * function to fetch all Kanaps
 * @param endpoint
 * @param id
 * @returns {Promise<any>} getKanaps renvoi le résultat du fetch au format json
 */
const getKanapById = async(endpoint = ENDPOINT, id) =>{
    return await ((await fetch(endpoint+id)).json())
}

/**
 * Récupération du localStorage
 * @returns {any}
 */
function storageCart() {
    return JSON.parse(localStorage.getItem('storageCart'));
}


/**
 * Function getCartProduct
 * @returns {Promise<*[]>}
 */
const getCartProduct = async()=>{
    let cart = storageCart(); // la variable cart contient le retour du localStorage
    let kanaps = [];
    //Pour chaque produit de mon panier, je récupère le produit +son id
    for (let product of cart) {
        let kanap = await getKanapById(ENDPOINT, product.id);
        //Methode de la classe Object
        // qui permet d'ajouter des attributs à Kanap pour récupérer la qty et la couleur
        Object.defineProperty(kanap, 'qty', {
            value: product.qty
        });

        Object.defineProperty(kanap, 'color', {
            value: product.color
        });
        //push dans le tableau kanaps
        kanaps.push(kanap);
    }
    return kanaps;
}


/**
 * fonction pour créer et insérer les éléments dans la page Panier
 * @param cart
 */
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

/**
 * Fonction qui permet d'afficher les totaux
 * @param selectors
 * @param total
 * @returns {Promise<void>}
 */
const createTotal = async (selectors, total) =>{
    let element = document.querySelector(selectors);
    element.textContent = await total;
}

/**
 * Fonction calcul des prix totaux
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
}

/**
 * Fonction calcul des Qté total
 * @returns {Promise<number>}
 */
const totalQty = async()=>{
    //récupération de Kanaps
    const cart = await getCartProduct();
    let quantity = 0;
    for ( let product of cart){
        quantity += product.qty;
    }
    return quantity;
}

/**
 * Fonction d'écoute des valeurs Qté et Prix
 * @returns {Promise<void>}
 */
const updateValue = async()=>{
    let qtyValue = document.querySelectorAll(".itemQuantity");

//Faire une boucle pour que l'écoute se fasse sur chaque élément du panier
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
                    window.localStorage.setItem("storageCart", JSON.stringify(cart));
                    createTotal("#totalPrice", totalPrice());
                    createTotal("#totalQuantity",totalQty());
                }
            }
        });
    }
}

/**
 * Fonction suppression d'article dans le localStorage
 */
const deleteItem = async() =>{
    let deleteButtonTab = document.querySelectorAll(".deleteItem");
    let i = 0;
    let cart = storageCart(); // Récupération du Local Storage

    for ( let deleteButton of deleteButtonTab){
        deleteButton.addEventListener("click",function (){
            const article = deleteButton.closest('article.cart__item');
            const articleId = article.dataset.id;
            const articleColor = article.dataset.color;

            cart = cart.filter(product => product.id !== articleId || (product.id === articleId && product.color !== articleColor));
            window.localStorage.setItem("storageCart", JSON.stringify(cart));
            window.location.reload()
        });
    }
}

/**
 *Fonction qui permet de verifier si le panier est vide
 * @returns {boolean}
 */
const isCartEmpty = () =>{
    let cart = storageCart();
    if(cart === null || cart.length === 0){ // null pour FF et 0pour prise en charge chrome
        return true;
    }
    return false;
}

//TODO : mettre a jour la REGEX pour l'input adresse
/**
 * Fonction qui permet de vérifier si le formulaire est Valide
 * @param form
 * @returns {boolean}
 */
const isInputValide = (form) => {
    let valid = true;

    for (let input of form) {
        if (input.id === "order") {
            continue;
        }
        let textRGEX = /^[A-zÀ-ú]+$/;

        if (input.id === "email") {
            textRGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        }

        if(input.id === "address" || input.id === "city"){
            textRGEX = /^[A-zÀ-ú0-9\s,.'-]{3,}$/;
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

/**
 * Récupération de l'objet Contact qui sera envoyé à l'API
 * @param form
 * @returns {Promise<{contact: {firstName, lastName, address, city, email}, products: *[]}>}
 */
const getOrderObject = async (form) => {
    let cartProduct = storageCart();
    let cart = [];

    for (let product of cartProduct){
        cart.push(product.id);
    }

    let order = {
        contact: {
            firstName: form[0].value,
            lastName: form[1].value,
            address: form[2].value,
            city: form[3].value,
            email: form[4].value,
        },
        products: cart,
    };
    return order;
}


/**
 * Fonction qui permet de Valider le formulaire de commande
 * @returns {Promise<void>}
 */
const formValidation = async () => {
    let form = document.querySelectorAll("form input");
    let buttonOrder = document.getElementById("order");
    let resultInputValide;
    buttonOrder.addEventListener("click",async (e) => {
        e.preventDefault();
        resultInputValide = isInputValide(form);
        const cartEmpty = isCartEmpty();
        if (!resultInputValide || cartEmpty) {
            if(cartEmpty){
                alert("Votre panier est vide");
            }
        } else {
            let order = await getOrderObject(form);
            await postOrder(order);
        }
    });
}



/**
 * Methode POST sur l'API
 * @param order objet renvoyé à l'API
 * @returns {Promise<void>}
 */
const postOrder = async (order) =>  {
    await fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
        .then((response)=> response.json())

        .then( function (response) {
            window.location.href="./confirmation.html?orderId=" + response.orderId;
        });

}


/**
 * Executions des fonctions
 */
(async () => {
    if(!isCartEmpty()){
        displayCart(await getCartProduct());
        await totalPrice();
        await totalQty();
        //Execution affichage des totaux sur le dom
        await createTotal("#totalPrice", totalPrice());
        await createTotal("#totalQuantity",totalQty());
        await updateValue();
        await deleteItem();
    }
    await formValidation();
}) ();








