const ENDPOINT = "http://localhost:3000/api/products"

/**
 * Renvoi les kanaps depuis l'API au format jSON
 * @param endpoint appel à l'API
 * @returns Array[Object]
 */
 const getKanaps = async (endpoint = ENDPOINT) => {
    return await (await fetch(endpoint)).json();
 }



/**
 * Fonction qui permet d'afficher les Kanaps sur le DOM
 * @param kanaps
 */
 const displayKanaps = (kanaps) => {
     //itération sur chaque produit du tableau
    kanaps.forEach(kanap => {
        document.querySelector("#items").innerHTML += `<a href="./product.html?id=${kanap._id}">
                <article>
                    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
                        <h3 class="productName">${kanap.name}</h3>
                        <p class="productDescription">${kanap.description}</p>
                </article>
            </a>`;
    })
 }

// Execution de la fonction
 (async () => {
     const kanaps = await getKanaps();
     displayKanaps(kanaps);
 })()



