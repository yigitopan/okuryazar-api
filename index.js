const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const newspaperRoutes = require('./routes/newspaper-routes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/okuryazar-api', newspaperRoutes);

app.listen(process.env.PORT || 5000);


console.log("Connected");
