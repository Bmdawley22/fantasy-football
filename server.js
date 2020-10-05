require('dotenv').config();
const express = require('express'); // gets the express library
const methodOverride = require('method-override'); //gets method-override library
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express(); //app is an object for the app

//whatever inside this every request passed through it
//makes it so express can understand it 
//Middleware
app.use(express.urlencoded({extended: true})); //changes response from client to JS understandable 
app.use(methodOverride('_method'));

app.use(express.static('public'));

app.use(cookieParser());

const verifyToken = (req,res, next) => {
    let token = req.cookies.jwt
    console.log(`Token: ${token}`)

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if(err || !decodedUser) {
            return res.send('Errorin JWT');
        }
        req.user = decodedUser;

        next()
    })
}


//app.use('/fruits', routes.fruits);
// app.use('/users', routes.users);
app.use('/auth', routes.auth);
app.use('/users', verifyToken, routes.users);
app.use('/rosters', verifyToken, routes.rosters)

app.get('/', (req, res) => {
    res.render('users/home.ejs')
});

//listen used to run app on port 3000, listen function from express library
app.listen(process.env.PORT, () => {
    console.log(`I am listening on port ${process.env.PORT}`);
})

