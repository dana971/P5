let params = new URLSearchParams(document.location.search);
let id = params.get("id");

/**
 * Insertion du produit sur la page produit à partir des éléments reçus de l'API
 */
const createProduct = () => {

    // Appel a l'API pour récupérer le produit sélectionné à partir de son id et non tous les produits
    fetch (" http://localhost:3000/api/products/"+ id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (kanap){

            // Insertion des éléments prix, title, description et image sur la page produit
            insertProductContent("#title", kanap.name,true);
            insertProductContent("#price", kanap.price, true);
            insertProductContent("#description", kanap.description, true);
            insertProductContent("div.item__img", `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`, false);

            let eltColors =  document.querySelector("select#colors");
            for (let i in kanap.colors ){
                // Creation d'un Element option qui lui meme engendre des elements options avec AppenChild
                let opt = document.createElement("option");
                eltColors.appendChild(opt)
                opt.textContent = `${kanap.colors[i]}`;
            }
        });
}


/**
 * Insertion des éléments prix, title, description, image et couleurs sur la page produit
 * @param selectors sélecteurs css
 * @param valeurs valeur à insérer
 * @param isTextContent booléens true si textContent
 */
function insertProductContent (selectors, valeurs, isTextContent) {
    let element = document.querySelector(selectors);
    if (isTextContent){
        element.textContent = `${valeurs}`;
    }else{
        element.innerHTML = `${valeurs}`;
    }

}


/**
 *Event listener surveillant l'ajout d'un produit dans le panier
 */
const addProductToCart = () => {

    let cartElement = document.querySelector("#addToCart");
    cartElement.addEventListener("click",function () {
        // panier existe ou pas
        let cartStorage = localStorage.getItem('storageCart');
        let cartJson = JSON.parse(cartStorage);
        let product = {
            id: id,
            color: getColor(),
            qty: getQty(),
        };

        if (checkColor(product.color) && checkQty(product.qty)) {
            // panier n'existe pas
            if (cartStorage === null) {
                // On ajoute le produit au panier
                let cart = [];
                cart.push(product);
                window.localStorage.setItem("storageCart", JSON.stringify(cart));
            } else {
                // Le panier existe
                // on incrémente la qté
                const findProduct = cartJson.find(p => {
                    return p.id === product.id && p.color === product.color;
                });

                if (findProduct !== undefined) { // produit existe
                    // find product in cartjson
                    findProduct.qty = Number(product.qty) + Number(findProduct.qty);
                    window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
                } else {
                    cartJson.push(product)
                    window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
                }
            }
        } else {
            alert("Veuillez choisir une quantité ou une couleur valide");
        }
    }); // fin Event listener du panier
}



/**
 * Récupère et vérifie la couleur du produit
 * @param color
 * @returns {boolean}
 */
const checkColor = (color) => {
    return color ? true : false;
}


/**
 * Récupère et vérifie la qty du produit entre 0 et 100
 * @param qty
 * @returns {boolean}
 */
const checkQty = (qty) => {
    return (qty > 0 && qty < 100);
}


/**
 * Fonction qui retourne la couleur d'un produit
 * @returns {*}
 */
const getColor = () => {
    let colorElement = document.getElementById("colors");
    return colorElement.value;
}


/**
 * Fonction qui récupère la quantité d'un produit
 * @returns {number}
 */
const getQty = () => {
    let qtyElement = document.getElementById("quantity");
    return Number(qtyElement.value);
}

createProduct();
addProductToCart();
