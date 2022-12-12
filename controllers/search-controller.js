const fetch = require("isomorphic-fetch")
const cheerio = require("cheerio")
const { Pool, Client } = require("pg");
require('dotenv').config();

let unChecked = []; 

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.DBPASS,
    port: process.env.POSTGREPORT,
    ssl:{
        rejectUnauthorized:false
    }
});

client.connect();


/////////////////

const searchOkuryazar = async(req, res, next) => {
    const text = `SELECT * FROM articles WHERE LOWER(title) LIKE LOWER('%${req.body.searchQuery}%') OR LOWER(context) LIKE LOWER('%${req.body.searchQuery}%') OR LOWER(author_name) LIKE LOWER('%${req.body.searchQuery}%')`
    const results = await client.query(text)
    res.status(200).json(results.rows)
}


module.exports = {
    searchOkuryazar
} 
