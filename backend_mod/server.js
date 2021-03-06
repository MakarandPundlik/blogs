const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const Router = require('./routes/userrouter');
const app = express();

//database connectivity
mongoose.connect(process.env.mongoURIProfile, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to the profile database successfully'))
  .catch((err) => console.log("Database error, cannot connect to mongodB..."));
 
//cors middleware

app.use(cors({
 origin:true,
  credentials:true
}));

//cookieparser middleware
app.use(cookieParser());

//bodyparser middleware
app.use(bodyParser.json());

//Router middleware
app.use('/', Router);

const port = 2020 || proccess.env.port;

app.listen(port, () => console.log(`connected to the port ${port} successfully`));
