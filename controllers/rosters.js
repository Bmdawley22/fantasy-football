const User = require('../models').Users;
const Roster = require('../models').Rosters;
const Player = require('../models').Player;

const rendRoster = (req,res) => {
    User.findByPk(req.user.id)
    .then(user => {
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
            res.render('main/roster.ejs', {
                roster: roster,
                user: user
            });
        }) 
    }) 
}

const rendAvailablePlayers = (req,res) => {
    Player.findAll({
        attributes: ['id', 'name', 'position', 'team', 'age', 'roster_id']
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
const dropPlayer = (req, res) => {
    console.log(req.params.index);
    Player.update(
        {roster_id: 0},
        {where: {id: req.params.index}},
        {attributes: ['id', 'name', 'position', 'team', 'age', 'roster_id']}
    ).then(droppedPlayer => {
        res.redirect('/rosters')
    })
}

module.exports = {
    rendRoster,
    rendAvailablePlayers,
    rendLeague,
    rendOtherTeam,
    dropPlayer
}