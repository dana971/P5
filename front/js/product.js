let params = new URLSearchParams(document.location.search);

let id = params.get("id");

fetch (" http://localhost:3000/api/products/"+ id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })

    .then(function (kanap){

        let eltImage =  document.querySelector("div.item__img");
        eltImage.innerHTML = `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}">`;

        let eltTitle =  document.querySelector("#title");
        eltTitle.textContent = `${kanap.name}`;

        let eltPrice =  document.querySelector("#price");
        eltPrice.textContent = `${kanap.price}`;

        let eltDescription =  document.querySelector("#description");
        eltDescription.textContent = `${kanap.description}`;

        let eltColors =  document.querySelector("select#colors");
        for (let i in kanap.colors ){
            // Creation d'un Element options qui lui meme engendre des elements options avec AppenChild
            let opt = document.createElement("option");
            eltColors.appendChild(opt)
            opt.textContent = `${kanap.colors[i]}`;
        }

    });

let cartElement = document.querySelector("#addToCart");
cartElement.addEventListener("click",function () {
        // panier existe ou pas
        let cartStorage = localStorage.getItem('storageCart');
        let cartJson = JSON.parse(cartStorage);
        let product;

        // panier n'existe pas
        if (cartStorage === null) {

            // crééer le panier et ajoute le produit au panier
            product = {
                id: id,
                color: getColor(),
                qty: getQty(),
            }
            addProductToCart(product);

        } else {
            // panier exist
            // le product qu'on ajoute est nouveau ou pas
            product = {
                id : id,
                color: getColor(),
                qty: getQty(),
            }

            // ont incremente sa qté
            let foundProduct = cartJson.filter(p => {
                return p.id === product.id && p.color === product.color;
            } );
           console.log(foundProduct);

            if (foundProduct.length !== 0 ){ // produit existe
                // find product in carjson
                const aproduct = cartJson.find(p => {
                    return p.id === product.id && p.color === product.color;
                })
                aproduct.qty = Number(product.qty) + Number(foundProduct[0].qty);
                window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
            } else {
                cartJson.push(product)
                window.localStorage.setItem("storageCart", JSON.stringify(cartJson));
            }
        }
    } // fin callback Event listener panier


);

// DISPLAY KANAP



// get Color
const getColor = () => {
    let colorElement = document.getElementById("colors");
    // let colorTab = colorElement.options[colorElement.selectedIndex].text;
    return colorElement.value;
}
// get qty
const getQty = () => {
    let qtyElement = document.getElementById("quantity");
    return Number(qtyElement.value);
}

// addtocart fxn
function addProductToCart(product){
    let cart = [];
    cart.push(product);
    // id et color = unique
    window.localStorage.setItem("storageCart", JSON.stringify(cart));
}

// Get Cart data



