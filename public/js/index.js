let title = document.querySelector(".title");
title.addEventListener("click",()=>{
    location.href = "/";
});
let part = document.querySelector(".part"); //容納所有商品div
//預設載入頁面
function defaultLoad(num){
    let url = "/api/items/"+num;
    fetch(url).then(res=>res.json()).then((jsonData)=>{
        if(jsonData != null){
            let part = document.querySelector(".part");
            for(let i=0;i<jsonData["data"].length;i++){
                let item = document.createElement("div");
                item.className = "item";
                item.id = "item"+i.toString();
                let link = document.createElement("a");
                link.href = "/item?id="+jsonData["data"][i]["id"].toString();   //各商品連結
                let image = document.createElement("img");
                image.src = jsonData["data"][i]["image"];
                let itemName = document.createElement("p");
                itemName.className = "item-name";
                itemName.id = "item"+i.toString();
                itemName.textContent = jsonData["data"][i]["name"];
                let price = document.createElement("p");
                price.className = "price";
                price.id = "price"+i.toString();
                price.textContent = jsonData["data"][i]["price"];
                let buyNow = document.createElement("div");
                buyNow.className = "buy-now";
                buyNow.id = "buyNow"+i.toString();
                buyNow.textContent = "立即購買";
                link.append(image);
                item.append(link);
                item.append(itemName);
                item.append(price);
                item.append(buyNow);
                part.append(item);
            }
            //分類標籤
            label();
            //串接每個商品連結
            singleProduct();
        }
        
    });
}

//頁數切換
let pageStart = 1   //初始載入開始頁籤
let pageEnd = 6;    //初始載入結束頁籤
let pageALLEnd = false; //使用者瀏覽完所有頁數
let page = document.querySelector(".page");
let frontPage = document.querySelector(".front");
let nextPage = document.querySelector(".next");
function firstPage(start,end){
    for(let i=start;i<=end;i++){
        let newPageNum = document.createElement("div");
        newPageNum.className = "number";
        newPageNum.id = "page"+i.toString();
        newPageNum.textContent = i;
        page.append(newPageNum);
    }
    //頁數連結
    pageHref();
    //下一頁按鈕
    nextPage.addEventListener("click",nextPageButton);
    //上一頁按鈕
    frontPage.addEventListener("click",frontPageButton);
}
function nextPageButton(){
    if(pageEnd < 36){
        pageStart+=1;
        pageEnd+=1;
        page.innerHTML = "";
        for(let i=pageStart;i<=pageEnd;i++){
            let newPageNum = document.createElement("div");
            newPageNum.className = "number";
            newPageNum.id = "page"+i.toString();
            newPageNum.textContent = i;
            page.append(newPageNum);
        }
        pageHref();
    }
}
function frontPageButton(){
    if(pageStart > 1 && pageStart <= 33){
        pageStart-=1;
        pageEnd-=1;
        page.innerHTML = "";
        for(let i=pageStart;i<=pageEnd;i++){
            let newPageNum = document.createElement("div");
            newPageNum.className = "number";
            newPageNum.id = "page"+i.toString();
            newPageNum.textContent = i;
            page.append(newPageNum);
        }
        pageHref();
    }
}
function pageHref(){
    for(let i=pageStart;i<=pageEnd;i++){
        let pageNum = document.getElementById("page"+i.toString());
        pageNum.addEventListener("click",()=>{
            part.innerHTML = "";
            pageNum.style.backgroundColor = "darkblue";
            pageNum.style.color = "white";
            defaultLoad(i);
            //更新當前頁數標記
            for(let j=pageStart;j<=pageEnd;j++){
                if(i != j){
                    let canclePage = document.getElementById("page"+j.toString());
                    canclePage.style.backgroundColor = "white";
                    canclePage.style.color = "black";
                }
            }
        });
        
    }
    
}

