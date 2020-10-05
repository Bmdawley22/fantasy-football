const User = require('../models').Users;
const Roster = require('../models').Rosters;
const Player = require('../models').Player;

const rendRoster = (req,res) => {
    User.findByPk(req.user.id)
    .then(user => {
        console.log(user)
        Roster.findOne({
            include: [
                {
                    model: Player,
                    attributes: ['id', 'name', 'position', 'team', 'age']
                }
            ],
            where: { 
                userId: user.id 
            }
        })
        .then(roster => {
            console.log(roster.Players[0].name)
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

const rendLeague = (req,res) => {
    User.findAll()
    .then(users => {
        res.render('main/league.ejs', {
            user: users
        })
    })
}

const rendOtherTeam = (req, res) => {
    User.findByPk(req.params.index)
    .then(otherTeam => {
        Roster.findOne({
            where: { userId: otherTeam.id }
        })
        .then(otherRoster => {
            res.render('main/otherTeam.ejs', {
                roster: otherRoster,
                team: otherTeam
            })
        })  
    })
}

module.exports = {
    rendRoster,
    rendAvailablePlayers,
    rendLeague,
    rendOtherTeam
}