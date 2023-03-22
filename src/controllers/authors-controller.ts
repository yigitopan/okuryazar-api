import { RequestHandler } from "express";
import { clientPG } from "../db";
import { Author } from "../models/author";

export const getAuthors:RequestHandler = async(req, res, next) => {
    const query = 'SELECT * FROM public.authors'
    let authors;
            try {
                const res = await clientPG.query(query)
                authors = res.rows;
            } 
            catch (err) {
                console.log("error getting")
            }

            res.status(200).json(authors);
}

export const getArticlesOfAuthor:RequestHandler = async(req, res, next) => {
    const searchQuery = req.params.fullname.replaceAll("+", " ");
    const query = `SELECT * FROM
     (SELECT article_id, title, context, newspaper_id, date, articles.author_name, img_url 
     FROM articles 
     INNER JOIN authors ON articles.author_name = authors.author_name 
     ORDER BY date) as Results WHERE LOWER(author_name) = '${searchQuery}' ORDER BY article_id DESC`

    let articles;
            try {
                const res = await clientPG.query(query)
                articles = res.rows;
            } 
            catch (err) {
                console.log("error getting ")
            }

            res.status(200).json(articles);
}


