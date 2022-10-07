const fetch = require("isomorphic-fetch")
const cheerio = require("cheerio")

const getContent = async(req, res, next) => {

    const response = await fetch(
        'https://www.milliyet.com.tr/ekonomi/memur-sen-genel-baskani-ali-yalcindan-onemli-aciklamalar-6837129'
    );
    const text = await response.text();
    const $ = cheerio.load(text);
    const result = $('.nd-content-column p').text().trim();

    res.status(200).json({data:result});
}

module.exports = {
    getContent
}