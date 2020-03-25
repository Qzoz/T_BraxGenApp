const { ipcRenderer } = require('electron');

var callbackFunction = undefined;

// Talk to mainJs using IPC to show Info
function showInfoMessage(msg) {
    ipcRenderer.send('show-message', msg);
}

// Talk to mainJs using IPC to show Confirm
function showConfirmMessage(msg) {
    return ipcRenderer.sendSync('show-confirm', msg);
}

// Talk to mainJs using IPC to show notifications
function showNotifications(msg) {
    ipcRenderer.send('show-notify', msg);
}

// Talk to mainJs using IPC to show Error
function showErrorMessage(from, err) {
    ipcRenderer.send('show-error', ['Renderer (Child) in -> ' + from, err.toString()]);
}

// Talk to mainJs using IPC to open File Dialog to Select File
function openSelectFileDialog(callback){
    ipcRenderer.send("child-call", ["file-open"]);
    callbackFunction = callback;
}

// Talk to mainJs using IPC to open File Save Dialog
function openSaveFileDialog(){
    return ipcRenderer.sendSync("child-call", ["file-save"]);
}

/**
 * Recieves IPC calls from mainJs
 * 
 * {file-open}      => recieves the image file from dialog in mainJs
 * {change-style}   => recieves the css file and updates the style
 * {close_db}       => closes the database
 */
ipcRenderer.on("parent-call", (e, msg) => {
    if (msg[0] == "file-open") {
        callbackFunction(msg[1]);
        callbackFunction = undefined;
    }
    if (msg[0] == 'change-style') {
        changeStyleCSS(msg[1]);
    }
    if (msg[0] == 'close_db') {
        db_close();
    }
});

/**
 * Initiates To start a tournament
 * for a selected Tournament
 */
function startTournament() {
    if (selectedTournamentID == undefined) {
        showInfoMessage('Select a Tournament to start');
        return;
    }
    var tournamentObject = tournamentList[tournamentIDListMapping[selectedTournamentID]];
    var res = showConfirmMessage("Confirm To Start Tournament");
    if (res) {
        db_close();
        ipcRenderer.send('child-call', ['start-tournament', tournamentObject]);
    }
}
