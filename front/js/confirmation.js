
const orderConfirmation = () =>{
    let params = new URLSearchParams(document.location.search);
    let orderId = params.get("orderId");
    console.log(orderId);
    if(orderId === null){
        document.querySelector(".confirmation>p").innerHTML=`Vous n'avez aucune commande en cours.`
    } else{
        document.querySelector("#orderId").textContent = orderId;
    }

}

orderConfirmation();