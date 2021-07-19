let express = require("express");
//連接mysql DB
let mysql = require("mysql");
let pool = mysql.createPool({
    connectionLimit : 4,
    host            : "yan-free-version.cv7r0cgdkgoj.us-east-2.rds.amazonaws.com",
    user            : "Yanxr",
    password        : "Bk55687ee1",
    database        : "workoutsupply"
})

let app = express();
app.use(express.static("public"));
app.use(express.static('files'));
app.use('/static', express.static('public'));

// app.use(express.json()); 

app.get("/",(req,res)=>{
    res.render('index');
});
app.get("/item",(req,res)=>{
    res.sendFile(__dirname + "/public/item.html");
});

app.get("/api/items/:page",(req,res)=>{
    let page = req.params.page;
    let nextPage = Number(page)+1;
    let keyword = req.query["keyword"];
    let type = null;
    if(page != null && keyword == null){
        if(page <=17){
            type = "clothes";
        }else if(page == 18){
            type = "clothes done with 215";
        }else{
            type = "supply";
            if(page == 36){
                nextPage = null;
            }
        }
        let jsondata = {
            "nextPage":nextPage,
            "type":type,
            "data":[]
        };
        let firstId = null;
        let secondId = null;
        if(page == 1){
            let sql = "select * from item where id<=12";
            pool.query(sql,(err,result,fields)=>{
                if (err) throw err;
                for(let i=0;i<result.length;i++){
                    let id = result[i]["id"];
                    let brand = result[i]["brand"];
                    let type = result[i]["type"];
                    let gender = result[i]["gender"];
                    let name = result[i]["name"];
                    let price = result[i]["price"];
                    let imageUrl = result[i]["image"];
                    let details = result[i]["details"];
                    let data = {
                        "id":id,
                        "brand":brand,
                        "type":type,
                        "gender":gender,
                        "name":name,
                        "price":price,
                        "image":imageUrl,
                        "details":details
                    };
                    jsondata["data"].push(data);
                };
                res.send(jsondata);
            });
        }else if(page > 1){
            firstId = ((page-1)*12)+1;
            secondId = firstId+11;
            let sql = "select * from item where id>="+firstId+" and id<="+secondId;
            pool.query(sql,(err,result,fields)=>{
                if (err) throw err;
                if(result != ""){
                    for(let i=0;i<result.length;i++){
                        let id = result[i]["id"];
                        let brand = result[i]["brand"];
                        let type = result[i]["type"];
                        let gender = result[i]["gender"];
                        let name = result[i]["name"];
                        let price = result[i]["price"];
                        let imageUrl = result[i]["image"];
                        let details = result[i]["details"];
                        let data = {
                            "id":id,
                            "brand":brand,
                            "type":type,
                            "gender":gender,
                            "name":name,
                            "price":price,
                            "image":imageUrl,
                            "details":details
                        };
                        jsondata["data"].push(data);
                    };
                    res.send(jsondata);
                }else{
                    let data = {
                        "error":true,
                        "message":"已顯示完所有資料"
                    }
                    res.send(data);
                }
            });
        }else{
            let data = {
                "error":true,
                "message":"沒有此頁資料"
            }
            res.send(data);
        }
    }else if(page != null && keyword != null){
        let jsondata = {
            "maxpage":null,
            "nextPage":Number(page)+1,
            "data":[]
        };
        let sql = "select * from item where name like '%"+keyword+"%'"
        pool.query(sql, (err,result,fields)=>{
            if (err) throw err;
            if(result != ""){
                let myDataLength = result.length;
                let maxPage = Math.ceil(myDataLength/12);
                jsondata["maxpage"] = maxPage;
                if(page == 1){
                    let num = result.length;
                    if(num <= 12){
                        jsondata["nextPage"] = null;
                    }else{
                        num = 12;
                    }
                    for(let i=0;i<num;i++){
                        let id = result[i]["id"];
                        let brand = result[i]["brand"];
                        let type = result[i]["type"];
                        let gender = result[i]["gender"];
                        let name = result[i]["name"];
                        let price = result[i]["price"];
                        let imageUrl = result[i]["image"];
                        let details = result[i]["details"];
                        let data = {
                            "id":id,
                            "brand":brand,
                            "type":type,
                            "gender":gender,
                            "name":name,
                            "price":price,
                            "image":imageUrl,
                            "details":details
                        };
                        jsondata["data"].push(data);
                    };
                    res.send(jsondata);
                }else if(page > 0){
                    let startNum = (Number(page)-1)*12;
                    let endNum = startNum+12;
                    if(result.length < endNum){
                        endNum = result.length;
                        jsondata["nextPage"] = null;
                    }
                    for(let i=startNum;i<endNum;i++){
                        let id = result[i]["id"];
                        let brand = result[i]["brand"];
                        let type = result[i]["type"];
                        let gender = result[i]["gender"];
                        let name = result[i]["name"];
                        let price = result[i]["price"];
                        let imageUrl = result[i]["image"];
                        let details = result[i]["details"];
                        let data = {
                            "id":id,
                            "brand":brand,
                            "type":type,
                            "gender":gender,
                            "name":name,
                            "price":price,
                            "image":imageUrl,
                            "details":details
                        };
                        jsondata["data"].push(data);
                    };
                    res.send(jsondata)
                }else{
                    let data = {
                        "error":true,
                        "message":"沒有此頁數"
                    }
                    res.send(data);
                }
            }else{
                let data = {
                    "error":true,
                    "message":"沒有搜尋資料"
                }
                res.send(data);
            }
        });
    }else{
        let data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.send(data);
    }
});

