const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;
const mongoose = require('mongoose');
// const regions = require('./regions');
const router = express.Router();

const db = require('./models');
const dbConfig = require('./models/db.config');
const Role = db.role;

const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const { verifySignUp, authJwt } = require('./middlewares');

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }
        console.log("Added 'user' to roles collection");
      });

      new Role({
        name: 'moderator',
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }
        console.log("Added 'moderator' to roles collection");
      });

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }
        console.log("Added 'admin' to roles collection");
      });
    }
  })
}



db.mongoose.connect(`mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}?authSource=admin&readPreference=primary&retryWrites=true&w=majority&directConnection=true&ssl=false`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB.');
  initial();
}).catch(err => {
  console.error('Connection Error', err);
  process.exit();
});

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use('/', router);

const region = db.region;

router.get('/regions', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 2;
    }

    const limit = parseInt(size);
    const skip = (page - 1) * size;

    const regions = await region.find().limit(limit).skip(skip);
    const totalRegions = await region.find().count();
    res.send({
      page, size, regions, totalRegions
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

// router.route('/regions').get(function(req, res) {
//   console.log(region.methods);
//   // region.paginate(req.body.pageNo, function(err, response) {
//   //   if(err) {
//   //     return res.status(500).json({
//   //       message: 'Error in application',
//   //       error: err
//   //     });
//   //   }
//   //   return res.status(200).json(response);
//   // });
//   region.find({}, function(err, result) {
//     if (err) {
//       res.send(err);
//     } else {
//       console.log(result);
//       res.send(result);
//     }
//   });
// });

router.route('/regions/new').post(function(req, res) {
  const doc = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    timeStamp: req.body.timeStamp
  };
  regions.create(doc, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(`Inserted a new region document with id ${result._id}`);
      res.send(result);
    }
  });
});

router.route('/api/auth/signin').post(authController.signin);
router.route('/api/auth/signup').post(
  [
    verifySignUp.checkDuplicateDetails,
    verifySignUp.checkRolesExisted
  ],
  authController.signup);

router.route('/api/test/all').get(userController.allAccess);  
router.route('/api/test/user').get(
  [
    authJwt.verifyToken
  ],
  userController.userBoard);

router.route('/api/test/mod').get(
  [
    authJwt.verifyToken,
    authJwt.isModerator
  ],
userController.moderatorBoard);

router.route('/api/test/admin').get(
  [
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  userController.adminBoard);

app.listen(PORT, function() {
  console.log('Server is running on Port: ' + PORT);
});
