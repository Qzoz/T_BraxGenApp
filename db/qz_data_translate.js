const dao = require('./qz_db_dao');
const { Tournament, Player, Match } = require("./qz_data_mapper")

dao.attachDB();

dao.db_init_script();

function db_close() {
    dao.detachDB();
}

// -------------------------------------------------
// Fetcher Translations Starts

function getAllTournaments(callback) {
    dao.fetchAllTournaments((rows) => {
        callback(generateTournamentList(rows));
    });
}

function getAllPlayers(callback) {
    dao.fetchAllPlayers((rows) => {
        callback(generatePlayerList(rows));
    });
}

function getAllMatches(callback) {
    dao.fetchAllMatches((rows) => {
        callback(generateMatchList(rows));
    });
}

function getPlayersOf(tournamentID, callback) {
    dao.fetchAllPlayersOfTournament(tournamentID, (rows) => {
        callback(generatePlayerList(rows));
    });
}

function getMatchesFor(tournamentID, callback) {
    dao.fetchAllMatchesForTournament(tournamentID, (rows) => {
        callback(generateMatchList(rows));
    })
}

// Fetcher Ends
// -------------------------------------------------
// Insert Translation Starts

function addTournament(tournamentObj, callback) {
    dao.insertTournament(
        tournamentObj.tname,
        tournamentObj.tdate,
        tournamentObj.tdesc,
        tournamentObj.tbackImage,
        (message) => {
            if (message == 'Success') {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        }
    )
}

function addPlayer(tournamentID, playerObj, callback) {
    dao.insertPlayer(
        tournamentID,
        playerObj.name,
        playerObj.lname,
        playerObj.origin,
        playerObj.phno,
        playerObj.uid,
        getNullIfUndefined(playerObj.rank),
        getNullIfUndefined(playerObj.pos),
        (message) => {
            if (message == 'Success') {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        }
    )
}

function addBulkPlayers(tournamentID, players, callback) {
    dao.getIDs('p-' + tournamentID, (r) => {
        var idS = undefined
        if (r) { idS = r.ival; }
        else { callback('Failed') }
        dao.updateIDs('p-' + tournamentID, idS + players.length);
        players.forEach((p) => {
            idS += 1;
            if (p.lname == undefined) { p.lname = " " }
            if (p.phno == undefined) { p.phno = 0 }
            if (p.origin == undefined) { p.origin = "Asgard" }
            dao.insertBulkPlayer(
                tournamentID,
                'p-' + idS,
                p.name,
                p.lname,
                p.origin,
                p.phno,
                p.uid,
                getNullIfUndefined(p.rank),
                getNullIfUndefined(p.pos),
                (message) => {
                    if (message == 'Failed') {
                        callback('Failed');
                    }
                }
            )
        });
    });
}

function addBulkyMatches(tournamentID, matchList, callback) {
    matchList.forEach((match) => {
        dao.insertMatch(
            tournamentID,
            match.sno,
            match.mid,
            cleanTheMatchPlayers(match.p1),
            cleanTheMatchPlayers(match.p2),
            cleanTheMatchPlayers(match.winner),
            getNullIfUndefined(match.status),
            getNullIfUndefined(match.nextMatchID),
            (message) => {
                if (message == "Failed") {
                    callback("Failed");
                }
            }
        )
    });
}

// Insert Ends
// -------------------------------------------------
// Update Translation Starts

function editTournament(tournamentObj, callback) {
    dao.updateTournament(
        tournamentObj.tid,
        tournamentObj.tdate,
        tournamentObj.tdesc,
        tournamentObj.tbackImage,
        (message) => {
            if (message == 'Success') {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        }
    )
}

function editPlayer(tournamentID, playerObj, callback) {
    dao.updatePlayer(
        tournamentID,
        playerObj.pid,
        playerObj.name,
        playerObj.lname,
        playerObj.origin,
        playerObj.phno,
        playerObj.uid,
        getNullIfUndefined(playerObj.rank),
        getNullIfUndefined(playerObj.pos),
        (message) => {
            if (message == 'Success') {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        }
    )
}

function editMatch(tournamentID, matchObj, callback) {
    dao.updateMatch(
        tournamentID,
        matchObj.mid,
        cleanTheMatchPlayers(matchObj.p1),
        cleanTheMatchPlayers(matchObj.p2),
        cleanTheMatchPlayers(matchObj.winner),
        getNullIfUndefined(matchObj.status),
        getNullIfUndefined(matchObj.nextMatchID),
        (message) => {
            if (message == 'Success') {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        }
    )
}

// Update Ends
// -------------------------------------------------


// Delete Starts

function deletePlayer(tournamentID, playerID, callback) {
    dao.deletePlayer(tournamentID, playerID, (message) => {
        if (message == 'Success') {
            callback('Success');
        }
        else {
            callback('Failed');
        }
    });
}

function resetMatches(tournamentID, callback) {
    dao.deleteMatch(tournamentID, (message) => {
        if (message == 'Success') {
            callback('Success');
        }
        else {
            callback('Failed');
        }
    });
}

// Delete Ends

// Other Stuffs ObjectList Creation

function generateTournamentList(t_rows) {
    var tournamentList = []
    t_rows.forEach((row) => {
        var temp_t = new Tournament(
            row.tid,
            row.tname,
            row.tdate,
            row.tplctr,
            row.tfile,
            row.tdesc
        );
        tournamentList.push(temp_t);
    });
    return tournamentList;
}

function generatePlayerList(p_rows) {
    var playerList = []
    p_rows.forEach((row) => {
        var temp_p = new Player(
            row.pid,
            row.pfn,
            row.pph,
            getUndefinedIfNull(row.ppos),
            row.pln,
            row.por,
            getUndefinedIfNull(row.prnk),
            row.puid
        )
        playerList.push(temp_p);
    });
    return playerList;
}

function generateMatchList(m_rows) {
    var matchList = []
    m_rows.forEach((row) => {
        var temp_m = new Match(
            row.msno,
            row.mmid,
            getUndefinedIfNull(row.mpone),
            getUndefinedIfNull(row.mptwo),
            getUndefinedIfNull(row.mstatus),
            getUndefinedIfNull(row.mnmid),
            getUndefinedIfNull(row.mwinner)
        )
        matchList.push(temp_m);
    });
    return matchList;
}

// Get Undefined Null 

function getUndefinedIfNull(val) {
    if (val == null) {
        return undefined;
    }
    return val;
}

// Get Null If Undefined

function getNullIfUndefined(val) {
    if (val == undefined) {
        return null;
    }
    return val;
}

// Match Cleaning For DB

function cleanTheMatchPlayers(player) {
    if (player == undefined) {
        return null;
    }
    return player.pid;
}


module.exports.newTournament = addTournament;
module.exports.newPlayer = addPlayer;
module.exports.newBulkyMatches = addBulkyMatches;
module.exports.newBulkPlayers = addBulkPlayers;

module.exports.editTournament = editTournament;
module.exports.editPlayer = editPlayer;
module.exports.editMatch = editMatch;

module.exports.getAllTournaments = getAllTournaments;
module.exports.getAllPlayers = getAllPlayers;
module.exports.getAllMatches = getAllMatches;

module.exports.getAllPlayersOf = getPlayersOf;
module.exports.getAllMatchesFor = getMatchesFor;

module.exports.removePlayer = deletePlayer;
module.exports.resetTMatches = resetMatches

module.exports.db_close = db_close;

