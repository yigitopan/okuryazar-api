import { RequestHandler } from "express";
import { clientPG } from "../db";
import fetch from "isomorphic-fetch";
import cheerio from "cheerio";
import { Article } from "../models/article";
import { Console } from "console";

const newspapers = ["Sözcü", "Milliyet", "Takvim", "Cumhuriyet"]

var report = {
    alreadyexists:0,
    added:0
}  

const checkAuthor = async(articleObj: Article) => {
    const checkAuthor = `SELECT EXISTS (SELECT author_name FROM authors WHERE author_name LIKE '${articleObj.authorName}') AS author_exist; `

    try {
        const authorExists = await clientPG.query(checkAuthor)
        const authorExistsResult = await authorExists.rows[0].author_exist

        if(authorExistsResult === false) {
            const text = 'INSERT INTO authors(author_name, img_url) VALUES($1, $2) RETURNING *'

            const values = [
                articleObj.authorName,
                articleObj.image
            ] 
            const res = await clientPG.query(text, values)
            await pushArticlesToDb(articleObj)
            
        }
        else {
            await pushArticlesToDb(articleObj)
        }
    } 
    catch (error) {
        console.log(error);
    }
}

const pushArticlesToDb = async(articleObj: Article) => {
    const search = articleObj.title.replaceAll("'","''")
    const check = `SELECT EXISTS (SELECT article_id FROM articles WHERE title LIKE '${search}') AS it_does_exist; `
    const text = 'INSERT INTO articles(title, date, context, newspaper_id, author_name) VALUES($1, $2, $3, $4, $5) RETURNING *'

    const values = [
        articleObj.title,
        articleObj.date,
        articleObj.content,
        articleObj.newspaperID,
        articleObj.authorName
    ] 

    try {
        const exists = await clientPG.query(check)
        const existsResult = await exists.rows[0].it_does_exist
        if(existsResult === true) {
            report.alreadyexists =  report.alreadyexists + 1;
            console.log("var bundan"+articleObj.title)
        }

        else  {
            try {
                const res = await clientPG.query(text, values)
                report.added++;
            } 
            catch (err) {
                console.log(err)
                console.log("error adding")
            }

        }
    } 
    catch (err) {
        console.log(err);
        console.log("error checking")
    }

}

/////////////////
export const searchForArticles:RequestHandler = async(req, res, next) => {
    const text = `SELECT article_id, title, author_name FROM articles WHERE LOWER(title) LIKE LOWER('%${req.params.query}%')`
    const results = await clientPG.query(text)
    res.status(200).json(results.rows)
}
/////////////////
export const getAllArticles:RequestHandler = async(req, res, next) => {
    const text = "SELECT article_id, title, context, newspaper_id, date, articles.author_name, img_url FROM articles INNER JOIN authors ON articles.author_name = authors.author_name WHERE date BETWEEN LOCALTIMESTAMP - INTERVAL '3 days' AND LOCALTIMESTAMP ORDER BY article_id DESC"
    let articles;
            try {
                const res = await clientPG.query(text)
                articles = res.rows;
            } 
            catch (err) {
                console.log("error adding") 
            }

            res.status(200).json(articles);
}

