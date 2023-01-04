import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import newspaperRoutes from './routes/newspaper-routes';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/okuryazar-api', newspaperRoutes);

app.listen(process.env.PORT || 5000);


console.log("Connected");
