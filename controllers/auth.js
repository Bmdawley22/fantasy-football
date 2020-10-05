require('dotenv').config();

//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const User = require('../models').Users;


const rendSignup = (req,res) => {
    res.render('auth/signup.ejs')
}
const rendLogin = (req,res) => {
    res.render('auth/login.ejs')
}



module.exports = {
    rendSignup,
    rendLogin
}
