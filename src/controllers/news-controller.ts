import { RequestHandler } from "express";
import { clientPG } from "../db";
import fetch from "isomorphic-fetch";
import cheerio from "cheerio";
import { News } from "../models/news";

const newspapers = ["Sözcü", "Milliyet", "Takvim", "Cumhuriyet"]
var report = {
    alreadyexists:0,
    added:0
}
let unChecked: string[] = [];



const pushNewsToDb = async(newObj: News) => {
    const search = newObj.title.replaceAll("'","''")
    const check = `SELECT EXISTS (SELECT news_id FROM news WHERE title LIKE '${search}') AS it_does_exist; `
    const text = 'INSERT INTO news(title, spot, date, img_url, context, newspaper_id, category_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *'

    const values = [
        newObj.title,
        newObj.spot,
        newObj.date,
        newObj.image,
        newObj.content,
        newObj.newspaperID,
        newObj.categoryName
    ] 

    try {
        const exists = await clientPG.query(check)
        const existsResult = await exists.rows[0].it_does_exist
        if(existsResult === true) {
            report.alreadyexists = report.alreadyexists+1
        }
        
        else  {
            try {
                const res = await clientPG.query(text, values)
                report.added++;
            } 
            catch (err) {
                console.log("error adding->"+err)
                unChecked.push(newObj.title)
            }

        }
    } 
    catch (err) {
        unChecked.push(search);
        console.log("error checking")
    }
}

export const getAllNews:RequestHandler = async(req, res, next) => { 
 const text = 'SELECT * FROM public.news ORDER BY news_id DESC'
    let news;
            try {
                const res = await clientPG.query(text)
                news = res.rows;
            } 
            catch (err) {
                console.log("error adding")
            }

            res.status(200).json(news);
}


export const scrapNews:RequestHandler = async(req, res, next) => {
    const newspaper = req.params.newspaper
        let nachrictArray: News[] = [];

//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////
    if(newspaper === "milliyet"){
        const newspaperName = "Milliyet"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;

        let categoryName: string;

        if(req.params.subject == "gundem") {
            categoryName = "Gündem"
        }

        else if(req.params.subject == "ekonomi") {
            categoryName = "Ekonomi"
        }

        else if(req.params.subject == "dunya") {
            categoryName = "Dünya"
        }

        const responseSubject = await fetch(
            `https://www.milliyet.com.tr/${req.params.subject}` //gundem-ekonomi-dünya
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        var nachrichtenURLS: (string | undefined)[] = [];

        $('a.cat-list-card__link').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href'))
        });

        await Promise.all(nachrichtenURLS.map(async url =>  {
            const response = await fetch(
                `http://www.milliyet.com.tr${url}`
            );
            const text = await response.text();
            var $ = cheerio.load(text);
            var content = ""

            $('.news-content.readingTime p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });
            
            var dateString =  $('.news-detail-text time').first().attr('datetime');
            var finalDate = dateString!.split('T')[0];

            const spot = $('.news-content__inf h2').first().text();
            const title = $('h1.news-detail-title').text();
            const date = finalDate;
            const image = $('.rhd-spot-img-cover').attr('src');

            const newsObject = new News(title, spot, date, image!, content, newspaperID, categoryName);

            nachrictArray.push(newsObject)
        }))

    }


//// --TAKVIM-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SABAH-- ////
    else if (newspaper === "takvim") {
        const newspaperName = "Takvim"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;

        let categoryName: string;
        let restUrl;

        if(req.params.subject == "gundem") {
            categoryName = "Gündem";
        }

        else if(req.params.subject == "ekonomi") {
            categoryName = "Ekonomi"
        }

        else if(req.params.subject == "dunya") {
            categoryName = "Dünya"
        }

        else if(req.params.subject == "spor") {
            categoryName = "Spor"
        }

        if(req.params.subject == 'gundem') {
            restUrl = 'guncel';
        }
        else {
            restUrl = req.params.subject
        }
        
        const responseSubject = await fetch(
            `https://www.takvim.com.tr/${restUrl}` //gundem-yasam-saglik-dünya
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        let nachrichtenURLS: (string)[] = [];

        $('div.newsList ul li a').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href')!)
        });

        await Promise.all(nachrichtenURLS.map(async url =>  {
            var finalUrl = `https://www.takvim.com.tr${url}`

            if(url.includes('takvim.com.tr')){
                finalUrl = url;
            }

            const response = await fetch(
                `${finalUrl}`
            );

            if(!(url.includes('/galeri/'))){
                const text = await response.text();
                var $ = cheerio.load(text);
                var content = ""

                $('paginglist p').each((i,p)=>{
                    content = content.concat($(p).text().trim());
                });

                var dateString =  $('div.infoBox ul li:nth-child(2)').contents().filter(function() {
                    return this.type === 'text';
                }).text().split(' ')[0];

                /* var dateArray = dateString.split('.');
                // dateArray[0] 15 (gun)
                // dateArray[1] 10 (ay)
                // dateArray[2] 2022 (yil)
                var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 
                */
                var dateParts = dateString.split('.')
                var finalDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 

                const title = $('#haberTitle').text();
                const spot = $('#haberSpot').text();
                const date = dateString;
                const image = $('.haberImg').attr('src');
                
                const newsObject = new News(title, spot, date, image!, content, newspaperID, categoryName);
                nachrictArray.push(newsObject)
                //nachrichten.nachrictArray.push(newsObject)
            }
            ///GALERIYSE
            else {
                const text = await response.text();
                var $ = cheerio.load(text);
                var content = ""

                $('.itemsFrame p').each((i,p)=>{
                    content = content.concat($(p).text().trim());
                });

                var dateString =  $('.textInfo span').text().trim().split(' ')[0];

                /* var dateArray = dateString.split('.');
                // dateArray[0] 15 (gun)
                // dateArray[1] 10 (ay)
                // dateArray[2] 2022 (yil)
                var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 
                */
                var dateParts = dateString.split('.')
                var finalDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 

                const title =  $('.pageTitle').text();
                const spot = $('h2.spot').text();
                const date = finalDate;
                const image =  $('.figure img.lazyload').first().attr('data-src');

                const newsObject = new News(title, spot, date, image!, content, newspaperID, categoryName);
                nachrictArray.push(newsObject)
            }
        }))

    }