//偵測使用者當前頁數函式(舊的頁數需消選取)
let userCurrentPageNumber = pageStart;    //當前頁數
function pointToColor(){
    if(part != ""){
        //選取到的頁數改變顏色
        for(let i=pageStart;i<=pageEnd;i++){
            let currentPage = document.getElementById("page"+i.toString());
            currentPage.addEventListener("click",()=>{
                currentPage.style.backgroundColor = "darkblue";
                currentPage.style.color = "white";
                
                //取消記錄中的其他顏色
                for(let j =pageStart;j<=pageEnd;j++){
                    if(j!=i){
                        let canclePage = document.getElementById("page"+j.toString());
                        canclePage.style.backgroundColor = "white";
                        canclePage.style.color = "black";
                    }
                }

            });

        }
    }
}
//頁碼第一頁處理
function currentPage(){
    let userPage = 1;
    let switchHistory = null;
    pointToColor();
    //沒有換頁紀錄直接載入第一頁
    if(switchHistory == null){
        defaultLoad(1);
    }
    document.getElementById("page1").style.background = "darkblue";
    document.getElementById("page1").style.color = "white";


    for(let i=pageStart;i<=pageEnd;i++){
        let allPage = document.getElementById("page"+i.toString());
        allPage.addEventListener("click",()=>{
            part.innerHTML = "";
            defaultLoad(i);
        });
    }
    //最後一頁
    let lastPage = document.getElementById("last");
    let last = document.querySelector(".page");
    lastPage.addEventListener("click",()=>{
        part.innerHTML = "";
        defaultLoad(36);
        //36被觸發，頁碼直接跳到最後一頁
        pageStart = 32;
        pageEnd =35;
        if(last != ""){
            last.innerHTML = "";
            for(let i=31;i<=36;i++){
                let pageNumber = document.createElement("div");
                pageNumber.className = "number";
                pageNumber.id = "page"+i.toString();
                pageNumber.textContent = i;
                last.append(pageNumber);
                let newpage = document.getElementById("page"+i.toString());
                newpage.addEventListener("click",()=>{
                    part.innerHTML = "";
                    defaultLoad(i);
                    newpage.style.backgroundColor = "darkblue";
                    newpage.style.color = "white";
                    //取消記錄中的其他顏色
                    for(let j =31;j<=36;j++){
                        if(j!=i){
                            let canclePage = document.getElementById("page"+j.toString());
                            canclePage.style.backgroundColor = "white";
                            canclePage.style.color = "black";
                        }
                        console.log(j);
                    }
                });
            }
            document.getElementById("page36").style.backgroundColor = "darkblue";
            document.getElementById("page36").style.color = "white";
        pageALLEnd = true;
        }
    });
}

