import { RequestHandler } from "express";
import { clientPG } from "../db";

export const search: RequestHandler = async(req, res, next) =>  {
    const query = req.params.query.replace("+", " ");
    const text = `SELECT * FROM news WHERE LOWER(title) LIKE LOWER('%${query}%') OR LOWER(context) LIKE LOWER('%${query}%') OR LOWER(spot) LIKE LOWER('%${query}%')`
    const results = await clientPG.query(text)
    res.status(200).json(results.rows)
}