//// --SOZCU-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
    else if (newspaper === "sozcu") { 
        const newspaperName = "Sözcü"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;
        let categoryName: string;

        if(req.params.subject == "gundem") {
            categoryName = "Gündem"
        }

        else if(req.params.subject == "ekonomi") {
            categoryName = "Ekonomi"
        }

        else if(req.params.subject == "dunya") {
            categoryName = "Dünya"
        }

        else if(req.params.subject == "spor") {
            categoryName = "Spor"
        }



        var subject = `kategori/${req.params.subject}`;

        if(req.params.subject == "hayat"){
            subject = `hayatim`;
        }

        else if(req.params.subject == "spor"){
            subject = `spor`;
        }

        else if(req.params.subject == "finans"){
            subject = `finans`;
        }

        const responseSubject = await fetch(
            `https://www.sozcu.com.tr/${subject}` //gundem-spor-hayat-dünya-ekonomi- otomotiv
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        let nachrichtenURLS: (string)[] = [];

        $('div.news-item a.img-holder').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href')!)
        });

        await Promise.all(nachrichtenURLS.map(async url =>  {
        const response = await fetch(
            `${url}`
        );

        const text = await response.text();
        var $ = cheerio.load(text);

        var content = ""

        $('article p').each((i,p)=>{
            content = content.concat($(p).text().trim());
        });

        var dateString = $('div.content-meta-dates span.content-meta-date').first().text();
        var firstDateArray = dateString.split('- ')
        var secondPart = firstDateArray[1];
        var dateArray = secondPart.split(' ')
        var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
        // dateArray[0] 15 (gun)
        // dateArray[1] Ekim (ay AMA yazıyla)
        // dateArray[2] 2022 (yil)
        dateArray[1] = (months.indexOf(dateArray[1]) + 1).toString();
        var finalDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}` 

        const title =  $('article').find('h1').first().text();
        const spot = $('h2.spot').text();
        const date = finalDate;
        const image =  $('.main-img .img-holder').find('img').attr('src');

        const newsObject = new News(title, spot, date, image!, content, newspaperID, categoryName);
        nachrictArray.push(newsObject)
    }))

    }


//// --TAKVIM-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
    else if (newspaper === "cumhuriyet") { 
        const newspaperName = "Cumhuriyet"
        const newspaperID = newspapers.indexOf(newspaperName) + 1;
        let categoryName: string;

        if(req.params.subject == "gundem") {
            categoryName = "Gündem"
        }

        else if(req.params.subject == "ekonomi") {
            categoryName = "Ekonomi"
        }

        else if(req.params.subject == "dunya") {
            categoryName = "Dünya"
        }

        else if(req.params.subject == "spor") {
            categoryName = "Spor"
        }

        const responseSubject = await fetch(
            `https://www.cumhuriyet.com.tr/${req.params.subject}` //gundem-spor-hayat-dünya-ekonomi- otomotiv
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        let nachrichtenURLS: (string)[] = [];

        $('.swiper-slide a:nth-child(1)').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href')!)
        });

        await Promise.all(nachrichtenURLS.map(async url =>  {
            const response = await fetch(
                `https://www.cumhuriyet.com.tr${url}`
            );

            const text = await response.text();
            var $ = cheerio.load(text);

            var content = ""

            $('.haberMetni  p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });

            var dateArray = $('.yayin-tarihi').text().trim().split(' ')
            
            var months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
            // dateArray[0] 15 (gun)
            // dateArray[1] Ekim (ay AMA yazıyla)
            // dateArray[2] 2022 (yil)
            var dateMonth = months.indexOf(dateArray[1]) + 1;
            var finalDate = `${dateArray[2]}-${dateMonth}-${dateArray[0]}` 

            const title =  $('h1.baslik').text();
            const spot = $('h2.spot').text();
            const date = finalDate;
            const image = `https://www.cumhuriyet.com.tr${$('.content .img-responsive').attr('src')}`;


            const newsObject = new News(title, spot, date, image!, content, newspaperID, categoryName);
            nachrictArray.push(newsObject)
        }))

    }


await Promise.all(nachrictArray.map(async news =>  {
    await pushNewsToDb(news)
}))

    res.status(200).json({report:report, missedOnes:unChecked});
}