//主頁標題分類
function label(){
    //男士專區
    let men = document.querySelector(".men");
    labelmouse(men);
    men.addEventListener("click",()=>{
        console.log("men!!");
    });
    //女士專區
    let women = document.querySelector(".women");
    labelmouse(women);
    let womenType = null;
    let womenFlagPressed = null;
    let womenMaxPage = null;
    women.addEventListener("click",()=>{
        //將分類標籤換為補給品
        document.querySelector(".shirt").style.display = "initial";
        document.querySelector(".jacket").style.display = "initial";
        document.querySelector(".pant").style.display = "initial";
        document.querySelector(".cap").style.display = "initial";
        document.querySelector(".other").style.display = "initial";
        document.querySelector(".tryall").style.display = "none";
        document.querySelector(".mars").style.display = "none";
        document.querySelector(".myprotein").style.display = "none";
        document.querySelector(".on").style.display = "none";
        document.querySelector(".protein-bar").style.display = "none";
        supplyBtnPress = null;
        if(womenFlagPressed == null){
            womenFlagPressed = true;
            part.innerHTML = "";
            if(womenType == null)allLableClick("longsleeve");
            for(let i=1;i<=5;i++){
                let allLabel = document.getElementById("part"+i.toString());
                allLabel.addEventListener("click",()=>{
                    if(i == 1)womenType = "longsleeve";
                    else if(i == 2)womenType = "jacket";
                    else if(i == 3)womenType = "pants";
                    else if(i == 4)womenType = "cap";
                    else if(i == 5)womenType = "shoes";
                    allLableClick(womenType);
                });
            }
        }
        function allLableClick(type){
            part.innerHTML = "";
            let womenPage = 1;
            let url = "/api/itemtype/"+womenPage+"?gender=girl&type="+type;
            fetch(url).then((res)=>res.json()).then((result)=>{
                if(result["error"] == null){
                    womenMaxPage = result["maxpage"];
                    let part = document.querySelector(".part");
                    for(let i=0;i<result["data"].length;i++){
                        let item = document.createElement("div");
                        item.className = "item";
                        item.id = "item"+i.toString();
                        let link = document.createElement("a");
                        link.href = "/item?id="+result["data"][i]["id"];
                        let image = document.createElement("img");
                        image.src = result["data"][i]["image"];
                        let itemName = document.createElement("p");
                        itemName.className = "item-name";
                        itemName.id = "item"+i.toString();
                        itemName.textContent = result["data"][i]["name"];
                        let price = document.createElement("p");
                        price.className = "price";
                        price.id = "price"+i.toString();
                        price.textContent = result["data"][i]["price"];
                        let buyNow = document.createElement("div");
                        buyNow.className = "buy-now";
                        buyNow.id = "buyNow"+i.toString();
                        buyNow.textContent = "立即購買";
                        link.append(image);
                        item.append(link);
                        item.append(itemName);
                        item.append(price);
                        item.append(buyNow);
                        part.append(item);
                    }
                    //商品進滑出效果
                    if(part != ""){
                        let startItem = 0;
                        let endItem = 11;
                        if(result["data"].length < 12){
                            endItem = result["data"].length;
                        }
                        for(let i=0;i<endItem;i++){
                            let productId = document.getElementById("item"+i.toString());
                            let buyNowButton = document.getElementById("buyNow"+i.toString());
                            productId.addEventListener("mouseover",()=>{
                                buyNowButton.style.display = "block";
                            });
                            productId.addEventListener("mouseout",()=>{
                                buyNowButton.style.display = "none";
                            });
                        }
                    }
                    //分類頁數
                    page.innerHTML = "";
                    for(let i=1;i<=womenMaxPage;i++){
                        let newPageNum = document.createElement("div");
                        newPageNum.className = "number";
                        newPageNum.id = "page"+i.toString();
                        newPageNum.textContent = i;
                        page.append(newPageNum);
                    }
                    //分類頁數加上連結
                    for(let i=1;i<=womenMaxPage;i++){
                        let pageNum = document.getElementById("page"+i.toString());
                        pageNum.addEventListener("click",()=>{
                            part.innerHTML = "";
                            pageNum.style.backgroundColor = "darkblue";
                            pageNum.style.color = "white";
                            
                            //劃出頁面商品
                            part.innerHTML = "";
                            let typeUrl = "/api/itemtype/"+i+"?gender=girl&type="+type;
                            fetch(typeUrl).then(res=>res.json()).then((jsonData)=>{
                                if(jsonData != null){
                                    womenMaxPage = jsonData["maxpage"];
                                    let part = document.querySelector(".part");
                                    for(let i=0;i<jsonData["data"].length;i++){
                                        let item = document.createElement("div");
                                        item.className = "item";
                                        item.id = "item"+i.toString();
                                        let link = document.createElement("a");
                                        link.href = "/item?id="+jsonData["data"][i]["id"];
                                        let image = document.createElement("img");
                                        image.src = jsonData["data"][i]["image"];
                                        let itemName = document.createElement("p");
                                        itemName.className = "item-name";
                                        itemName.id = "item"+i.toString();
                                        itemName.textContent = jsonData["data"][i]["name"];
                                        let price = document.createElement("p");
                                        price.className = "price";
                                        price.id = "price"+i.toString();
                                        price.textContent = jsonData["data"][i]["price"];
                                        let buyNow = document.createElement("div");
                                        buyNow.className = "buy-now";
                                        buyNow.id = "buyNow"+i.toString();
                                        buyNow.textContent = "立即購買";
                                        link.append(image);
                                        item.append(link);
                                        item.append(itemName);
                                        item.append(price);
                                        item.append(buyNow);
                                        part.append(item);
                                    }
                                    //商品進滑出效果
                                    if(part != ""){
                                        let startItem = 0;
                                        let endItem = 11;
                                        if(result["data"].length < 12){
                                            endItem = result["data"].length;
                                        }
                                        for(let i=0;i<endItem;i++){
                                            let productId = document.getElementById("item"+i.toString());
                                            let buyNowButton = document.getElementById("buyNow"+i.toString());
                                            productId.addEventListener("mouseover",()=>{
                                                buyNowButton.style.display = "block";
                                            });
                                            productId.addEventListener("mouseout",()=>{
                                                buyNowButton.style.display = "none";
                                            });
                                        }
                                    }
                                }
                            });
                            //更新當前頁數標記
                            for(let j=1;j<=womenMaxPage;j++){
                                if(i != j){
                                    let canclePage = document.getElementById("page"+j.toString());
                                    canclePage.style.backgroundColor = "white";
                                    canclePage.style.color = "black";
                                }
                            }
                        });
                        
                    }
                }
            });
        }
    });
    //補品專區
    let supply = document.querySelector(".supply");
    let supplyMaxPage = null;
    let brand = null;
    let supplyBtnPress = null;
    labelmouse(supply);
    supply.addEventListener("click",()=>{
        womenFlagPressed = null;
        if(supplyBtnPress == null){
            supplyBtnPress = true;
            if(brand == null){      //預設載入tryall
                part.innerHTML = "";
                newDepartItem("tryall");
            }  
            //將分類標籤換為補給品
            document.querySelector(".shirt").style.display = "none";
            document.querySelector(".jacket").style.display = "none";
            document.querySelector(".pant").style.display = "none";
            document.querySelector(".cap").style.display = "none";
            document.querySelector(".other").style.display = "none";
            document.querySelector(".tryall").style.display = "initial";
            document.querySelector(".mars").style.display = "initial";
            document.querySelector(".myprotein").style.display = "initial";
            document.querySelector(".on").style.display = "initial";
            document.querySelector(".protein-bar").style.display = "initial";
            
            for(let i=6;i<=10;i++){
                let partClothes = document.getElementById("part"+i.toString());
                partClothes.addEventListener("click",()=>{
                    if(i == 6){
                        brand = "tryall";
                    }else if(i == 7){
                        brand = "mars";
                    }else if(i == 8){
                        brand = "myprotein";
                    }else if(i == 9){
                        brand = "on";
                    }else{
                        brand = "all";
                    }
                    newDepartItem(brand);
                });
            }
            page.innerHTML = "";
            // console.log(supplyMaxPage);
            if(supplyMaxPage != null){
                firstPage(1,supplyMaxPage);
            }
        }
        //補給串接
        function newDepartItem(brand){
            //劃出頁面商品
            part.innerHTML = "";
            let typeUrl = "/api/itemtype/1?brand="+brand;
            fetch(typeUrl).then(res=>res.json()).then((jsonData)=>{
                if(jsonData != null){
                    supplyMaxPage = jsonData["maxpage"];
                    let part = document.querySelector(".part");
                    for(let i=0;i<jsonData["data"].length;i++){
                        let item = document.createElement("div");
                        item.className = "item";
                        item.id = "item"+i.toString();
                        let link = document.createElement("a");
                        link.href = "/item?id="+jsonData["data"][i]["id"];
                        let image = document.createElement("img");
                        image.src = jsonData["data"][i]["image"];
                        let itemName = document.createElement("p");
                        itemName.className = "item-name";
                        itemName.id = "item"+i.toString();
                        itemName.textContent = jsonData["data"][i]["name"];
                        let price = document.createElement("p");
                        price.className = "price";
                        price.id = "price"+i.toString();
                        price.textContent = jsonData["data"][i]["price"];
                        let buyNow = document.createElement("div");
                        buyNow.className = "buy-now";
                        buyNow.id = "buyNow"+i.toString();
                        buyNow.textContent = "立即購買";
                        link.append(image);
                        item.append(link);
                        item.append(itemName);
                        item.append(price);
                        item.append(buyNow);
                        part.append(item);
                    }
                    //串接每個商品連結
                    singleProduct();
                    //分類頁數
                    page.innerHTML = "";
                    for(let i=1;i<=supplyMaxPage;i++){
                        let newPageNum = document.createElement("div");
                        newPageNum.className = "number";
                        newPageNum.id = "page"+i.toString();
                        newPageNum.textContent = i;
                        page.append(newPageNum);
                    }
                    //分類頁數加上連結
                    for(let i=1;i<=supplyMaxPage;i++){
                        let pageNum = document.getElementById("page"+i.toString());
                        pageNum.addEventListener("click",()=>{
                            part.innerHTML = "";
                            pageNum.style.backgroundColor = "darkblue";
                            pageNum.style.color = "white";
                            
                            //劃出頁面商品
                            part.innerHTML = "";
                            let typeUrl = "/api/itemtype/"+i+"?brand="+brand;
                            fetch(typeUrl).then(res=>res.json()).then((jsonData)=>{
                                if(jsonData != null){
                                    supplyMaxPage = jsonData["maxpage"];
                                    let part = document.querySelector(".part");
                                    for(let i=0;i<jsonData["data"].length;i++){
                                        let item = document.createElement("div");
                                        item.className = "item";
                                        item.id = "item"+i.toString();
                                        let link = document.createElement("a");
                                        link.href = "/item?id="+jsonData["data"][i]["id"];
                                        let image = document.createElement("img");
                                        image.src = jsonData["data"][i]["image"];
                                        let itemName = document.createElement("p");
                                        itemName.className = "item-name";
                                        itemName.id = "item"+i.toString();
                                        itemName.textContent = jsonData["data"][i]["name"];
                                        let price = document.createElement("p");
                                        price.className = "price";
                                        price.id = "price"+i.toString();
                                        price.textContent = jsonData["data"][i]["price"];
                                        let buyNow = document.createElement("div");
                                        buyNow.className = "buy-now";
                                        buyNow.id = "buyNow"+i.toString();
                                        buyNow.textContent = "立即購買";
                                        link.append(image);
                                        item.append(link);
                                        item.append(itemName);
                                        item.append(price);
                                        item.append(buyNow);
                                        part.append(item);
                                    }
                                    //串接每個商品連結
                                    singleProduct();
                                }
                            });
                            //更新當前頁數標記
                            for(let j=1;j<=supplyMaxPage;j++){
                                if(i != j){
                                    let canclePage = document.getElementById("page"+j.toString());
                                    canclePage.style.backgroundColor = "white";
                                    canclePage.style.color = "black";
                                }
                            }
                        });
                        
                    }
                }
            });
        }
    })
    //分類標籤記號
    function labelmouse(p){
        p.addEventListener("mouseover",()=>{
            p.style.color = "darkblue";
        });
        p.addEventListener("mouseout",()=>{
            p.style.color = "rgb(94, 91, 91)";
        });
    }
}
//主頁關鍵字搜尋功能
let maxPage = null;
let keywordHistory = null;
function searchItem(num){
    let searchButton = document.querySelector(".search-button");
    searchButton.addEventListener("click",()=>{
        part.innerHTML = "";
        let keyword = document.querySelector(".search-spot").value;
        keywordHistory = keyword;
        let url = "/api/items/"+num+"?keyword="+keyword;
        fetch(url).then(res=>res.json()).then((jsonData)=>{
            if(jsonData["error"] == null){
                maxPage = jsonData["maxpage"];
                let part = document.querySelector(".part");
                for(let i=0;i<jsonData["data"].length;i++){
                    let item = document.createElement("div");
                    item.className = "item";
                    item.id = "item"+i.toString();
                    let link = document.createElement("a");
                    link.href = "http://www.google.com";
                    let image = document.createElement("img");
                    image.src = jsonData["data"][i]["image"];
                    let itemName = document.createElement("p");
                    itemName.className = "item-name";
                    itemName.id = "item"+i.toString();
                    itemName.textContent = jsonData["data"][i]["name"];
                    let price = document.createElement("p");
                    price.className = "price";
                    price.id = "price"+i.toString();
                    price.textContent = jsonData["data"][i]["price"];
                    let buyNow = document.createElement("div");
                    buyNow.className = "buy-now";
                    buyNow.id = "buyNow"+i.toString();
                    buyNow.textContent = "立即購買";
                    link.append(image);
                    item.append(link);
                    item.append(itemName);
                    item.append(price);
                    item.append(buyNow);
                    part.append(item);
                }
                singleProduct();
                //新增關鍵字搜尋頁碼
                keyWordSearchPage();
            }else{
                alert(jsonData["message"]);
            }
        });
    });

}


