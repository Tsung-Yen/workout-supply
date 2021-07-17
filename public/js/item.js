//get query String number
let urlParams = new URLSearchParams(window.location.search);
let queryNumber = urlParams.get('id');  //pageid
function defaultPage(id){
    let api_url = "/api/product/"+id;
    fetch(api_url).then((res)=>res.json()).then((result)=>{
        if(result["error"] == null){
            let image = document.querySelector(".item-image");
            image.src = result["image"];
            let itemName = document.querySelector(".item-name");
            itemName.textContent = result["name"];
            let itemPrice = document.querySelector(".item-price");
            itemPrice.textContent = result["price"];
            let details = document.querySelector(".item-details");
            details.textContent = result["details"];
            let brand = document.querySelector(".brand-name");
            brand.textContent = result["brand"];
            //訂購商品數量
            let addButton = document.querySelector(".add");
            let removeButton = document.querySelector(".remove");
            let buyNumber = document.querySelector(".buy-number");
            let intBuyNumber = Number(buyNumber.textContent);
            addButton.addEventListener("click",()=>{
                if(intBuyNumber >= 1){
                    intBuyNumber+=1;
                    buyNumber.innerHTML = intBuyNumber;
                }
            });
            removeButton.addEventListener("click",()=>{
                if(intBuyNumber > 1){
                    intBuyNumber-=1;
                    buyNumber.innerHTML = intBuyNumber;
                }
            });
        }
    });
}



function init(){
    let title = document.querySelector(".title");
    title.addEventListener("click",()=>{
        location.href = "/";
    });
    defaultPage(queryNumber);
}