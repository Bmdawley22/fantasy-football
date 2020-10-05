require('dotenv').config();

const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const User = require('../models').Users;


const rendSignup = (req,res) => {
    res.render('auth/signup.ejs')
}
const rendLogin = (req,res) => {
    res.render('auth/login.ejs')
}

const signup = (req, res) => {
    // bcrypt.genSalt(10, (err, salt) => {
    //     if(err) {
    //         return res.send(err);
    //     }

    //     bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
    //         if(err) {
    //             return res.send(err);
    //         }

    //         req.body.password = hashedPwd;

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
                    console.log(token);
                    res.cookie('jwt', token);
                    res.redirect(`/users/profile`);
                } else {
                    res.send('Incorrect Password');
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
