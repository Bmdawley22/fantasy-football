const User = require('../models').Users;


const home = (req,res) => {
    res.render('users/home.ejs')
}

const rendProfile = (req, res) => {
    User.findByPk(req.user.id)
    .then(showProfile => {
        res.render("users/profile.ejs", {
            users: showProfile
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
}

const deleteUser = (req, res) => {
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