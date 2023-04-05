import { RequestHandler } from "express";
import { clientPG } from "../db";
import { ChromosomController } from "../controllers/ChromosomController";


export const search: RequestHandler = async(req, res, next) =>  {
    const query = req.params.query.replace("+", " ");
    const text = 
        `SELECT * FROM (SELECT title, date, img_url, context, null as spot, articles.author_name, newspaper_id, null AS category_name FROM articles INNER JOIN authors ON articles.author_name = authors.author_name 
        UNION 
        SELECT title, date, img_url, context, spot, null as author_name,newspaper_id, category_name from News) 
        AS SearchResult 
        WHERE LOWER(context) LIKE LOWER('%${query}%') OR LOWER(title) LIKE LOWER('%${query}%')
        `
        try {
            const results = await clientPG.query(text)
        } catch (error) {
            console.log(error)
        }
    const results = await clientPG.query(text)
    res.status(200).json(results.rows)
}


export const dataEndpoint:RequestHandler = async(req, res, next) => {
    console.time();
   
    const CC = new ChromosomController(74, 2400)

    CC.lebenUndLebenLassen(50, 200000)
    
    const data = CC.getResultate();
    CC.ergebnis()
    console.timeEnd();

    res.status(200).json({data});
}
