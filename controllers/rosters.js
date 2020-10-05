const User = require('../models').Users;
const Roster = require('../models').Rosters;

const rendRoster = (req,res) => {
    User.findByPk(req.user.id)
    .then(user => {
        Roster.findOne(
            {
                where: { userId: user.id }
            }
        )
        .then(roster => {
            res.render('main/roster.ejs', {
                roster: roster,
                user: user
                // index: req.params.index
        });
        }) 
    }) 
}

module.exports = {
    rendRoster
}