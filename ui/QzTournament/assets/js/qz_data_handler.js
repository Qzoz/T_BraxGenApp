const {db_close, getAllTournaments, getAllPlayers, getAllMatches, getAllMatchesFor, getAllPlayersOf,
        newTournament, newPlayer, removePlayer, newBulkPlayers, resetTMatches,
        editTournament, editPlayer} = require("../../db/qz_data_translate");
const {Tournament, Player, Match} = require("../../db/qz_data_mapper");

const fs = require("fs");

var selectedTournamentID = undefined;
var rounds = 0;


/**
 * 
 * @param {List} matchesList contains match obtained from database
 * this contains player ID only
 * 
 * return mapped list of matches with player replaced with its ID
 * 
 */
function getMapPlayerWithMatches(matchesList){
    matchesList.forEach((match) => {
        match.p1 = playerList[playerIDListMapping[match.p1]];
        match.p2 = playerList[playerIDListMapping[match.p2]];
        match.winner = playerList[playerIDListMapping[match.winner]];
    });
    return matchesList;
}

/**
 * fetch and load playerList and match list of a tournament
 */
function tournamentsSelectionChanged(){
    getAllPlayersOf(selectedTournamentID, (playersList) => {
        loadPlayerList(playersList);
        getAllMatchesFor(selectedTournamentID, (matchesList) => {
            loadMatchList(getMapPlayerWithMatches(matchesList));
        });
    });
}

/**
 * fetch {Tournaments, Players {matches}} and loads it in table
 */
function refreshPlayerList(){
    getAllTournaments((tournamentsList) => {
        loadTournamentList(tournamentsList);
    });
    getAllPlayersOf(selectedTournamentID, (playersList) => {
        loadPlayerList(playersList);
        getAllMatchesFor(selectedTournamentID, (matchesList) => {
            loadMatchList(getMapPlayerWithMatches(matchesList));
        });
    });
    selectedTournamentID = undefined;
    document.getElementById(tournamentPagesID.tournamentIDSelected).value = "";
}

/**
 * reloads the Tournament and Players
 */
function showAllTP(){
    rounds = 0;
    getAllTournaments((tournamentsList) => {
        loadTournamentList(tournamentsList);
    });
    getAllPlayers((playersList) => {
        loadPlayerList(playersList)
    });
    selectedTournamentID = undefined;
    try {
        document.getElementById(tournamentPagesID.tournamentIDSelected).value = "";
    } catch (err) {}
}

/**
 * Exportss Selected Tournament As HTML
 */
function exportSelectedTournamentAsHTML(){
    if (selectedTournamentID == undefined) {showInfoMessage("Select a Tournament To Export");return;}
    const filePathToSave = openSaveFileDialog();
    if (filePathToSave != undefined && filePathToSave != null) {
        let c_tour = tournamentList[tournamentIDListMapping[selectedTournamentID]];
        let p_list = playerList;
        let m_list = matchList;
        fs.writeFile(filePathToSave, getExportedHtmlString(c_tour, p_list, m_list, rounds), (err) => {
            if (err) {
                showErrorMessage("Exporting as HTML", err);
            }
            else{
                showNotifications("Exported Succesfully");
            }
        })
    }
    else{
        // showInfoMessage("File Not Exported");
    }
}

// Load All Tournament and Players
showAllTP();

