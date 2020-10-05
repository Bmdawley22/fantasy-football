const User = require('../models').Users;


const home = (req,res) => {
    res.render('users/home.ejs')
}

const rendSignup = (req,res) => {
    res.render('users/home.ejs')
}

module.exports = {
    home
}