app.get("/api/product/:itemId",(req,res)=>{
    let id = req.params.itemId;
    if(id > 0 && id <= 431){
        sql = "select * from item where id = "+id.toString()+" limit 1";
        pool.query(sql,(err,result,fields)=>{
            if (err) throw err;
            if(result){
                let id = result[0]["id"];
                let brand = result[0]["brand"];
                let type = result[0]["type"];
                let gender = result[0]["gender"];
                let name = result[0]["name"];
                let price = result[0]["price"];
                let imageUrl = result[0]["image"];
                let details = result[0]["details"];
                let data = {
                    "id":id,
                    "brand":brand,
                    "type":type,
                    "gender":gender,
                    "name":name,
                    "price":price,
                    "image":imageUrl,
                    "details":details
                };
                res.send(data);
            }
        });
    }else{
        let data = {
            "error":true,
            "message":"沒有此商品編號"
        }
        res.send(data);
    }
});

app.get("/api/itemtype/:page",(req,res)=>{
    let page = req.params.page;
    let gender = req.query["gender"];
    let type = req.query["type"];
    let brand = req.query["brand"];
    let jsonData = {
        "maxpage":null,
        "nextpage":null,
        "data":[]
    }
    if(page != null  && type != null && (gender === "man" || gender === "girl")){
        let sql = "select * from item where gender = "+'"'+gender+'"'+" and type = "+'"'+type+'"';
        pool.query(sql,(err,result,fields)=>{
            if (err) throw err;
            if(result){
                jsonData["maxpage"] = Math.ceil(result.length/12);
                let startNum = null;
                let endNum = Number(page-1)*12;
                if((result.length+1) > endNum){
                    if(page <= 1){
                        startNum = 0;
                        if(result.length < 12){
                            endNum = result.length;
                        }else{
                            endNum = 12;
                            jsonData["nextpage"] = Number(page)+1;
                        }
                    }else{
                        startNum = Number(page-1)*12;
                        if(result.length < startNum+12){
                            endNum = result.length;
                        }else{
                            endNum = startNum+12;
                            jsonData["nextpage"] = Number(page)+1;
                        }
                    }
                    for(let i=startNum;i<endNum;i++){
                        let id = result[i]["id"];
                        let brand = result[i]["brand"];
                        let type = result[i]["type"];
                        let gender = result[i]["gender"];
                        let name = result[i]["name"];
                        let price = result[i]["price"];
                        let imageUrl = result[i]["image"];
                        let details = result[i]["details"];
                        let data = {
                            "id":id,
                            "brand":brand,
                            "type":type,
                            "gender":gender,
                            "name":name,
                            "price":price,
                            "image":imageUrl,
                            "details":details
                        };
                        jsonData["data"].push(data);
                    };
                    res.send(jsonData);
                }else{
                    res.send({"error":true,"message":"超過資料頁數"});
                }
            }else{
                res.send({"error":true,"message":"無此商品"});
            }
        });
    }else if(brand != null && page != null){
        sql = "select * from item where brand = "+"'"+brand+"'";
        pool.query(sql,(err,result,fields)=>{
            if(err) throw err;
            if(result){
                let myDataLength = result.length;
                jsonData["maxpage"] = Math.ceil(myDataLength/12);
                let startNum = null;
                let endNum = null;
                page = Number(page);
                if(page <= 1){
                    startNum = 0;
                    endNum = 11;
                    if(myDataLength <= endNum){
                        endNum = myDataLength;
                        jsonData["nextpage"] = null;
                    }else{
                        jsonData["nextpage"] = page+1;
                    }
                }else if(page > 1){
                    startNum = (page-1)*12;
                    endNum = startNum+11;
                    if(myDataLength+11 > endNum){
                        if((myDataLength-1) <= endNum){
                            endNum = myDataLength-1;
                            jsonData["nextpage"] = null;
                        }else{
                            jsonData["nextpage"] = page+1;
                        }
                    }else{
                        let data = {
                            "error":true,
                            "message":"超過資料總頁數"
                        }
                        res.send(data);
                    }
                }
                for(let i=startNum;i<=endNum;i++){
                    let id = result[i]["id"];
                    let brand = result[i]["brand"];
                    let type = result[i]["type"];
                    let gender = result[i]["gender"];
                    let name = result[i]["name"];
                    let price = result[i]["price"];
                    let imageUrl = result[i]["image"];
                    let details = result[i]["details"];
                    let data = {
                        "id":id,
                        "brand":brand,
                        "type":type,
                        "gender":gender,
                        "name":name,
                        "price":price,
                        "image":imageUrl,
                        "details":details
                    };
                    jsonData["data"].push(data);
                };
                res.send(jsonData);
            }else{
                let data = {
                    "error":true,
                    "message":"沒有搜尋結果"
                }
            }
        });

    }else{
        let data = {
            "error":true,
            "message":"伺服器錯誤"
        }
        res.send(data);
    }
    
});

