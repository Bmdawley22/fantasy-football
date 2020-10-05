const express = require('express'); //gets express libraries
const ctrl = require('../controllers'); //get controllers
const router = express.Router();

router.get('/', ctrl.rosters.rendRoster);


module.exports = router;