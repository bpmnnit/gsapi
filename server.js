const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
const mongoose = require('mongoose');
const atlas2d = require('./model');

app.use(cors());

mongoose.connect('mongodb://atlas:harekrishna@localhost:27017/atlasdb', {
  useNewUrlParser: true
});

const router = express.Router();
const connection = mongoose.connection;

connection.once('open', function() {
  console.log('Connection with MongoDB was successful');
});

app.use('/', router);
router.route("/streams").get(function(req, res) {
  atlas2d.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, function() {
  console.log('Server is running on Port: ' + PORT);
});
