const express = require('express'); //gets express libraries
const ctrl = require('../controllers'); //get controllers
const router = express.Router();

router.get('', ctrl.users.home);
router.get('/profile', ctrl.users.rendProfile);
router.put("/profile", ctrl.users.edit);
router.delete("/profile", ctrl.users.deleteUser);



module.exports = router;