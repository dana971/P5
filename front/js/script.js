 fetch (" http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function (value){

        for (let kanap of value) {
            console.log(kanap.name);
            document.querySelector("#items").innerHTML += `<a href="./product.html?id=${kanap._id}">
                <article>
                    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
                        <h3 class="productName">${kanap.name}</h3>
                        <p class="productDescription">${kanap.description}</p>
                </article>
            </a>`;
        }
    });




