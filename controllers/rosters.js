const User = require('../models').Users;
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
        orderedRoster = orderRoster(user);
        res.render('main/roster.ejs', {
            user: user,
            roster: orderedRoster
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

function orderRoster(user) {
    const rosterArray = [];
    let qbCount = 0;
    let wrCount = 0;
    let rbCount = 0;
    let teCount = 0;
    let flexCount = 0;
    let dstCount = 0;
    let kCount = 0;

    // Seven for loops to organize an array in the order we want it displayed on our roster page
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "QB" && qbCount < 1) {
            rosterArray.push(user.Players[i]);
            qbCount++;
        }
    }
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "RB" && rbCount < 2 ) {
            rosterArray.push(user.Players[i]);
            rbCount++;
        } 
    }
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "WR" && wrCount < 2 ) {
                rosterArray.push(user.Players[i]);
                wrCount++;
        }
    }
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "TE" && teCount < 1 ) {
                rosterArray.push(user.Players[i]);
                teCount++;
        }
    }
    rbCount2 = 0;
    wrCount2 = 0;
    teCount2 = 0;
    // For our flex loop, we ran into a few issues. We had to add a second counter for 
    // each position that could be a FLEX (rb, wr, and te) because our initial counter was already
    // set to either 2 (for rb and wr) or 1 (for te) and was jumping into the else if statement
    // and adding the first (rb, wr, or te) as the FLEX player.
    for (let i = 0; i < user.Players.length; i++) {
        if(flexCount <  1) {
            if((user.Players[i].position === "RB" && rbCount2 < 2) ||
               (user.Players[i].position === "WR" && wrCount2 < 2) ||
               (user.Players[i].position === "TE" && teCount2 < 1)) {
                    if(user.Players[i].position === 'RB') {
                        rbCount2++;
                    } else if(user.Players[i].position === "WR") {
                        wrCount2++;
                    } else if(user.Players[i].position === "TE"){
                        teCount2++;
                    }
            } else if((user.Players[i].position === "RB" && rbCount2 === 2) ||
                      (user.Players[i].position === "WR" && wrCount2 === 2) ||
                      (user.Players[i].position === "TE" && teCount2 === 1)) {
                        rosterArray.push(user.Players[i]);
                        flexCount++;
            }   
        } 
    }
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "DST" && dstCount < 1 ) {
                rosterArray.push(user.Players[i]);
                dstCount++;
        }
    }
    for (let i = 0; i < user.Players.length; i++) {
        if(user.Players[i].position === "k" && kCount < 1 ) {
                rosterArray.push(user.Players[i]);
                kCount++;
        }
    }
    return rosterArray
}
