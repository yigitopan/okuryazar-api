import { Client } from "pg";
require('dotenv').config();

export const clientPG = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.DBPASS,
    port: parseInt(process.env.POSTGREPORT!),
    ssl:{
        rejectUnauthorized:false
    },
    connectionTimeoutMillis: 3000
});

clientPG.connect();
