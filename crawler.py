#使用selenium模擬使用者載入使js檔家載完成
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import bs4
import boto3
from werkzeug.utils import secure_filename
import mysql.connector

#mysql db
mydb = mysql.connector.connect(
    host = "yan-free-version.cv7r0cgdkgoj.us-east-2.rds.amazonaws.com",
    port = "3306",
    user = "Yanxr",
    password = "Bk55687ee1",
    database = "workoutsupply"
)
mycursor = mydb.cursor()

def simulateUser(url):
    #取消網頁載入時的彈出視窗
    options = Options()
    options.add_argument("--disable-notifications")
    #建立webdriver obj
    chrome = webdriver.Chrome("./chromedriver",chrome_options=options)
    chrome.get(url)
    time.sleep(4)

    # # chrome.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # SCROLL_PAUSE_TIME = 1.5
    # # Get scroll height
    # last_height = chrome.execute_script("return document.body.scrollHeight")
    # while True:
    #     # Scroll down to bottom
    #     chrome.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    #     # Wait to load page
    #     time.sleep(SCROLL_PAUSE_TIME)

    #     # Calculate new scroll height and compare with last scroll height
    #     new_height = chrome.execute_script("return document.body.scrollHeight")
    #     if new_height == last_height:
    #         break
    #     last_height = new_height

    #透過bs4解碼
    soup = bs4.BeautifulSoup(chrome.page_source,"html.parser")
    #關閉瀏覽器
    chrome.quit()

    return soup

#Tryall產品
tryall_url = "https://urmart.com"
tryallProduct = {
    "impactProtein":[],
    "isolateProtein":[]
}
# #Protien Impact(濃縮)
# urmart_impactProtein_url = "https://urmart.com/proteinshop/productList/39775"
# tryallRoot = simulateUser(urmart_impactProtein_url)
# #1.品名
# tryall_impactProtein_all_Name = tryallRoot.find_all("p",class_="ur-product-card__name")
# #2.價格
# tryall_impactProtein_all_Price = tryallRoot.find_all("span",class_="ur-product-price__new")
# #3.圖片
# tryall_impactProtein_all_Img = tryallRoot.find_all("div",class_="ur-product-card__img")
# #4.各商品詳細資訊URL
# tryall_product_details_url = tryallRoot.find_all("div",class_="ur-product-card")
# tryall_impact_single_details_url_list = []
# tryall_impact_single_details_list = []
# for url in tryall_product_details_url:
#     tryall_impact_single_details_url_list.append(tryall_url+url.a["href"])

# for i in range(len(tryall_impact_single_details_url_list)):
#     #各商品單一資訊
#     tryall_impact_singleRoot = simulateUser(tryall_impact_single_details_url_list[i])
#     tryall_impact_single_information = tryall_impact_singleRoot.find("section",class_="row ur-description")
#     tryall_impact_single_details_list.append(tryall_impact_single_information.div.text)

# for i in range(len(tryall_impactProtein_all_Name)):
#     name = tryall_impactProtein_all_Name[i].text
#     price = tryall_impactProtein_all_Price[i].text
#     imageData = tryall_impactProtein_all_Img[i].img["src"]
#     productDetails = tryall_impact_single_details_list[i]
#     data = {
#         "name":name,
#         "price":price,
#         "imageUrl":imageData,
#         "details":productDetails
#     }
#     tryallProduct["impactProtein"].append(data)

# #寫入資料庫
# for i in range(len(tryallProduct["impactProtein"])):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("tryall","impactProtein","all",tryallProduct["impactProtein"][i]["name"],tryallProduct["impactProtein"][i]["price"],
#     tryallProduct["impactProtein"][i]["imageUrl"],tryallProduct["impactProtein"][i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

# # Protein isolate(分離乳清)
# tryall_isolate_page = 3
# for num in range(1,tryall_isolate_page):
#     urmart_isolateProtein_url = "https://urmart.com/proteinshop/productList/39776?page="+str(num)
#     tryall_isolateRoot = simulateUser(urmart_isolateProtein_url)
#     #單一商品URL
#     tryall_isolate_url_list = []
#     tryall_isolate_all_url = tryall_isolateRoot.find_all("div",class_="ur-product-card")
#     for url in tryall_isolate_all_url:
#         tryall_isolate_url_list.append(tryall_url+url.a["href"])
#     #單一商品資訊
#     tryall_isolate_single_information = []
#     for i in range(len(tryall_isolate_url_list)):
#         tryall_isolate_single_root = simulateUser(tryall_isolate_url_list[i])
#         tryall_isolate_single_information.append(tryall_isolate_single_root.find("section",class_="row ur-description").div.text)

#     #品名
#     tryall_isolate_all_name = tryall_isolateRoot.find_all("p",class_="ur-product-card__name")
#     #價格
#     tryall_isolate_all_price = tryall_isolateRoot.find_all("span",class_="ur-product-price__new")
#     #圖片
#     tryall_isolate_all_img = tryall_isolateRoot.find_all("div",class_="ur-product-card__img")
    
