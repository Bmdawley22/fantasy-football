const User = require('../models').Users;
const Roster = require('../models').Rosters;
const Player = require('../models').Player;

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
        });
        }) 
    }) 
}

const rendAvailablePlayers = (req,res) => {
    Player.findAll({
        attributes: ['id', 'name', 'position', 'team', 'age']
    })
    .then(players => {
        res.render('main/availablePlayers.ejs', {
            player: players
        })
    })
}

module.exports = {
    rendRoster,
    rendAvailablePlayers
}