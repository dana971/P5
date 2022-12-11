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



