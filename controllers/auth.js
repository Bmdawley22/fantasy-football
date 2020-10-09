require('dotenv').config();

const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const User = require('../models').Users;


const rendSignup = (req,res) => {
    res.render('auth/signup.ejs', {
        error: false
    })
}
const rendLogin = (req,res) => {
    res.render('auth/login.ejs', {
        error: false
    })
}

const signup = (req, res) => {
            User.create(req.body)
            .then(newUser => {
                const token = jwt.sign(
                    {
                        id: newUser.id,
                        username: newUser.username
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '30 days'
                    }
                );
                // console.log(newUser);
                // console.log(token);
                res.cookie('jwt', token);
                res.redirect(`/users/profile`);
            })
            .catch(() => {
                res.render('auth/signup.ejs', {
                    error: true
                })
            })
            
    //     })
    // })
}

const login = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
            password: req.body.password
        }, 
    })
    .then(foundUser => {

        if(foundUser) {
            // bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
            //     if(match) {
                    const token = jwt.sign(
                        {
                            id: foundUser.id,
                            username: foundUser.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: '30 days'
                        }
                    )
                    res.cookie('jwt', token);
                    res.redirect(`/users/profile`);
                } else {
                    res.render('auth/login.ejs', {
                        error: true
                    })
                }
            // })
    //     }
     })
}


module.exports = {
    rendSignup,
    rendLogin,
    signup,
    login
}
