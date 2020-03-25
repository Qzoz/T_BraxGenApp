var sqlite3 = require('sqlite3').verbose();

var mydb = getDatabase();

function getDatabase() {
    return new sqlite3.Database('tournaments.db', (err) => {
        if (err) {
            console.log('GET DB Error -> ');
            console.log(err);
        }
    });
}

function detachDB() {
    mydb.close((err) => {
        handleSQLErrors(err);
    });
    mydb = undefined;
}

function attachDB() {
    mydb = getDatabase();
}

function handleSQLErrors(err) {
    if (err) {
        console.log('Error -> ');
        console.log(err);
    }
}

// ID HANDLING STARTS

function insertIDs(tag, val) {
    mydb.serialize(function () {
        mydb.run("INSERT INTO ids VALUES(?, ?)", [tag, val], (err) => {
            handleSQLErrors(err);
        });
    });
}

function updateIDs(tag, val) {
    mydb.serialize(function () {
        mydb.run("UPDATE ids SET ival=?  WHERE(inam=?)", [val, tag], (err) => {
            handleSQLErrors(err);
        });
    });
}

function getIDs(tag, callback) {
    mydb.serialize(function () {
        mydb.get("SELECT * FROM ids WHERE(inam=?)", [tag], (err, row) => {
            handleSQLErrors(err);
            callback(row);
        });
    });
}

// ID HANDLING ENDS

// TOURNAMENTS SCRIPTS STARTS

function insertTournament(tname, tdate, tdesc, tfile, callback) {
    mydb.serialize(function () {
        getIDs('tid', (row) => {
            if (row) {
                var tid = row.ival + 1;
                mydb.run("INSERT INTO tournaments VALUES(?,?,?,?,?)", [
                    tid, tname, tdate, tdesc, tfile
                ], (err) => {
                    handleSQLErrors(err);
                    if (err) {
                        callback('Failed');
                    }
                    else {
                        updateIDs('tid', tid);
                        insertIDs('p-' + tid, 0);
                        callback('Success');
                    }
                });
            }
            else {
                callback('Failed');
            }
        });
    });
}

function updateTournament(tid, tdate, tdesc, tfile, callback) {
    mydb.serialize(function () {
        mydb.run("UPDATE tournaments SET tdate=?, tdesc=?, tfile=? WHERE(tid=?)", [
            tdate, tdesc, tfile, tid
        ], (err) => {
            handleSQLErrors(err);
            if (err == undefined) {
                callback('Success');
            }
            else {
                callback('Failed');
            }
        });
    });
}

function fetchAllTournaments(callback) {
    mydb.serialize(function () {
        mydb.all("SELECT *, (SELECT count(pid) FROM players p WHERE(p.ptid = t.tid)) as tplctr FROM tournaments t", (err, rows) => {
            handleSQLErrors(err);
            if (err) {
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    });
}

// TOURNAMENTS SCRIPTS ENDS

// PLAYER SCRIPTS STARTS

function insertPlayer(tournamentId, first_name, last_name, origin, phoneNo, uid, rank, position, callback) {
    mydb.serialize(function () {
        getIDs('p-' + tournamentId, (row) => {
            if (row) {
                var pid = row.ival + 1;
                mydb.run("INSERT INTO players VALUES(?,?,?,?,?,?,?,?,?)", [
                    tournamentId, 'p-' + pid, first_name, last_name, origin, phoneNo, uid, rank, position
                ], (err) => {
                    handleSQLErrors(err);
                    if (err) {
                        callback('Failed');
                    }
                    else {
                        updateIDs('p-' + tournamentId, pid);
                        callback('Success');
                    }
                });
            }
            else {
                callback('Failed');
            }
        });
    });
}

function insertBulkPlayer(tournamentId, pid, first_name, last_name, origin, phoneNo, uid, rank, position, callback) {
    mydb.serialize(function () {
        mydb.run("INSERT INTO players VALUES(?,?,?,?,?,?,?,?,?)", [
            tournamentId, pid, first_name, last_name, origin, phoneNo, uid, rank, position
        ], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else{
                callback('Success');
            }
        });
    });
}

function updatePlayer(tournamentId, plID, first_name, last_name, origin, phoneNo, uid, rank, position, callback) {
    mydb.serialize(function () {
        mydb.run("UPDATE players SET pfn=?, pln=?, por=?, pph=?, puid=?, prnk=?, ppos=? WHERE(ptid=? and pid=?) ", [
            first_name, last_name, origin, phoneNo, uid, rank, position, tournamentId, plID
        ], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else {
                callback('Success');
            }
        });
    });
}

function deletePlayer(tournamentId, playerId, callback) {
    mydb.serialize(function () {
        mydb.run("DELETE FROM players Where(ptid=? and pid=?)", [tournamentId, playerId], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else {
                callback('Success');
            }
        })
    });
}

