/**
 * Fonction qui permet d'afficher le numero de commande dans URL et sur le dom
 */
const orderConfirmation = () =>{
    let params = new URLSearchParams(document.location.search);
    let orderId = params.get("orderId");
    if(orderId === null){
        document.querySelector(".confirmation>p").innerHTML=`Vous n'avez aucune commande en cours.`
    } else{
        document.querySelector("#orderId").textContent = orderId;
        localStorage.clear(); //Nettoyage du DOM
    }
}

/**
 * Execution de la fonction
 */
orderConfirmation();