app.get("/api/searchbar",(req,res)=>{
    let jsonData = {
        "message":"allData",
        "data":[]
    }
    let sql = "select * from item";
    pool.query(sql,(err,result,fields)=>{
        if (err) throw err;
        if (result){
            for(let i=0;i<=430;i++){
                let id = result[i]["id"];
                let brand = result[i]["brand"];
                let type = result[i]["type"];
                let gender = result[i]["gender"];
                let name = result[i]["name"];
                let price = result[i]["price"];
                let imageUrl = result[i]["image"];
                let details = result[i]["details"];
                let data = {
                    "id":id,
                    "brand":brand,
                    "type":type,
                    "gender":gender,
                    "name":name,
                    "price":price,
                    "image":imageUrl,
                    "details":details
                };
                jsonData["data"].push(data);
            }
            res.send(jsonData);
        }
    });
});

app.use(require('body-parser').json());
app.post("/signup",(req,res)=>{
    if(req.method == "POST"){
        let name = req.body["name"];
        let account = req.body["account"];
        let password = req.body["password"];
        if(name && account && password){
            let sql = "insert into menbersystem (username,email,password,image) values("+name+","+account+","+password+","+" "+")";
            pool.query(sql,(err,result,fields)=>{
                if(err) throw err;
            });
            
        }
        res.send({
            "ok":true,
            "message":"success"
        });
    }
    
});
app.listen(3000,function(){
    console.log("Server Started");
});