export const scrapArticles:RequestHandler = async(req, res, next) => {
    let articleArray: Article[] = [];

//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////
    if(req.params.newspaper === "milliyet"){
        const newspaperName = "Milliyet"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;

        const responseArticlesPage = await fetch(
            `https://www.milliyet.com.tr/yazarlar/` //gundem-ekonomi-dünya div.card-listing a.card-listing__link
        );

        const articlesText = await responseArticlesPage.text();
        var $ = cheerio.load(articlesText);
        var articlesURL: String[] = [];


        $('div.card-listing a.card-listing__link').each((i,a)=>{
            articlesURL.push($(a).attr('href')!)
        });


        await Promise.all(articlesURL.map(async url =>  {
          if(url.includes('yazarlar')) {
             
            const response = await fetch(
                `http://www.milliyet.com.tr${url}`
            );
            const text = await response.text();
            var $ = cheerio.load(text);
            let content = ""

            $('.article__content p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });

            var dateString =  $('.article__date').text();
            var dateArray = dateString.split(' ');

            var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
            dateArray[1] = (months.indexOf(dateArray[1]) + 1).toString();

            if(dateArray[1].length==1){
                dateArray[1] = '0'+dateArray[1]
            }
            var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 

            const title = $('.article__title').text();
            const date = finalDate;
            const image = $('.card-heading__figure-img').first().attr('src')!;
            const authorName =$('.card-heading__content-text-1 a').text();

            const articleObject = new Article(title, date, image, content, newspaperID, authorName)

                
            if(articleObject.content.length>10){
                articleArray.push(articleObject)
            }
          }
        }))

    }


//// --TAKVIM-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SABAH-- ////
    else if (req.params.newspaper === "takvim") {
        const newspaperName = "Takvim"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;

        const responseArticlesPage = await fetch(
            `https://www.takvim.com.tr/yazarlar/` //gundem-ekonomi-dünya div.card-listing a.card-listing__link
        );

        const articlesText = await responseArticlesPage.text();
        var $ = cheerio.load(articlesText);
        var articlesURL: String[]  = [];

        $('li.writing a').each((i,a)=>{
            articlesURL.push($(a).attr('href')!)
        });


        await Promise.all(articlesURL.map(async url =>  {
          if(url.includes('yazarlar')) {
             
            const response = await fetch(
                `http://www.takvim.com.tr${url}`
            );
            const text = await response.text();
            var $ = cheerio.load(text);
            var content = ""

            $('#haberDescription p').each((i,p)=>{ // bazı yazılarda hiç <p> yok strong, ve br içeriyor
                content = content.concat($(p).text().trim());
            });

            if(content.length<10){
                    content = ($('#haberDescription').text()); // gecici cözüm
                    
             }

            var dateString =  $('div.info ul').first().find('li').text().trim().split(',')[0];
            var dateArray = dateString.split(' ');

            var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
            dateArray[1] = (months.indexOf(dateArray[1]) + 1).toString();
            var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 


            const title = $('#haberTitle').text();
            const date = finalDate;
            const image = $('div.title img').attr('data-src')!;
            const authorName =$('div.title span').first().text();


            const articleObject = new Article(title, date, image, content, newspaperID, authorName)

              
            if(articleObject.content.length>10){
               articleArray.push(articleObject)
            }
          }
        }))
    }


//// --SOZCU-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
    else if (req.params.newspaper === "sozcu") { 
        const newspaperName = "Sözcü"
            const newspaperID = newspapers.indexOf(newspaperName) + 1;

            const responseArticlesPage = await fetch(
                `https://www.sozcu.com.tr/kategori/yazarlar/`
            );

            const articlesText = await responseArticlesPage.text();
            var $ = cheerio.load(articlesText);
            var articlesURL: String[]  = [];

            $('a.columnist-card').each((i,a)=>{
                articlesURL.push($(a).attr('href')!)
            });


            await Promise.all(articlesURL.map(async url =>  {
            if(url.includes('yazarlar')) {
                const response = await fetch(
                    `${url}`
                );
                const text = await response.text();
                var $ = cheerio.load(text);
                var content = ""

                $('article p').each((i,p)=>{
                    content = content.concat($(p).text().trim());
                });

                var dateString =  $('.content-meta-date').first().contents().filter(function() {
                    return this.type === 'text';
                }).text()

                dateString = dateString.substring(1,dateString.length)
                var dateArray = dateString.split(' ');
                var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
                dateArray[1] = (months.indexOf(dateArray[1]) + 1).toString();
                var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 


                   const title = $('article h1').first().text();
                   const date = finalDate;
                   const image = $('.columnist-header .img-holder img').first().attr('src')!;
                   const authorName =$('article a.name').text();

                const articleObject = new Article(title, date, image, content, newspaperID, authorName)

                   
                //pushNewsToDb(newsObject) 
                if(articleObject.content.length>10){
                    articleArray.push(articleObject)
                }
            }
            }))

    }

//// --CUMHURIYET-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
else if (req.params.newspaper === "cumhuriyet") { 

    const newspaperName = "Cumhuriyet"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;

        const responseArticlesPage = await fetch(
            `https://www.cumhuriyet.com.tr/BugununKoseleri`
        );

        const articlesText = await responseArticlesPage.text();
        var $ = cheerio.load(articlesText);
        var articlesURL: String[]  = [];

        $('.yazar-listesi > div a').each((i,a)=>{
            articlesURL.push($(a).attr('href')!)
        });

        await Promise.all(articlesURL.map(async url =>  {
        if(url.includes('yazarlar')) {
            const response = await fetch(
                `https://www.cumhuriyet.com.tr${url}`
            );
            const text = await response.text();
            var $ = cheerio.load(text);
            var content = ""

            $('.haberMetni p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });

            var dateArray = $('.yayin-tarihi').text().trim().split(' ')
            var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
            // dateArray[0] 15 (gun)
            // dateArray[1] Ekim (ay AMA yazıyla)
            // dateArray[2] 2022 (yil)
            var dateMonth = (months.indexOf(dateArray[1]) + 1).toString();
            if(dateMonth.length==1){
                dateMonth = '0'+dateMonth
            }
            var finalDate = `${dateArray[2]}-${dateMonth}-${dateArray[0]}` 

            console.log(finalDate)

            const title = $('h1.baslik').first().text();
            const date = finalDate;
            const image = `https://www.cumhuriyet.com.tr${$('.kose-yazisi-ust .bilgiler img').attr('src')}`;
            const authorName =$('.kose-yazisi-ust .adi').text();

            const articleObject = new Article(title, date, image, content, newspaperID, authorName)
            if(articleObject.content.length>10){
                articleArray.push(articleObject)
            }
        }
        }))

}


    await Promise.all(articleArray.map(async article =>  {
        await checkAuthor(article)
    }))


    res.status(200).json({data:report});
}
