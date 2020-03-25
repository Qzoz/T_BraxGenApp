const {Tournament, Player, Match} = require("../../../db/qz_data_mapper");
const {getAllMatchesFor, getAllPlayersOf, editPlayer,
     newBulkyMatches, editMatch, db_close} = require("../../../db/qz_data_translate");

/**
 * Declarations
 */
var totalPlayersCount = 0;
var rounds = 0;
var roundMatches = [];
var matches = {}
var matcheIDlist = [];
var players = {}
var playerIDlist = [];

/**
 * Used in Generation
 */
var matchCount = 0;
/**
 * min Height = 80px
 */
const matchBlockHeight = 160;

function insertMatchDetail(matchObject){
    matches[matchObject.mid] = matchObject;
}

function getMatchObject(matchID){
    return matches[matchID];
}

function insertPlayerDetail(playerObject){
    players[playerObject.pid] = playerObject;
}

function getPlayerObject(playerID){
    return players[playerID];
}