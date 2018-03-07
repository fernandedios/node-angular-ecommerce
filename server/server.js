const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3030;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // will also need to read other formats
app.use(morgan('dev'));


app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server started at port ${port}`);
});
