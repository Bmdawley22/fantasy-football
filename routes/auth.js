const express = require('express'); //gets express libraries
const ctrl = require('../controllers'); //get controllers
const router = express.Router();



router.get('/signup', ctrl.auth.rendSignup);
router.get('/login', ctrl.auth.rendLogin);
router.post("/signup", ctrl.auth.signup);
router.post("/login", ctrl.auth.login);



module.exports = router;