function fetchAllPlayersOfTournament(tournamentId, callback) {
    mydb.serialize(function () {
        mydb.all("SELECT * FROM players WHERE(ptid=?)", [tournamentId], (err, rows) => {
            handleSQLErrors(err);
            if (err) {
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    })
}

function fetchAllPlayers(callback) {
    mydb.serialize(function () {
        mydb.all("SELECT * FROM players", (err, rows) => {
            handleSQLErrors(err);
            if (err) {
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    })
}

// PLAYER SCRIPTS ENDS

// MATCHES SCRIPTS STARTS

function insertMatch(tournamentId, mSno, mmid, player1, player2, winner, status, nextMatchID, callback) {
    mydb.serialize(function () {
        mydb.run("INSERT INTO matches VALUES(?,?,?,?,?,?,?,?)", [
            tournamentId, mmid, mSno, player1, player2, winner, status, nextMatchID
        ], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else {
                callback('Success');
            }
        });
    });
}

function updateMatch(tournamentId, mmid, player1, player2, winner, status, nextMatchID, callback) {
    mydb.serialize(function () {
        mydb.run("UPDATE matches SET mpone=?,mptwo=?,mwinner=?,mstatus=?,mnmid=? WHERE(mtid=? and mmid=?)", [
            player1, player2, winner, status, nextMatchID, tournamentId, mmid
        ], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else {
                callback('Success');
            }
        });
    });
}

function deleteMatch(tournamentId, callback) {
    mydb.serialize(function () {

        mydb.run("DELETE FROM matches WHERE(mtid=?)", [tournamentId], (err) => {
            handleSQLErrors(err);
            if (err) {
                callback('Failed');
            }
            else {
                mydb.run("UPDATE players SET ppos=null, prnk=null WHERE(ptid=?)", [tournamentId], (err) => {
                    if (err) {
                        callback('Failed');
                    }
                    else{
                        callback('Success');
                    }
                });
            }
        });
    });
}

function fetchAllMatchesForTournament(tournamentId, callback) {
    mydb.serialize(function () {
        mydb.all("SELECT * FROM matches WHERE(mtid=?) ORDER BY msno asc", [tournamentId], (err, rows) => {
            handleSQLErrors(err);
            if (err) {
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    });
}

function fetchAllMatches(callback) {
    mydb.serialize(function () {
        mydb.all("SELECT * FROM matches", (err, rows) => {
            handleSQLErrors(err);
            if (err) {
                callback([]);
            }
            else {
                callback(rows);
            }
        });
    });
}

// MATCHES SCRIPTS ENDS

// INITIAL SCRIPTS STARTS
function db_init_script() {
    mydb.serialize(function () {
        mydb.run("CREATE TABLE IF NOT EXISTS ids (" +
            "inam TEXT PRIMARY KEY," +
            "ival INTEGER" +
            ");", (err) => {
                handleSQLErrors(err);
                getIDs('tid', (row) => {
                    if (row == undefined) {
                        insertIDs('tid', 100);
                    }
                });
            });
        mydb.run("CREATE TABLE IF NOT EXISTS tournaments (" +
            "tid INTEGER PRIMARY KEY," +
            "tname TEXT UNIQUE," +
            "tdate TEXT," +
            "tdesc TEXT," +
            "tfile TEXT" +
            ");", (err) => {
                handleSQLErrors(err);
            });
        mydb.run("CREATE TABLE IF NOT EXISTS players (" +
            "ptid INTEGER," +
            "pid INTEGER," +
            "pfn TEXT," +
            "pln TEXT," +
            "por TEXT," +
            "pph INTEGER," +
            "puid TEXT," +
            "prnk TEXT," +
            "ppos TEXT," +
            "PRIMARY KEY(ptid, puid)" +
            "UNIQUE(ptid, pfn, pln, puid)" +
            ");", (err) => {
                handleSQLErrors(err);
            });
        mydb.run("CREATE TABLE IF NOT EXISTS matches (" +
            "mtid INTEGER," +
            "mmid TEXT," +
            "msno INTEGER," +
            "mpone INTEGER," +
            "mptwo INTEGER," +
            "mwinner INTEGER," +
            "mstatus TEXT," +
            "mnmid TEXT," +
            "PRIMARY KEY(mtid, mmid)" +
            ");", (err) => {
                handleSQLErrors(err);
            });
    });
}

// INITIAL SCRIPT ENDS

//TEST

// insertTournament('FIFA', '20-03-2020', 'Knockout Tournament', 'file1.jpg', (msg)=>{
//     console.log(msg);
// });
// insertTournament('TEKKEN', '22-03-2020', 'KO Tournament', 'file2.jpg', (msg)=>{
//     console.log(msg);
// });
// insertTournament('MK11', '25-03-2020', 'Fighting Tournament', 'file3.jpg', (msg)=>{
//     console.log(msg);
// });
// insertTournament('Pubg', '30-03-2020', 'Mobile Tournament', 'file4.jpg', (msg)=>{
//     console.log(msg);
// });

// updateTournament(101, '10-03-2020', 'KnockOut Tournament', 'file11.jpg', (msg)=>{
//     console.log(msg);
// });

// fetchAllTournaments((tournamentList)=>{
//     tournamentList.forEach((elem)=>{
//         console.log(elem);
//     });
// });

// insertPlayer(101, 'Muzammil', 'Ahsan', 'BTech CSE', 467891325, 1700100357, '', '', (msg) => {
//     console.log(msg);
// })
// insertPlayer(102, 'Mohammad Zaid', 'Quaraishi', 'BTech CSE', 7080471786, 1700102357, '', '', (msg) => {
//     console.log(msg);
// })
// insertPlayer(103, 'Mohammad Faiz', 'Quraishi', 'BTech CSE', 7080471786, 1700102357, '', '', (msg) => {
//     console.log(msg);
// })
// insertPlayer(104, 'Zamin', 'Abbas', 'BTech CSE', 123456789, 1700102007, '', '', (msg) => {
//     console.log(msg);
// })

// insertPlayer(103, 'Mohammad Zaid', 'Quaraishi', 'BTech CSE', 7080471786, 1700102357, '', '', (msg) => {
//     console.log(msg);
// })
// insertPlayer(104, 'Prakhar', 'Singh', 'BTech CSE', 7080471786, 1700102357, '', '', (msg) => {
//     console.log(msg);
// })
// insertPlayer(102, 'Nikhil', 'Pal', 'BTech CSE', 987654321, 1700102111, '', '', (msg) => {
//     console.log(msg);
// })

// updatePlayer(104, 'p-2', 'Zamin', 'Abbas', 'Agra', 987451621, 1700102007, '2', '5', (msg) => {
//     console.log(msg);
// });

// fetchAllPlayersOfTournament(104, (players)=>{
//     players.forEach((elem)=>{
//         console.log(elem);
//     });
// });

// fetchAllPlayers((players)=>{
//     players.forEach((elem)=>{
//         console.log(elem);
//     });
// });

// insertMatch(104, 1, 'm-1', 'p-1', 'p-2', '', 'reg', 'f', (msg)=>{
//     console.log(msg);
// });
// insertMatch(104, 2, 'm-2', 'p-2', 'p-1', '', 'reg', 'f', (msg)=>{
//     console.log(msg);
// });
// insertMatch(103, 1, 'm-1', 'p-1', 'p-2', '', 'reg', 'f', (msg)=>{
//     console.log(msg);
// });
// insertMatch(103, 2, 'm-2', 'p-2', 'p-1', '', 'reg', 'f', (msg)=>{
//     console.log(msg);
// });

// updateMatch(104, 'm-1', 'p-1', 'p-2', 'p-1', 'don', 'f', (msg)=>{
//     console.log(msg);
// });
// updateMatch(104, 'm-2', 'p-2', 'p-1', 'p-1', 'don', 'f', (msg)=>{
//     console.log(msg);
// });

// fetchAllMatchesForTournament(104, (matches)=>{
//     matches.forEach((elem)=>{
//         console.log(elem);
//     });
// });

// fetchAllMatches((matches)=>{
//     matches.forEach((elem)=>{
//         console.log(elem);
//     });
// });


module.exports.attachDB = attachDB
module.exports.detachDB = detachDB
module.exports.db_init_script = db_init_script

module.exports.fetchAllTournaments = fetchAllTournaments
module.exports.fetchAllPlayers = fetchAllPlayers
module.exports.fetchAllPlayersOfTournament = fetchAllPlayersOfTournament
module.exports.fetchAllMatches = fetchAllMatches
module.exports.fetchAllMatchesForTournament = fetchAllMatchesForTournament
module.exports.insertTournament = insertTournament
module.exports.insertPlayer = insertPlayer
module.exports.insertBulkPlayer = insertBulkPlayer
module.exports.insertMatch = insertMatch
module.exports.updateTournament = updateTournament
module.exports.updatePlayer = updatePlayer
module.exports.updateMatch = updateMatch
module.exports.deletePlayer = deletePlayer;
module.exports.deleteMatch = deleteMatch;

module.exports.getIDs = getIDs
module.exports.updateIDs = updateIDs

