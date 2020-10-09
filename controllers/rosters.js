const User = require('../models').Users;
const Player = require('../models').Player;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let filterPosition = 'All';
let filterTeam = 'All';
let positionArr = ['All','QB', 'RB','WR','TE','DST','k'];
let teamArr = ["All", "ARI", "ATL",	"BAL", "BUF", "CAR", "CHI",	"CIN", "CLE", "DAL", "DEN",	"DET", "GNB", "HOU", "IND",	"JAX", "KAN", "LAC", "LAR",	"LVR", "MIA", "MIN", "NOR",	"NWE", "NYG", "NYJ", "PHI",	"PIT", "SEA", "SFO", "TAM",	"TEN", "WAS"];
let error = false;

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
    //gets user input
    let inputPlayer = `${req.body.name}`;
    //handles capitalization matching
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
    //finds current user from web token
    //includes players where association exists
    User.findByPk(req.user.id, {
        include: [{
            model: Player,
            attributes: ['id', 'name', 'position', 'team', 'age']
        }]
    })
    .then(user => {
        //function that returns the roster in the desired ordered 
        orderedRoster = orderRoster(user, true);
        //function to compare if added player can be added without violating 
        //roster postion requirements
        //passes in count array and added player information
        countArray = orderRoster(user, false);
        let flex = false
        //checks if flex position is present (to change the display on the roster)
        if(countArray[4] == 1) {
            flex = true;
        }
        //determines whne the flex position should be displayed (instead of rb, wr, or te)
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
    //set equal to filter input from user
    filterPosition = req.body.position;
    filterTeam = req.body.teams;
    res.redirect('/rosters/availablePlayers');
}
const rendAvailablePlayers = (req,res) => {
    //checks if filter input is set to all for position and teams
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
                currTeam: filterTeam,
                error: error
            })
        })
        //checks if just a position is filtered
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
                currTeam: filterTeam,
                error: error
            })
        })
    }
        //checks if just a team is filtered
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
                currTeam: filterTeam,
                error: error
            })
        })
        //check if both are filtered
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
                currTeam: filterTeam,
                error: error
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

const rendLeagueRules = (req,res) => {
    res.render('main/leagueRules.ejs')
}

const rendOtherTeam = (req, res) => {
    //finds current user from web token
    //includes players where association exists
    User.findByPk(req.params.index, {
        include: [
            {
                model: Player,
                attributes: ['id', 'name', 'position', 'team', 'age']
            }
        ]
    })
    .then(otherTeam => {
        //function that returns the roster in the desired ordered 
        orderedRoster = orderRoster(otherTeam, true);
        //function to compare if added player can be added without violating 
        //roster postion requirements
        //passes in count array and added player information
        countArray = orderRoster(otherTeam, false);
        let flex = false
        //checks if flex position is present (to change the display on the roster)
        if(countArray[4] == 1) {
            flex = true;
        }
        //determines whne the flex position should be displayed (instead of rb, wr, or te)
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
    //finding logged in user from web token, including player model
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
        //finding player from database by selected "add player" button
        Player.findByPk(req.params.index, {
            attributes: ['position']
        })
        .then(foundPlayer => {    
            //function that returns an array of counts for each position in the current user's roster
            countArray = orderRoster(foundUser, false);
            //function to compare if added player can be added without violating 
            //roster postion requirements
            //passes in count array and added player information
            compareNewPlayer = comparePlayer(countArray, foundPlayer);
            if(compareNewPlayer) {
                //adds foreign key to added player 
                Player.update(
                    {userId: foundUser.id},
                    {where: {id: req.params.index}},
                    {attributes: ['id', 'name', 'position', 'team', 'age', 'userId']}
                ).then(() => {
                    error = false;
                    res.redirect('/rosters')
                })
            } else {
                error = true;
                res.redirect('/rosters/availablePlayers')
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
    rendLeagueRules,
    rendOtherTeam,
    dropPlayer,
    addPlayer
}
//function to see if added player meets postion requirements to be added to roster
//returns true if able to be added, false otherwise
function comparePlayer(arr, player) {
    //array of counts for each position
    const countArray = arr;
    //added player to be checked
    const playerPosition = player.position;

    if(playerPosition === 'QB' && countArray[0] < 1) {
        return true;
    } else if(playerPosition === 'RB' && countArray[1] < 2) {
        return true;
    } else if(playerPosition === 'WR' && countArray[2] < 2) {
        return true;
    } else if(playerPosition === 'TE' && countArray[3] < 1) {
        return true;
    } else if(countArray[4] < 1 && 
        (playerPosition === 'RB' || playerPosition === 'WR' || playerPosition === 'TE')) {
        return true;
    } else if(playerPosition === 'DST' && countArray[5] < 1) {
        return true;
    } else if(playerPosition === 'k' && countArray[6] < 1) {
        return true;
    } else {
        return false;
    }
}
//function to both order the roster to the desired format and count number of each 
//position on roster
//if false passed in, function returns count array, if true = passes ordered roster array
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
    //sets count array 
    const countArray = [qbCount, rbCount, wrCount, teCount, flexCount, dstCount, kCount];
    //if statement to determine whether to return roster array or count array
    if(truthOrFalse == true) {
        return rosterArray
    } else {
        return countArray
    }
}
//function for comparing searched player
function stringHandler(input) {
    let temp = '';
    let temp2 = '';
    let string = '';
    //for loop through inputted string 
    for(let i = 0; i < input.length; i++) {
        //changes first character to uppercase
        if(i == 0) {
            temp = input.substring(0,1).toUpperCase();
        } else {
            //capitalizes first letter of last name
            if(input[i] == ' ' && i != (input.length-1)) {
                temp = ' ';
                temp2 = input.substring(i+1,i+2).toUpperCase();
            }
            //lowercases every character but 1st letter of last name
            else if (input[i-1] != ' ') {
                temp = input.substring(i,i+1).toLowerCase();
                temp2 = '';
            }
            //sets to empty if for loop is on 1st character of last name
            else {
                temp = '';
                temp2 = '';
            }
        }
        //stores search string
        string = string + temp + temp2;
    }
    return string
}