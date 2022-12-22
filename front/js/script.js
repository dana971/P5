const ENDPOINT = "http://localhost:3000/api/products"
 // function to fetch all Kanaps
/* getKanaps renvoi le resultat du fetch au format json -res.json()- */
 const getKanaps = async (endpoint = ENDPOINT) => {
    return await (await fetch(endpoint)).json();
 }

 // Function to display Kanaps
 const displayKanaps = (kanaps) => {
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
// Execute Script Functions
 (async () => {
     displayKanaps(await getKanaps())
  // displayKanaps(await res.jon())
 })()



