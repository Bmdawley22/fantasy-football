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
    ).then(() => {
        res.redirect('/rosters')
    })
}

const addPlayer = (req, res) => {
    User.findOne({
        where: { id: req.user.id }
    })
    .then(foundUser => {
        //console.log(foundUser);
        Player.update(
            {roster_id: foundUser.id},
            {where: {id: req.params.index}},
            {attributes: ['id', 'name', 'position', 'team', 'age', 'roster_id']}
        ).then(() => {
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