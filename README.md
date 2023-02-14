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
http://inf303.herokuapp.com/okuryazar-api/search/ingiltere+futbol



Response:
```json
[
  {
    "title": "Saha buz tuttu, Chelsea-Liverpool maçı ertelendi",
    "date": "2023-01-22T00:00:00.000Z",
    "img_url": "https://i.sozcucdn.com/wp-content/uploads/2023/01/22/2023-01-22t125733z_1662644420_up1ej1m0zzvfc_rtrmadp_3_soccer-england-che-liv-report.jpeg?w=776&h=436&mode=crop",
    "context": "İngiltere Kadınlar Süper Lig’de Chelsea ile Liverpool arasındaki karşılaşma, sahanın donması nedeniyle ertelendi.Ligin 12. haftasında lider Chelsea’nin, başkent Londra’daki Kingsmeadow Stadı’nda Liverpool’u konuk ettiği karşılaşma, kötü hava koşullarının ardından sahanın buz tutması nedeniyle 6. dakikada yarıda kaldı.Fotoğraf: Reuters.İngiltere Futbol Federasyonu, oyuncu sağlığının ön planda tutulması nedeniyle hakemin maçı erteleme yönünde karar aldığını vurguladı.Karşılaşma, federasyonun duyuracağı ileri bir tarihte oynanacak. (AA)Fotoğraf: Reuters.Fotoğraf: Reuters.",
    "spot": "Liverpool ve Chelsea kadın futbol takımları arasındaki maç, sahanın buz tutması nedeniyle ileri bir tarihe ertelendi.",
    "author_name": null,
    "newspaper_id": 1,
    "category_name": "Spor"
  },
  {
    "title": "2022 Dünya Kupası çeyrek final maçında Hırvatistan, Brezilya'yı penaltı atışlarında eleyerek yarı finale yükseldi",
    "date": "2022-09-12T00:00:00.000Z",
    "img_url": "https://iatkv.tmgrup.com.tr/8d9717/616/321/0/0/960/500?u=https%3a%2f%2fitkv.tmgrup.com.tr%2f2022%2f12%2f09%2f2022-dunya-kupasi-ceyrek-final-macinda-hirvatistan-brezilyayi-penalti-atislarinda-eleyerek-yari-finale-yukseld-1670609529815.jpg",
    "context": "2022 FIFA Dünya Kupası çeyrek final maçında Hırvatistan, Brezilya'yı penaltılar sonucu 4-2 mağlup ederek yarı finale çıkan ilk takım oldu.Katar Education City Stadı'nda Brezilya ile Hırvatistan karşı karşıya geldi.İngiltere Futbol Federasyonu'ndan Michael Oliver'ın düdük çaldığı karşılaşmanın normal süresi 0-0 bitti. Uzatmalara giden karşılaşmada 105+1'inci dakikada Brezilya Neymar ile öne geçmeyi başardı.Ancak Hırvatistan 117'nci dakikada Petkovic ile Neymar'a cevap vererek karşılaşmayı penaltılara taşımayı başardı. Seri penaltı atışları sonrası Hırvatistan, Brezilya'yı 4-2'lik skor ile mağlup etti.Hırvatistan'da Vlasic, Majer, Modric ve Orsic penaltıları değerlendirirken; Brezilya'da ise Casemiro ve Pedro fileleri havalandırdı, Rodrygo ve Marquinhos ise penaltıdan yararlanamadı. Bu sonucun ardından Hırvatistan, Dünya Kupası'nda yarı finale yükselen takım oldu.NEYMAR, PELE'NİN REKORUNA ORTAK\nUzatma devresinde 1-1 berabere kalarak seri penaltı atışları sonrası yarı finalisti belirlenen karşılaşmada Neymar, takımının 105'inci dakikada tek golünü atarak Brezilya tarihinin en golcü futbolcusu olan Pele'nin rekoruna ortak oldu. 30 yaşındaki oyuncu, uzatma devresinde Hırvatistan'a attığı gol ile toplam 77 gole ulaşarak Pele'yi yakaladı.PENALTI ATIŞLARI\nHırvatistan'da Vlasic, Majer, Modric ve Orsic topu ağlara gönderdi. Brezilya'da ise Casemiro ile Pedro fileleri havalandırırken, Rodrygo ve Marquinhos ise penaltı atışından faydalanamadı.Brezilya'ya penaltılarda 4-2 üstünlük kuran Hırvatistan, adını yarı finale yazdırdı.Rusya 2018'in ikincisi Hırvatistan, yarı finalde Hollanda-Arjantin eşleşmesinin galibiyle kozlarını paylaşacak.Favorisi olarak gösterildiği turnuvaya çeyrek finalde veda eden Brezilya ise taraftarına büyük üzüntü yaşattı.LİVAKOVİC'DEN KRİTİK KURTARIŞLAR\nHırvatistan'ın kalecisi Dominik Livakovic, ikinci yarıda yaptığı önemli kurtarışlarla takımının yarı finale çıkmasında başrol üstlendi.Livakovic, Brezilya'nın 47, 55, 66 ve 76. dakikada geliştirdiği ataklarda kalesinde devleşerek gole izin vermedi.Penaltılarda da bir kurtarışa imza atan Livakovic, maçın en değerli oyuncusu seçildi.Livakovic, Hırvatistan'ın Japonya'ya üstünlük sağladığı son 16 turunda da seri penaltı atışlarında 3 kurtarış yapmış ve takımının çeyrek finale çıkmasını sağlamıştı.MAÇTAN DAKİKALAR\n5' Sol çaprazda kontrol ettiği top sonrası kaleye yönelen Vinicius'un sert şutunda top Livakovic'te kaldı.13' Boş alanı iyi değerlendiren Juranovic, sürdüğü topu boş durumdaki Pasalic'e aktardı. Pasalic'in ceza sahasına yaptığı ortaya hareketlenen Perisic'in dokunduğu top auta çıktı.20' Sol kulvarı etkili kullanan Vinicius, Richarlison'la yaptığı duvar pası sonrası kaleye yakın mesafeden şutunu attı, Gvardiol'dan seken top sonrası Brezilya atağı devam etti. Neymar'ın şutunda kaleci Livakovic, rahat bir şekilde topun kontrolünü sağladı.İlk 45 dakikada eşitlik bozulmadı.54' Richarlison harika döndü, rakibinden şık sıyrıldı, derin topu yolladı, Neymar ceza alanı sol çaprazından vurdu ancak kaleci Livakovic'i geçemedi.66' Neymar'ın sol kanattan içeri çevirdiği topa koşu yapan Paqueta, Hırvatistan savunmasının hatasıyla kaleye çok yakın mesafede topla buluştu. Yıldız oyuncunun vuruşunda kalesinde devleşen Livakovic, topun son anda kurtardı.85' Hırvatistan kalesine yüklenen Brezilya, tehlikeli geldi. Oluşan karambol sonrası ceza sahasında Militao'nun şutunda top auta çıktı.",
    "spot": "Son dakika Dünya Kupası haberleri! 2022 Dünya Kupası çeyrek final maçında Hırvatistan ile Brezilya karşı karşıya geldi. Dengeli bir oyunun sergilendiği karşılaşmada 90 dakikada gol sesi çıkmayınca maç uzatmalara gitti. Uzatmalarda 105. dakikada Neymar ile 1-0 öne geçen Sambacılara, 116. dakikada Hırvatlar, Petkovic karşılık verdi. Penatılara giden karşılaşmada gülen taraf Hırvatistan oldu.",
    "author_name": null,
    "newspaper_id": 3,
    "category_name": "Spor"
  }
]
```


 
 Structure:
 ![alt text](https://i.hizliresim.com/b098ftl.png)
