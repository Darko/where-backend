const express = require('express');
const fetch = require('node-fetch');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const apiKey = dotenv.config().parsed.API_KEY;

const whiteList = {
  'http://localhost:3000': true,
  'http://localhost:3002': true,
  'undefined': true,
}
const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);

    if (whiteList[origin]) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

let cache = {};
let travelPercent = 0;

const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=Shtip&destinations=Jagodina|Ljubljana&key=${apiKey}`;

fetch(url).then(response => response.json())
.then(res => cache = res);

app.get('/', (req, res) => res.send({ completed: travelPercent }));
app.get('/cache', (req, res) => res.send(cache))
app.get('/xd', (req, res) => {
  const { key, value } = req.query;
  
  if (key !== 'tony') {
    return res.sendStatus(401);
  }

  if (value !== undefined) {
    travelPercent = value;
  }

  res.sendStatus(200);
});

app.listen(6969, () => {
  console.log('Running on port 6969');
});