//新增關鍵字搜尋頁碼
function keyWordSearchPage(){
    let page = document.querySelector(".page");
    page.innerHTML = "";
    let pageStart = 1;
    let pageEnd = maxPage;
    for(let i=pageStart;i<=pageEnd;i++){
        let number = document.createElement("div");
        number.className = "number";
        number.id = "page"+i.toString();
        number.textContent = i;
        page.append(number);
    }
    //預設頁數為第一頁
    let firstPage = document.getElementById("page1");
    firstPage.style.backgroundColor = "darkblue";
    firstPage.style.color = "white";
    //
    
    let frontPage = document.querySelector(".front");
    let nextPage = document.querySelector(".next");
    frontPage.removeEventListener("click",frontPageButton);
    nextPage.removeEventListener("click",nextPageButton);

    for(let i=pageStart;i<=pageEnd;i++){
        let singlePage = document.getElementById("page"+i.toString());
        singlePage.addEventListener("click",()=>{
            singlePage.style.backgroundColor = "darkblue";
            singlePage.style.color = "white";
            part.innerHTML = "";
            //畫出畫面
            let url = "/api/items/"+i+"?keyword="+keywordHistory;
            fetch(url).then(res=>res.json()).then((jsonData)=>{
                if(jsonData != null){
                    maxPage = jsonData["maxpage"];
                    let part = document.querySelector(".part");
                    for(let i=0;i<jsonData["data"].length;i++){
                        let item = document.createElement("div");
                        item.className = "item";
                        item.id = "item"+i.toString();
                        let link = document.createElement("a");
                        link.href = "http://www.google.com";
                        let image = document.createElement("img");
                        image.src = jsonData["data"][i]["image"];
                        let itemName = document.createElement("p");
                        itemName.className = "item-name";
                        itemName.id = "item"+i.toString();
                        itemName.textContent = jsonData["data"][i]["name"];
                        let price = document.createElement("p");
                        price.className = "price";
                        price.id = "price"+i.toString();
                        price.textContent = jsonData["data"][i]["price"];
                        let buyNow = document.createElement("div");
                        buyNow.className = "buy-now";
                        buyNow.id = "buyNow"+i.toString();
                        buyNow.textContent = "立即購買";
                        link.append(image);
                        item.append(link);
                        item.append(itemName);
                        item.append(price);
                        item.append(buyNow);
                        part.append(item);
                    }
                    singleProduct();
                }
            });

            //取消選取頁數的舊紀錄
            for(let j =pageStart;j<=pageEnd;j++){
                if(j!=i){
                    let canclePage = document.getElementById("page"+j.toString());
                    canclePage.style.backgroundColor = "white";
                    canclePage.style.color = "black";
                }
            }
        });
    }
}
//關鍵字搜尋建議Search Bar
function searchBar(){
    let search = document.querySelector(".search-spot");
    let searchResult = document.querySelector(".instant-search-result-container");
    let dbAllData = [];

    search.addEventListener("keyup",(e)=>{      //及時抓取使用者輸入文字
        const searchStr = e.target.value.toUpperCase();
        const filterItem = dbAllData.filter((item) =>{
            return item.name.includes(searchStr);
        });
        displayItems(filterItem);
    });

    //拉出api所有資料
    const loadItems = async()=>{
        try {
            const response = await fetch("/api/searchbar");
            let data = await response.json();
            dbAllData = data["data"];
            // console.log(dbAllData);
        }catch (err){
            console.log(err);
        }
    }
    loadItems();

    const displayItems = (items) => {
        const htmlString = items.map((items)=>{
            return `
            <li>
                <a href="#" class="instant-search-result">${items.name}</a>
            </li>    
            `;
        }).join('');
        searchResult.innerHTML = htmlString;
        searchValueClick();
    }

    let searchValueClick = () => {
        let resultBar = document.getElementsByClassName("instant-search-result");
        let resultLength = resultBar.length;
        let clickValue = null;
        for(let i=0;i<resultLength;i++){
            resultBar[i].addEventListener("click",()=>{
                clickValue = resultBar[i].innerText;
                //尋找資料庫中對應的商品名稱
                let filterWithName = dbAllData.filter((item)=>{
                    return item.name.includes(clickValue);
                });
                let resultId = filterWithName[0]["id"]; //get user click result id
                location.href = "/item?id="+resultId;
            });
        }
        
        
    }
}


//串接單一商品連結頁面
function singleProduct(){
    if(part != ""){
        let startItem = 0;
        let endItem = 11;
        if(pageEnd <= 34){
            for(let i=0;i<=11;i++){
                let productId = document.getElementById("item"+i.toString());
                let buyNowButton = document.getElementById("buyNow"+i.toString());
                productId.addEventListener("mouseover",()=>{
                    buyNowButton.style.display = "block";
                });
                productId.addEventListener("mouseout",()=>{
                    buyNowButton.style.display = "none";
                });
            }
        }else{
            for(let i=0;i<=10;i++){
                let productId = document.getElementById("item"+i.toString());
                let buyNowButton = document.getElementById("buyNow"+i.toString());
                productId.addEventListener("mouseover",()=>{
                    buyNowButton.style.display = "block";
                });
                productId.addEventListener("mouseout",()=>{
                    buyNowButton.style.display = "none";
                });
            }
        }
        
    }
    
}


function init(){
    searchItem(1);
    searchBar();
    // PageSpot();
    // currentPage();
    defaultLoad(1);
    firstPage(pageStart,pageEnd);
}