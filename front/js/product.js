let params = new URLSearchParams(document.location.search);

let id = params.get("id");

/**
 * Appel a l'API pour récupérer le produit sélectionné à partir de son id et non tous les produits
 */
fetch (" http://localhost:3000/api/products/"+ id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })

    .then(function (kanap){

        createProduct("#title", kanap.name,true);
        createProduct("#price", kanap.price, true);
        createProduct("#description", kanap.description, true);
        createProduct("div.item__img", `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`, false);

        let eltColors =  document.querySelector("select#colors");
        for (let i in kanap.colors ){
            // Creation d'un Element option qui lui meme engendre des elements options avec AppenChild
            let opt = document.createElement("option");
            eltColors.appendChild(opt)
            opt.textContent = `${kanap.colors[i]}`;
        }

    });

/**
 * Creation des éléments prix title description sur la page produit
 * @param selectors sélecteurs css
 * @param valeurs valeur à insérer
 * @param isTextContent booléens true si textContent
 */
function createProduct (selectors, valeurs, isTextContent) {
    let element = document.querySelector(selectors);
   if (isTextContent){
       element.textContent = `${valeurs}`;
   }else{
       element.innerHTML = `${valeurs}`;
   }

}

/**
 * Récupère et vérifie la qty du produit entre 0 et 100
 * @param qty
 * @returns {boolean}
 */
const checkQty = (qty) => {
    return (qty > 0 && qty < 100) ? true : false;
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
 *Execution de la fonction pour l'ajout d'un produit dans le panier
 * @type {Element}
 */
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

        if(checkQty(getQty()) && checkColor(getColor())) {
            // panier n'existe pas
            if (cartStorage === null) {
                // On ajoute le produit au panier
                addProductToCart(product);
            } else {
                // panier existe
                // on incrémente la qté
                /*
                let foundProduct = cartJson.filter(p => {
                    return p.id === product.id && p.color === product.color;
                } );
                 */

                const aproduct = cartJson.find(p => {
                    return p.id === product.id && p.color === product.color;
                });

                if (aproduct.length !== 0 ){ // produit existe
                    // find product in cartjson
                    /*
                    const aproduct = cartJson.find(p => {
                        return p.id === product.id && p.color === product.color;
                    });
                    */
                    aproduct.qty = Number(product.qty) + Number(aproduct.qty);
                    window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
                } else {
                    cartJson.push(product)
                    window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
                }
            }
        } else {
            alert("Veuillez choisir une quantité ou une couleur valide");
        }

    } // fin Event listener du panier

);


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


/**
 * Fonction d'ajout d'un produit au panier à partir du localStorage
 * @param product
 */
function addProductToCart(product){
    let cart = [];
    cart.push(product);
    // id et color = unique
    window.localStorage.setItem("storageCart", JSON.stringify(cart));
}




