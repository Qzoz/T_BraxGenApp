const {ipcRenderer} = require("electron");

var trObject = undefined;

function showErrorMessage(from, messsage){
    ipcRenderer.send('show-error', [from, messsage]);
}

function showInfoMessage(message) {
    ipcRenderer.send('show-message', message);
}

function showConfirmMessage(message){
    return ipcRenderer.sendSync('show-confirm', message);
}

function sendDataToParent(type, message) {
    ipcRenderer.send('child-call', [type, message]);
}

ipcRenderer.on('parent-call', (e, msg) => {
    if (msg[0] == 'init') {
        initializeBraxData(msg[1]);
    }
    if (msg[0] == 'change-style') {
        changePageStyle(msg[1][0]);
        changeModalStyle(msg[1][1]);
    }
    if (msg[0] == "close-db"){
        db_close();
    }
})

// totalPlayersCount = 32;
// generateBrax('brax_holder', getMatchRectSize(totalPlayersCount));

// function createDummyPlayers(num){
//     for(var i=1; i<=num; i++){
//         let player = new Player(i, 'nm'+i, 123456789, 0, 'ln'+i, 'origin-'+i, undefined, 'uid-'+i);
//         playerIDlist.push(i);
//         insertPlayerDetail(player);
//     }
// }

// fillxBlocksBlank();
// createDummyPlayers(totalPlayersCount)
// fillxInitialBlocks();


function setBackgroundImage(path) {
    document.getElementById('brax_back').style = "background-image: url(\'"+path+"\');"
}

function getRelativePathFull(path) {
    var pathElems = path.split('\\');
    pathElems = pathElems.join("/");
    return pathElems;
}

function mapPlayersAndIDlist(playersList){
    playersList.forEach((player) => {
        players[player.pid] = player;
        playerIDlist.push(player.pid);
    }); 
}

function getMatchesListFromObjects(){
    var tempMatchList = []
    matcheIDlist.forEach((matchID)=>{
        tempMatchList.push(matches[matchID]);
    });
    return tempMatchList;
}

function mapPlayersWithMatchesAndDisplay(matchesList){
    matchesList.forEach((match) => {
        matches[match.mid] = match;
        matcheIDlist.push(match.mid);
        if (match.p1 != undefined) {
            match.p1 = players[match.p1];
        }
        if (match.p2 != undefined) {
            match.p2 = players[match.p2];
        }
        if (match.winner != undefined) {
            match.winner = players[match.winner];
        }
        blowLifeToMatch(match);
    });
}

function blowLifeToMatch(match) {
    if (match.mid == 'final' || match.mid == 'playoff') {
        if (match.p1 != undefined) {
            document.getElementById(match.p1.pos).innerText = match.p1.name;
        }
        if (match.p2 != undefined) {
            document.getElementById(match.p2.pos).innerText = match.p2.name;
        }
        if (match.status == "don") {
            if (match.p1 != undefined && match.p1.pid == match.winner.pid) {
                document.getElementById(match.p1.pos).parentNode.style.transform = 'scale(1.125)';
                document.getElementById(match.p2.pos).parentNode.style.transform = 'scale(0.875)';
                document.getElementById(match.p2.pos).parentNode.style.opacity = 0.6;
            }
            else {
                document.getElementById(match.p2.pos).parentNode.style.transform = 'scale(1.125)';
                document.getElementById(match.p1.pos).parentNode.style.transform = 'scale(0.875)';
                document.getElementById(match.p1.pos).parentNode.style.opacity = 0.6;
            }
        }
        return;
    }
    if (match.status == 'don') {
        if (match.p1 != undefined && match.winner.pid == match.p1.pid) {
            setTextOfChild1AtElemID(match.mid+'-p-1', '');
            if (match.p2 != undefined) {
                setTextOfChild1AtElemID(match.mid+'-p-2', match.p2.name);
            }
        }
        if (match.p2 != undefined && match.winner.pid == match.p2.pid) {
            setTextOfChild1AtElemID(match.mid+'-p-2', '');
            if (match.p1) {
                setTextOfChild1AtElemID(match.mid+'-p-1', match.p1.name);
            }
        }
        document.getElementById(match.mid).parentNode.style.opacity = 0.7;
    }
    else if (match.status == 'reg') {
        if (match.p1 != undefined) {
            setTextOfChild1AtElemID(match.mid+'-p-1', match.p1.name);
        }
        if (match.p2 != undefined) {
            setTextOfChild1AtElemID(match.mid+'-p-2', match.p2.name);
        }
    }
    else{
        setDisplayNone(match.mid);
    }
}

function updateDBforPlayer(player){
    if (player == undefined) {return;}
    editPlayer(trObject.tid, player, (msg) => {
        if (msg == 'Success') {
            // console.log('Updated Player | id => '+player.pid);
        }
        else{
            showErrorMessage('update DB', msg + ' to Update Player | id => '+player.id);
        }
    });
}

function updateDBforMatchPlayer(match) {
    editMatch(trObject.tid, match, (msg)=>{
        if (msg == "Success") {
            updateDBforPlayer(match.p1);
            updateDBforPlayer(match.p2);
        }
        else{
            showErrorMessage('update DB', msg + ' to Update Match | id => '+match.mid);
        }
    });
}

function initializeBraxData(t_obj) {
    trObject = t_obj;
    setBackgroundImage(getRelativePathFull(trObject.tbackImage));
    totalPlayersCount = trObject.tplayerCount;
    generateBrax('brax_holder', getMatchRectSize(totalPlayersCount));
    getAllPlayersOf(trObject.tid, (playersList) => {
        mapPlayersAndIDlist(playersList);
        getAllMatchesFor(trObject.tid, (matchesList)=>{
            if (matchesList.length == 0){
                fillxBlocksBlank();
                fillxInitialBlocks();
                showInfoMessage('Wait To Start');
                newBulkyMatches(trObject.tid, getMatchesListFromObjects(), (msg)=>{
                    if(msg == "Failed") {
                        showErrorMessage('Create Matches', msg);
                    }
                    else{
                        showInfoMessage(msg + '! Matches Created');
                    }
                });
            }
            else{
                mapPlayersWithMatchesAndDisplay(matchesList);
            }
        })
    });
}

sendDataToParent('get-tournament');