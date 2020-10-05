const express = require('express'); //gets express libraries
const ctrl = require('../controllers'); //get controllers
const router = express.Router();

router.get('/', ctrl.rosters.rendRoster);
router.get('/availablePlayers', ctrl.rosters.rendAvailablePlayers);
router.get('/league', ctrl.rosters.rendLeague);
router.get('/league/:index', ctrl.rosters.rendOtherTeam);


module.exports = router;