#     for i in range(len(tryall_isolate_all_name)):
#         name = tryall_isolate_all_name[i].text
#         price = tryall_isolate_all_price[i].text
#         image = tryall_isolate_all_img[i].img["src"]
#         details = tryall_isolate_single_information[i]
#         data = {
#             "name":name,
#             "price":price,
#             "image":image,
#             "details":details
#         }
#         tryallProduct["isolateProtein"].append(data)
# #寫入資料庫aws rds
# for i in range(len(tryallProduct["isolateProtein"])):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("tryall","isolateprotein","all",tryallProduct["isolateProtein"][i]["name"],tryallProduct["isolateProtein"][i]["price"],
#     tryallProduct["isolateProtein"][i]["image"],tryallProduct["isolateProtein"][i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

# # Myprotein乳清系列
# myproteinList = []

# myprotein_url = "https://urmart.com/proteinshop/productList/35113"
# mpRoot = simulateUser(myprotein_url)
# mp_all_proteinName = mpRoot.find_all("p",class_="ur-product-card__name")
# mp_all_proteinPrice = mpRoot.find_all("span",class_="ur-product-price__new")
# mp_all_proteinImage = mpRoot.find_all("div",class_="ur-product-card__img")
# mp_all_singleUrl = mpRoot.find_all("div",class_="ur-product-card")

# mp_single_detailsList = []
# for i in range(len(mp_all_singleUrl)):
#     mp_singleRoot = simulateUser(tryall_url+mp_all_singleUrl[i].a["href"])
#     mp_all_single_details = mp_singleRoot.find("section",class_="row ur-description")
#     mp_single_detailsList.append(mp_all_single_details.div.text)

# for i in range(len(mp_all_proteinName)):
#     mp_name = mp_all_proteinName[i].text
#     mp_price = mp_all_proteinPrice[i].text
#     mp_imageUrl = mp_all_proteinImage[i].img["data-src"]
#     mp_product_details = mp_single_detailsList[i]
#     data = {
#         "name":mp_name,
#         "price":mp_price,
#         "image":mp_imageUrl,
#         "details":mp_product_details
#     }
#     myproteinList.append(data)

# for i in range(len(myproteinList)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("myprotein","impactprotein","all",myproteinList[i]["name"],myproteinList[i]["price"],myproteinList[i]["image"],
#     myproteinList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

# #on乳清系列
# on_productList = []
# on_url = "https://urmart.com/proteinshop/productList/32190?page=1"
# onRoot = simulateUser(on_url)
# on_all_name = onRoot.find_all("p",class_="ur-product-card__name")
# on_all_price = onRoot.find_all("span",class_="ur-product-price__new")
# on_all_image = onRoot.find_all("div",class_="ur-product-card__img")
# on_all_single_product_url = onRoot.find_all("div",class_="ur-product-card")
# on_all_single_detailsList = []
# for url in on_all_single_product_url:
#     on_singleRoot = simulateUser(tryall_url+url.a["href"])
#     singleData = on_singleRoot.find("section",class_="row ur-description").div.text
#     on_all_single_detailsList.append(singleData)

# for i in range(len(on_all_name)):
#     name = on_all_name[i].text
#     price = on_all_price[i].text
#     image = on_all_image[i].img["data-src"]
#     details = on_all_single_detailsList[i]
#     data = {
#         "name":name,
#         "price":price,
#         "image":image,
#         "details":details
#     }
#     on_productList.append(data)

# for i in range(len(on_all_name)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("on","impactprotein","all",on_productList[i]["name"],on_productList[i]["price"],on_productList[i]["image"],
#     on_productList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

# #mars乳清系列
# marsProductList = []
# mars_url = "https://urmart.com/proteinshop/productList/32225"
# marsRoot = simulateUser(mars_url)
# mars_all_name = marsRoot.find_all("p",class_="ur-product-card__name")
# mars_all_price = marsRoot.find_all("span",class_="ur-product-price__new")
# mars_all_image = marsRoot.find_all("div",class_="ur-product-card__img")
# mars_all_single_url = marsRoot.find_all("div",class_="ur-product-card")
# mars_single_details = []
# for i in range(len(mars_all_single_url)):
#     mars_singleRoot = simulateUser(tryall_url+mars_all_single_url[i].a["href"])
#     mars_all_details = mars_singleRoot.find("section",class_="row ur-description").div.text
#     mars_single_details.append(mars_all_details)
# for i in range(len(mars_all_name)):
#     name = mars_all_name[i].text
#     price = mars_all_price[i].text
#     image = mars_all_image[i].img["data-src"]
#     details = mars_single_details[i]
#     data = {
#         "name":name,
#         "price":price,
#         "image":image,
#         "details":details
#     }
#     marsProductList.append(data)

