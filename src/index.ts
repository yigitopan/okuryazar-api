import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import newspaperRoutes from './routes/newspaper-routes';
import newsRoutes from './routes/news-routes';
import articleRoutes from './routes/article-routes';
import authorRoutes from './routes/author-routes';
import searchRoutes from './routes/search-routes';
import compresssion from 'compression'
dotenv.config();


const app = express();
app.use(compresssion());
app.use(bodyParser.json());
app.use(cors());

app.use('/okuryazar-api', articleRoutes);
app.use('/okuryazar-api', newspaperRoutes);
app.use('/okuryazar-api', newsRoutes);
app.use('/okuryazar-api', authorRoutes);
app.use('/okuryazar-api', searchRoutes);

app.listen(process.env.PORT || 5000);


console.log("Connected");
