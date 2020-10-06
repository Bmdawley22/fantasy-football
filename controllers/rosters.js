const User = require('../models').Users;
const Roster = require('../models').Rosters;
const Player = require('../models').Player;

const rendRoster = (req,res) => {
    User.findByPk(req.user.id, {
        include: [
            {
                model: Player,
                attributes: ['id', 'name', 'position', 'team', 'age']
            }
        ]
    })
    .then(user => {
            res.render('main/roster.ejs', {
                user: user
            });
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
    User.findByPk(req.params.index, {
        include: [
            {
                model: Player,
                attributes: ['id', 'name', 'position', 'team', 'age']
            }
        ]
    })
    .then(otherTeam => {
        console.log(otherTeam)
        res.render('main/otherTeam.ejs', {
            team: otherTeam
        })
    })
}

const dropPlayer = (req, res) => {
    Player.update(
        {roster_id: 0},
        {where: {id: req.params.index}},
        {attributes: ['id', 'name', 'position', 'team', 'age', 'roster_id']}
    ).then(droppedPlayer => {
        res.redirect('/rosters')
    })
}

const addPlayer = (req, res) => {
    Roster.findOne({
        where: { userId: req.user.id }
    })
    .then(findRoster => {
        console.log(findRoster);
        Player.update(
            {roster_id: findRoster.id},
            {where: {id: req.params.index}},
            {attributes: ['id', 'name', 'position', 'team', 'age', 'roster_id']}
        ).then(droppedPlayer => {
            res.redirect('/rosters')
        })
    })
    
}

module.exports = {
    rendRoster,
    rendAvailablePlayers,
    rendLeague,
    rendOtherTeam,
    dropPlayer,
    addPlayer
}