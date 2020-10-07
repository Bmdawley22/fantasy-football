const User = require('../models').Users;
const Player = require('../models').Player;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let filterPosition = 'All';
let filterTeam = 'All';
let positionArr = ['All','QB', 'RB','WR','TE','DST','k'];
let teamArr = ["All", "ARI", "ATL",	"BAL", "BUF", "CAR", "CHI",	"CIN", "CLE", "DAL", "DEN",	"DET", "GNB", "HOU", "IND",	"JAX", "KAN", "LAC", "LAR",	"LVR", "MIA", "MIN", "NOR",	"NWE", "NYG", "NYJ", "PHI",	"PIT", "SEA", "SFO", "TAM",	"TEN", "WAS"];


const rendSearchPlayer = (req, res) => {
    Player.findAll(
        { attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }    
     )
     .then(players => {
        res.render('main/searchPlayers.ejs', {
            player: players,
            lastValue: ''
        })
     })
}

const searchPlayer = (req, res) => {
    let inputPlayer = `${req.body.name}`;
    string = stringHandler(inputPlayer)
    Player.findAll(
        { where: { "name": { [Op.like]: `%${string}%` }},
        attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }
    )
    .then(players => {
        res.render('main/searchPlayers.ejs', {
            player: players,
            lastValue: string
        })
     })
}

const rendRoster = (req,res) => {
    User.findByPk(req.user.id, {
        include: [{
            model: Player,
            attributes: ['id', 'name', 'position', 'team', 'age']
        }]
    })
    .then(user => {
        orderedRoster = orderRoster(user, true);
        countArray = orderRoster(user, false);
        let flex = false
        if(countArray[4] == 1) {
            flex = true;
        }
        let sum = countArray[0] + countArray[1] + countArray[2] + countArray[3];
        res.render('main/roster.ejs', {
            user: user,
            roster: orderedRoster,
            count: countArray,
            flex: flex,
            sum: sum
        });
    }) 
}
const filter = (req, res) => {
    filterPosition = req.body.position;
    filterTeam = req.body.teams;
    res.redirect('/rosters/availablePlayers');
}
const rendAvailablePlayers = (req,res) => {
    if (filterPosition === "All" && filterTeam === "All") {
        Player.findAll(
           { attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }    
        )
        .then(players => {
            res.render('main/availablePlayers.ejs', {
                player: players,
                positions: positionArr,
                teams: teamArr,
                currentPos: filterPosition,
                currTeam: filterTeam
            })
        })
    } else if (filterPosition !== "All" && filterTeam === "All") {
        Player.findAll(
            { where: { "position": filterPosition },
            attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }    
        )
        .then(players => {
            res.render('main/availablePlayers.ejs', {
                player: players,
                positions: positionArr,
                teams: teamArr,
                currentPos: filterPosition,
                currTeam: filterTeam
            })
        })
    }
    else if (filterPosition === "All" && filterTeam !== "All") {
        Player.findAll(
            { where: { "team": filterTeam },
            attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }    
        )
        .then(players => {
            res.render('main/availablePlayers.ejs', {
                player: players,
                positions: positionArr,
                teams: teamArr,
                currentPos: filterPosition,
                currTeam: filterTeam
            })
        })
    } else if (filterPosition !== "All" && filterTeam !== "All") {
        Player.findAll(
            { where: { "team": filterTeam,
                       "position": filterPosition},
            attributes: ['id', 'name', 'position', 'team', 'age', 'userId'] }    
        )
        .then(players => {
            res.render('main/availablePlayers.ejs', {
                player: players,
                positions: positionArr,
                teams: teamArr,
                currentPos: filterPosition,
                currTeam: filterTeam
            })
        })
    } 
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
        orderedRoster = orderRoster(otherTeam, true);
        countArray = orderRoster(otherTeam, false);
        let flex = false
        if(countArray[4] == 1) {
            flex = true;
        }
        let sum = countArray[0] + countArray[1] + countArray[2] + countArray[3];
        res.render('main/otherTeam.ejs', {
            team: otherTeam,
            roster: orderedRoster,
            count: countArray,
            flex: flex,
            sum: sum
        })
    })
}

const dropPlayer = (req, res) => {
    Player.update(
        {userId: 0},
        {where: {id: req.params.index}},
        {attributes: ['id', 'name', 'position', 'team', 'age', 'userId']}
    ).then(() => {
        res.redirect('/rosters')
    })
}

const addPlayer = (req, res) => {
    User.findOne({
        include: [
            {
                model: Player,
                attributes: ['id', 'name', 'position', 'team', 'age']
            }
        ],
        where: { id: req.user.id }
    })
    .then(foundUser => {
        Player.findByPk(req.params.index, {
            attributes: ['position']
        })
        .then(foundPlayer => {         
            countArray = orderRoster(foundUser, false);
            compareNewPlayer = comparePlayer(countArray, foundPlayer);
            if(compareNewPlayer) {
                Player.update(
                    {userId: foundUser.id},
                    {where: {id: req.params.index}},
                    {attributes: ['id', 'name', 'position', 'team', 'age', 'userId']}
                ).then(() => {
                    res.redirect('/rosters')
                })
            } else {
                res.send('Cannot add this player');
            }
        })
    })
}

module.exports = {
    rendSearchPlayer,
    searchPlayer,
    rendRoster,
    rendAvailablePlayers,
    filter,
    rendLeague,
    rendOtherTeam,
    dropPlayer,
    addPlayer
}

function comparePlayer(arr, player) {
    const rosterArray = arr;
    const playerPosition = player.position;

    if(playerPosition === 'QB' && rosterArray[0] < 1) {
        return true;
    } else if(playerPosition === 'RB' && rosterArray[1] < 2) {
        return true;
    } else if(playerPosition === 'WR' && rosterArray[2] < 2) {
        return true;
    } else if(playerPosition === 'TE' && rosterArray[3] < 1) {
        return true;
    } else if(rosterArray[4] < 1 && 
        (playerPosition === 'RB' || playerPosition === 'WR' || playerPosition === 'TE')) {
        return true;
    } else if(playerPosition === 'DST' && rosterArray[5] < 1) {
        return true;
    } else if(playerPosition === 'k' && rosterArray[6] < 1) {
        return true;
    } else {
        return false;
    }
}

function orderRoster(user, truthOrFalse) {
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
    const countArray = [qbCount, rbCount, wrCount, teCount, flexCount, dstCount, kCount];
    if(truthOrFalse == true) {
        return rosterArray
    } else {
        return countArray
    }
}

function stringHandler(input) {
    let temp = '';
    let temp2 = '';
    let string = '';
    for(let i = 0; i < input.length; i++) {
        if(i == 0) {
            temp = input.substring(0,1).toUpperCase();
        } else {
            if(input[i] == ' ' && i != (input.length-1)) {
                temp = ' ';
                temp2 = input.substring(i+1,i+2).toUpperCase();
            }
            else if (input[i-1] != ' ') {
                temp = input.substring(i,i+1).toLowerCase();
                temp2 = '';
            }
            else {
                temp = '';
                temp2 = '';
            }
        }
        string = string + temp + temp2;
    }
    return string
}