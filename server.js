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

app.use(cors({
  origin: '*',
  credentials: true
}));

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
const people = db.people;
const basin = db.basin;
const fp = db.fp;
const survey = db.survey;
const dpr = db.dpr;

router.delete('/regions/delete/:region_id', (req, res, next) => {
  const filter = {
    _id: req.params.region_id
  };

  region.findOneAndDelete(filter, function(err, result) {
    if (err) {
      req.sendStatus(500).send(err.message);
    } else {
      console.log(`Deleted the document with ID: ${filter._id}`);
      res.send(result);
    }
  });
});

router.patch('/regions/edit/:region_id', async (req, res, next) => {
  try {
    const update = req.body;
    const filter = {
      _id: req.params.region_id
    };
    const result = await region.findOneAndUpdate(filter, update, {
      new: true
    });
    res.send({
      result: result
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.get('/regions/:region_id', async (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.region_id);
    const reg = await region.findById(id);
    res.send({
      region: reg
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.get('/regions', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skip = (page - 1) * size;

    const regions = await region.find({}).limit(lmt).skip(skip);
    const total = await region.find({}).count();
    res.send({
      page, size, regions, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.route('/regions/new').post(function(req, res) {
  const doc = {
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId
  };
  region.create(doc, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(`Inserted a new region document with id ${result._id}`);
      res.send(result);
    }
  });
});

router.get('/peoples', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skip = (page - 1) * size;

    const peoples = await people.find().limit(lmt).skip(skip);
    const total = await people.find().count();
    res.send({
      page, size, peoples, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.route('/peoples/new').post(function(req, res) {
  const doc = {
    cpf: req.body.cpf,
    name: req.body.name,
    email: req.body.email,
    designation: req.body.designation,
    discipline: req.body.discipline,
    charge: req.body.charge,
    level: req.body.level,
    mobile: req.body.mobile,
    crc: req.body.crc,
    userId: req.body.userId,
    timeStamp: req.body.timeStamp
  };
  people.create(doc, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(`Inserted a new people document with id ${result._id}`);
      res.send(result);
    }
  });
});

router.get('/peoples/:people_id', async (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.people_id);
    const person = await people.findById(id);
    res.send({
      people: person
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.patch('/peoples/edit/:people_id', async (req, res, next) => {
  try {
    const update = req.body;
    const filter = {
      _id: req.params.people_id
    };
    const result = await people.findOneAndUpdate(filter, update, {
      new: true
    });
    res.send({
      result: result
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.delete('/peoples/delete/:people_id', (req, res, next) => {
  const filter = {
    _id: req.params.people_id
  };

  people.findOneAndDelete(filter, function(err, result) {
    if (err) {
      req.sendStatus(500).send(err.message);
    } else {
      console.log(`Deleted the document with ID: ${filter._id}`);
      res.send(result);
    }
  });
});

router.get('/basins', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skip = (page - 1) * size;

    const basins = await basin.find().limit(lmt).skip(skip);
    const total = await basin.find().count();
    res.send({
      page, size, basins, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.route('/basins/new').post(function(req, res) {
  const doc = {
    name: req.body.name,
    category: req.body.category,
    userId: req.body.userId,
  };
  basin.create(doc, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(`Inserted a new basin document with id ${result._id}`);
      res.send(result);
    }
  });
});

router.get('/basins/:basin_id', async (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.basin_id);
    const b = await basin.findById(id);
    res.send({
      basin: b
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.patch('/basins/edit/:basin_id', async (req, res, next) => {
  try {
    const update = req.body;
    const filter = {
      _id: req.params.basin_id
    };
    const result = await basin.findOneAndUpdate(filter, update, {
      new: true
    });
    res.send({
      result: result
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.delete('/basins/delete/:basin_id', (req, res, next) => {
  const filter = {
    _id: req.params.basin_id
  };

  basin.findOneAndDelete(filter, function(err, result) {
    if (err) {
      req.sendStatus(500).send(err.message);
    } else {
      console.log(`Deleted the document with ID: ${filter._id}`);
      res.send(result);
    }
  });
});

router.get('/fps', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skp = (page - 1) * size;

    const fps = await fp.find({}).populate({
      path: 'region',
      select: 'title'
    }).populate({
      path: 'chief',
      select: 'name'
    }).limit(lmt).skip(skp);
    const total = await fp.find({}).count();
    res.send({
      page, size, fps, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.get('/fps/:fp_id', async (req, res, next) => {
  try {
    let id = mongoose.Types.ObjectId(req.params.fp_id);
    const f = await fp.findById(id);
    res.send({
      fp: f
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.post('/fps/new', function(req, res) {
  let doc = {
    name: req.body.name,
    type: req.body.type,
    region: mongoose.Types.ObjectId(req.body.region),
    userId: mongoose.Types.ObjectId(req.body.userId),
  };
  if (req.body.chief && req.body.chief !== '') {
    doc = { ...doc, chief: mongoose.Types.ObjectId(req.body.chief) };
  }
  fp.create(doc, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(`Inserted a new FPS document with id ${result._id}`);
      res.send(result);
    }
  });
});

router.patch('/fps/edit/:fp_id', async (req, res, next) => {
  try {
    let update = {
      name: req.body.name,
      type: req.body.type,
      region: mongoose.Types.ObjectId(req.body.region._id),
    };
    if (req.body.chief && req.body.chief !== '') {
      update = { ...update, chief: mongoose.Types.ObjectId(req.body.chief._id) };
    }
    let filter = {
      _id: mongoose.Types.ObjectId(req.params.fp_id)
    };
    const result = await fp.findOneAndUpdate(filter, update, {
      new: true
    });
    res.send({
      result: result
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.delete('/fps/delete/:fp_id', (req, res, next) => {
  const filter = {
    _id: req.params.fp_id
  };

  fp.findOneAndDelete(filter, function(err, result) {
    if (err) {
      req.sendStatus(500).send(err.message);
    } else {
      console.log(`Deleted the document with ID: ${filter._id}`);
      res.send(result);
    }
  });
});

router.get('/pr', async (req, res, next) => {
  try {
    const regs = await region.find({}, { title: 1 });
    const peops = await people.find({}, { name: 1, designation: 1, discipline: 1 });
    res.send({
      regs, peops
    });
  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.get('/surveys', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skp = (page - 1) * size;

    const surveys = await survey.find({}).limit(lmt).skip(skp);
    const total = await survey.find({}).count();
    res.send({
      page, size, surveys, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
});

router.get('/dprs', async (req, res, next) => {
  try {
    let { page, size } = req.query;
    if(!page) {
      page = 1;
    }
    if(!size) {
      size = 30;
    }

    const lmt = parseInt(size);
    const skp = (page - 1) * size;

    const dprs = await dpr.find({}).sort({date: -1}).limit(lmt).skip(skp);
    // const dprs = await dpr.find({}).sort({date: -1});
    const total = await dpr.find({}).count();
    res.send({
      page, size, dprs, total
    });

  } catch (error) {
    res.sendStatus(500).send(error.message);
  }
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