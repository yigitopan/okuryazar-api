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
|-------------------|:---------------:|
| sozcu             | gundem          |
| takvim            | dunya           |
| milliyet          | ekonomi         |
| cumhuriyet        | spor            |

| URL                                                              | Purpose                                                                            |
| -----------------------------------------------------------------|:----------------------------------------------------------------------------------:|
| http://inf303.herokuapp.com/okuryazar-api/get/news/all           | gets all news saved in DB from 4 newspapers in last 3 days.                        |
| http://inf303.herokuapp.com/okuryazar-api/get/articles/all       | gets all articles with authors saved in DB from 4 newspapers in last 3 days.       |
| http://inf303.herokuapp.com/okuryazar-api/get/both/$NEWSPAPER    | gets all news & articles saved in DB from a specific newspaper.                    |
| http://inf303.herokuapp.com/okuryazar-api/search/$QUERY          | gets all news & articles that includes query within title or context               |
| http://inf303.herokuapp.com/okuryazar-api/get/category/$CATEGORY | gets all news of a specific category saved in DB from 4 newspapers in last 3 days. |





 
 Structure:
 ![alt text](https://i.hizliresim.com/b098ftl.png)