# for i in range(len(marsProductList)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("mars","impactprotein","all",marsProductList[i]["name"],marsProductList[i]["price"],marsProductList[i]["image"],
#     marsProductList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()
    
# #蛋白棒
# proteinBarList = []
# for page in range(1,3):
#     proteinBar_url = "https://urmart.com/proteinshop/productList/4238?page="+str(page)
#     proteinBarRoot = simulateUser(proteinBar_url)
#     proteinBar_all_name = proteinBarRoot.find_all("p",class_="ur-product-card__name")
#     proteinBar_all_price = proteinBarRoot.find_all("span",class_="ur-product-price__new")
#     proteinBar_all_image = proteinBarRoot.find_all("div",class_="ur-product-card__img")
#     proteinBar_all_single_url = proteinBarRoot.find_all("div",class_="ur-product-card")

#     proteinBar_single_detailsList = []
#     for url in proteinBar_all_single_url:
#         singleRoot = simulateUser(tryall_url+url.a["href"])
#         proteinBar_single_all_details = singleRoot.find("section",class_="row ur-description").div.text
#         proteinBar_single_detailsList.append(proteinBar_single_all_details)
#     for i in range(len(proteinBar_all_name)):
#         name = proteinBar_all_name[i].text
#         price = proteinBar_all_price[i].text
#         image = proteinBar_all_image[i].img["data-src"]
#         details = proteinBar_single_detailsList[i]
#         data = {
#             "name":name,
#             "price":price,
#             "image":image,
#             "details":details
#         }
#         proteinBarList.append(data)

# for i in range(len(proteinBarList)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("all","proteinbar","all",proteinBarList[i]["name"],proteinBarList[i]["price"],
#     proteinBarList[i]["image"],proteinBarList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

# #搖搖杯
# ur_bottleProductList = []
# for page in range(1,3):
#     ur_bottleUrl = "https://urmart.com/proteinshop/productList/36344?page="+str(page)
#     bottleRoot = simulateUser(ur_bottleUrl)
#     all_bottle_name = bottleRoot.find_all("p",class_="ur-product-card__name")
#     all_bottle_price  = bottleRoot.find_all("span",class_="ur-product-price__new")
#     all_bottle_image = bottleRoot.find_all("div",class_="ur-product-card__img")
#     all_bottle_details_url  = bottleRoot.find_all("div",class_="ur-product-card")

#     bottle_single_detailsList = []
#     for url in all_bottle_details_url:
#         singleRoot = simulateUser(tryall_url+url.a["href"])
#         bottle_single_all_details = singleRoot.find("section",class_="row ur-description").div.text
#         bottle_single_detailsList.append(bottle_single_all_details)
#     for i in range(len(all_bottle_name)):
#         name = all_bottle_name[i].text
#         price = all_bottle_price[i].text
#         image = all_bottle_image[i].img["data-src"]
#         details = bottle_single_detailsList[i]
#         data = {
#             "name":name,
#             "price":price,
#             "image":image,
#             "details":details
#         }
#         ur_bottleProductList.append(data)

# for i in range(len(ur_bottleProductList)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("blenderbottle","bottle","all",ur_bottleProductList[i]["name"],ur_bottleProductList[i]["price"],
#     ur_bottleProductList[i]["image"],ur_bottleProductList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()


# Under Armour系列
# ua_url = "https://www.underarmour.tw"

# #project rock
# rockProductList = []
# rock_url = "https://www.underarmour.tw/cwomens-accessories-headwear/#11|Womens|Accessories|Headwear|3-WomensCategory"
# rockRoot = simulateUser(rock_url)
# rock_all_name = rockRoot.find_all("img",class_="img-face")
# rock_all_price = rockRoot.find_all("p",class_="good-price")
# rock_all_single_url = rockRoot.find_all("div",class_="pro-img-in")

# rock_single_detailsList = []
# rock_all_imageList = []
# for url in rock_all_single_url:
#     singleRoot = simulateUser(ua_url+url.ul.li.a["href"])
#     rock_single_details = singleRoot.find("div",class_="descr-text").div.text
#     rock_single_detailsList.append(rock_single_details)
#     rock_all_image = singleRoot.find("div",class_="scroll-background-image").a.img["src"]
#     rock_all_imageList.append(rock_all_image)
# for i in range(len(rock_single_detailsList)):
#     name = rock_all_name[i]["alt"]
#     price = rock_all_price[i].text
#     image = rock_all_imageList[i]
#     details = rock_single_detailsList[i]
#     data = {
#         "name":name,
#         "price":price,
#         "image":image,
#         "details":details
#     }
#     rockProductList.append(data)

# for i in range(len(rockProductList)):
#     sql = "insert into item(brand,type,gender,name,price,image,details) values(%s,%s,%s,%s,%s,%s,%s)"
#     val = ("underArmour","cap","girl",rockProductList[i]["name"],rockProductList[i]["price"],
#     rockProductList[i]["image"],rockProductList[i]["details"])
#     mycursor.execute(sql,val)
#     mydb.commit()

