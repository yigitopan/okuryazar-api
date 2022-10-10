const fetch = require("isomorphic-fetch")
const cheerio = require("cheerio")

const getContent = async(req, res, next) => {
    const newspaper = req.params.newspaper
    var nachrichten = {
        nachrictArray: []
    };

//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////
    if(newspaper === "milliyet"){

        const responseSubject = await fetch(
            `https://www.milliyet.com.tr/${req.params.subject}` //gundem-ekonomi-dünya
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        var nachrichtenURLS = [];

        $('a.category-card').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href'))
        });


        await Promise.all(nachrichtenURLS.map(async url =>  {
        

            const response = await fetch(
                `http://www.milliyet.com.tr${url}`
            );
            const text = await response.text();
            var $ = cheerio.load(text);
            var content = ""

            $('.nd-content-column p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });

            var newsObject = 
            {
                title: $('h1.nd-article__title').text(),
                spot: $('h2.nd-article__spot').text(),
                date: $('.nd-article__info-block').first().contents().filter(function() {
                    return this.type === 'text';
                }).text().substring(0,8),
                
                image: $('.nd-article__spot-img').find('img').attr('data-src'),
                content
            }
            nachrichten.nachrictArray.push(newsObject)
        }))

    }
//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////


//// --SABAH-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SABAH-- ////
    else if (newspaper === "sabah") {

        const responseSubject = await fetch(
            `https://www.sabah.com.tr/${req.params.subject}` //gundem-yasam-saglik-dünya
        );

        const subjectText = await responseSubject.text();
        var $ = cheerio.load(subjectText);
        var nachrichtenURLS = [];

        $('.headlineNumeric ul li a').each((i,a)=>{
            nachrichtenURLS.push($(a).attr('href'))
        });


        await Promise.all(nachrichtenURLS.map(async url =>  {
                var fullUrl = `https://www.sabah.com.tr${url}`

                if(url.includes('sabah.com.tr')){
                    fullUrl = url;
                }

                const response = await fetch(
                    `${fullUrl}`
                );

                const text = await response.text(); 
                var $ = cheerio.load(text);
                var scripts = ""
                var mainScript = ""
                var content = ""
                var spot = ""

                $('script').each((idx, script) => {
                    scripts = scripts.concat($(script).text());
                    if($(script).text().includes('NewsArticle')) {
                        mainScript = $(script).text()
                    }
                });

                scripts =  scripts.split(`NewsArticle"`).pop().split(`keywords`)[0].trim(); // returns 'two'

                content =  scripts.split(`articleBody`).pop().split(`description`)[0].trim();  // returns 'two'
                spot =  scripts.split(`description`).pop().split(`articleBody`)[0].trim();  // returns 'two'

                $('.newsBox.selectionShareable p').each((i ,p)=>{
                    content = content.concat($(p).text());
                });

                var newsObject = 
                {
                    title: $('figure.newsImage img').attr('alt'),
                    spot,
                    date: $('.news-detail-info span span').first().text(),
                    image: $('figure.newsImage').find('img').attr('src'),
                    content
                }
                nachrichten.nachrictArray.push(newsObject)
        }))

}
//// --SABAH-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --SABAH-- ////


//// --SOZCU-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
else if (newspaper === "sozcu") { 
    var subject = `kategori/${req.params.subject}`;

    if(req.params.subject == "hayat"){
        subject = `hayatim`;
    }

    else if(req.params.subject == "spor"){
        subject = `spor`;
    }

    const responseSubject = await fetch(
        `https://www.sozcu.com.tr/${subject}` //gundem-spor-hayat-dünya-ekonomi- otomotiv
    );

    const subjectText = await responseSubject.text();
    var $ = cheerio.load(subjectText);
    var nachrichtenURLS = [];

    $('div.news-item a.img-holder').each((i,a)=>{
        nachrichtenURLS.push($(a).attr('href'))
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


    var newsObject = 
    {
        title: $('article').find('h1').first().text(),
        spot: $('h2.spot').text(),
        date: $('div.content-meta-dates span.content-meta-date').first().text(),
        image: $('.img-holder').find('img').attr('src'),
        content
    }

    nachrichten.nachrictArray.push(newsObject)
}))

}
//// --SOZCU-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
    res.status(200).json({data:nachrichten});
}

module.exports = {
    getContent
}