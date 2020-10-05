const User = require('../models').Users;


const home = (req,res) => {
    res.render('users/home.ejs')
}

const rendProfile = (req, res) => {
    console.log(req.body)
    User.findByPk(req.user.id)
    .then(showProfile => {
        console.log(showProfile);
        res.render("users/profile.ejs", {
            users: showProfile
            // index: req.params.index
        });
    }) 
};

const edit = (req, res) => {
    User.update(req.body, {
        where: { id: req.user.id },
        returning: true
    })
    .then(updatedUser => {
        res.redirect(`/users/profile`);
    })
    // users[req.params.index] = req.body;
}

const deleteUser = (req, res) => {
    // users.splice(req.params.index, 1);
    User.destroy({ where: { id: req.user.id } })
    .then(() => {
        res.redirect("/");
    })
}

module.exports = {
    home,
    rendProfile,
    edit,
    deleteUser
}