<div align="center">
<img src="https://raw.githubusercontent.com/yigitopan/okuryazar-client/main/src/assets/okuryazar-logo.svg" width="125"  /><img src="https://i.hizliresim.com/rbtotp9.png" width="125"  />
</div>

### Now online at [okuryazar.dev](https://www.okuryazar.dev)!
Open-source bundle API for turkish news. This repository serves to the back-end of the project. For client side, [click here](https://github.com/yigitopan/okuryazar-client)

<div align="center">
  <div align="center">
    <div align="center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/800px-Typescript_logo_2020.svg.png" width="80" />
      &nbsp;
      &nbsp;
    </div>
    <img src="https://i.hizliresim.com/xy973c2.png" width="120"  /><img src="https://i.hizliresim.com/szaiypi.png" width="110"  />
  </div>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png" width="100"  /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2048px-Tailwind_CSS_Logo.svg.png" width="100"  /><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1985px-Postgresql_elephant.svg.png" width="100"  />
</div>
  

# Okuryazar API <br>
An API designed to be used in a potential bundle application, which stores news and columns in Turkish newspapers in SQL database. <br><br>
Currently supported newspapers: Cumhuriyet, Takvim, Sözcü, Milliyet

Endpoints:

| Newspaper params  | Category params |
|:-----------------:|:---------------:|
| sozcu             | gundem          |
| takvim            | dunya           |
| milliyet          | ekonomi         |
| cumhuriyet        | spor            |

| URL                                                              | Purpose                                                                            |
| -----------------------------------------------------------------|------------------------------------------------------------------------------------|
| http://inf303.herokuapp.com/okuryazar-api/get/news/all           | retrieves all news saved in DB from 4 newspapers in last 3 days.                   |
| http://inf303.herokuapp.com/okuryazar-api/get/articles/all       | retrieves all articles with authors saved in DB from 4 newspapers in last 3 days.  |
| http://inf303.herokuapp.com/okuryazar-api/get/both/$NEWSPAPER    | retrieves all news & articles from a specific newspaper in last 3 days.            |
| http://inf303.herokuapp.com/okuryazar-api/search/$QUERY          | retrieves all news and articles that contain the query in the title or context.    |
| http://inf303.herokuapp.com/okuryazar-api/get/category/$CATEGORY | retrieves all news of a specific category from 4 newspapers in last 3 days.        |

The search query can contain special characters. Spaces must be separated by the + symbol. For example:
http://inf303.herokuapp.com/okuryazar-api/search/england+soccer



Response:
```json
[
  {
    "title":"Saha buz tuttu, Chelsea-Liverpool maçı ertelendi",
    "date":"2023-01-22T00:00:00.000Z",
    "img_url":"https://i.sozcucdn.com/wp-content/uploads/2023/01/22/2023-01-22t125733z_1662644420_up1ej1m0zzvfc_rtrmadp_3_soccer-england-che-liv-report.jpeg?w=776&h=436&mode=crop",
    "context":"İngiltere Kadınlar Süper Lig’de Chelsea ile Liverpool arasındaki karşılaşma, sahanın donması nedeniyle ertelendi.Ligin 12. haftasında lider Chelsea’nin, başkent Londra’daki Kingsmeadow Stadı’nda Liverpool’u konuk ettiği karşılaşma, kötü hava koşullarının ardından sahanın buz tutması nedeniyle 6. dakikada yarıda kaldı.Fotoğraf: Reuters.İngiltere Futbol Federasyonu, oyuncu sağlığının ön planda tutulması nedeniyle hakemin maçı erteleme yönünde karar aldığını vurguladı.Karşılaşma, federasyonun duyuracağı ileri bir tarihte oynanacak. (AA)Fotoğraf: Reuters.Fotoğraf: Reuters.",
    "spot":"Liverpool ve Chelsea kadın futbol takımları arasındaki maç, sahanın buz tutması nedeniyle ileri bir tarihe ertelendi.",
    "author_name":null,
    "newspaper_id":1,
    "category_name":"Spor"
  }
]
```


 
 Structure:
 ![alt text](https://i.hizliresim.com/b098ftl.png)
