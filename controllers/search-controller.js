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
    const query = req.params.query.replace("+", " ");
    const text = `SELECT * FROM news WHERE LOWER(title) LIKE LOWER('%${query}%') OR LOWER(context) LIKE LOWER('%${query}%') OR LOWER(spot) LIKE LOWER('%${query}%')`
    const results = await client.query(text)
    res.status(200).json(results.rows)
}


module.exports = {
    searchOkuryazar
} 
