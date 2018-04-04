const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const accountRoutes = require('./routes/accountRoutes');

const app = express();
const { port, database } = require('./config/secret');

// connect to mongodb
mongoose.connect(database).then(() => {
  console.log('Connected to DB');
}, err => console.log(err));

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // will also need to read other formats
app.use(morgan('dev'));
app.use(cors());

// routes
app.use('/api/accounts', accountRoutes);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server started at port ${port}`);
});
