
// Players Variables

const playerPagesID = {
    playerDataViewBody: 'qz_playerDataViewBody',
    playerTableID: 'qz_playerTableValues',
    playerModalID: 'qz_playerFormModal',
    playerBulkModalID: 'qz_playerBulkFormModal',
    playerFormHeadingID: 'qz_player_form'
}


var playerList = []
var playerIDListMapping = {}
var playerUnderUpdateID = undefined

var playerBulkEntries = []
var playerDetailsSep = "-"


/**
 * 0 -> ID
 * 1 -> first name
 * 2 -> last name
 * 3 -> phone no
 * 4 -> origin
 * 5 -> position
 */
var playerFilterValues = ["", "", "", "", "", ""];

function getPlayerFormIds(index) {
    var playerFormIDs = ["qz_form_player_id", "qz_form_player_fname", "qz_form_player_lname",
        "qz_form_player_origin", "qz_form_player_phoneno"]
    return playerFormIDs[index];
}

function createDummyPlayers(playerCtr) {
    for (var i = 1; i <= playerCtr; i++) {
        playerList.push(new Player(i, 'nm' + i, 999999000 + i, i,
            'lnm' + i, 'origin-' + i, i));
        playerIDListMapping[i] = i - 1;
    }
}

function playerFilterChanged(elem, filterTag) {
    playerFilterValues[parseInt(filterTag)] = document.getElementById(elem).value;
    playerFilterProcess()
}

function playerFilterProcess() {
    var isThereAnyFilter = true;
    var filteredList = []
    filteredList = playerList.filter((elem) => {
        return playerFilterPerformed(elem);
    })
    if (filteredList.length == 0) {
        isThereAnyFilter = false;
        playerFilterValues.forEach((e) => {
            if (e != "") {
                isThereAnyFilter = true;
            }
        })
    }
    if (isThereAnyFilter) {
        displayPlayerDetailsInTable(filteredList);
    }
    else {
        displayPlayerDetailsInTable(playerList);
    }
}

function playerFilterPerformed(playerObj) {
    if (playerFilterValues[0] != '' &&
        checkStrForFilter('' + playerObj.uid, '' + playerFilterValues[0]) == false) {
        return false;
    }
    if (playerFilterValues[1] != '' &&
        checkStrForFilter('' + playerObj.name, '' + playerFilterValues[1]) == false) {
        return false;
    }
    if (playerFilterValues[2] != '' &&
        checkStrForFilter('' + playerObj.lname, '' + playerFilterValues[2]) == false) {
        return false;
    }
    if (playerFilterValues[3] != '' &&
        checkStrForFilter('' + playerObj.phno, '' + playerFilterValues[3]) == false) {
        return false;
    }
    if (playerFilterValues[4] != '' &&
        checkStrForFilter('' + playerObj.origin, '' + playerFilterValues[4]) == false) {
        return false;
    }
    if (playerFilterValues[5] != '' &&
        checkStrForFilter('' + getVisibleNameForMIDstr(rounds, playerObj.pos), 
            '' + playerFilterValues[5]) == false) {
        return false;
    }
    return true;
}

function createPlayerRow(sno, playerObject) {
    var elem = document.createElement('tr');
    var tsNo = document.createElement('td');
    var tpId = document.createElement('td');
    var tpFn = document.createElement('td');
    var tpLn = document.createElement('td');
    var tpPn = document.createElement('td');
    var tpOr = document.createElement('td');
    var tpPo = document.createElement('td');
    var tpRk = document.createElement('td');
    var tpEd = document.createElement('td');
    var tpDe = document.createElement('td');

    var deA = document.createElement('a');
    deA.className = "qz_delete_link";
    deA.setAttribute('onclick', 'deletePlayer(\'' + playerObject.pid + '\')');
    deA.appendChild(document.createTextNode('del'));
    var edA = document.createElement('a');
    edA.className = "qz_edit_link";
    edA.setAttribute('onclick', 'updatePlayer(\'' + playerObject.pid + '\')');
    edA.appendChild(document.createTextNode('edit'));

    tsNo.appendChild(document.createTextNode(sno));
    tpId.appendChild(document.createTextNode(playerObject.uid));
    tpFn.appendChild(document.createTextNode(playerObject.name));
    tpLn.appendChild(document.createTextNode(playerObject.lname));
    tpPn.appendChild(document.createTextNode(playerObject.phno));
    tpOr.appendChild(document.createTextNode(playerObject.origin));
    if (playerObject.pos != undefined) {
        if (rounds == 0) {
            tpPo.appendChild(document.createTextNode(playerObject.pos));
        }
        else{
            tpPo.appendChild(document.createTextNode(getVisibleNameForMIDstr(rounds, playerObject.pos)));
        }
    }
    else {
        tpPo.appendChild(document.createTextNode("--"));
    }
    if (playerObject.rank != undefined) {
        tpRk.appendChild(document.createTextNode(playerObject.rank));
    }
    else {
        tpRk.appendChild(document.createTextNode("--"));
    }
    tpEd.appendChild(edA);
    tpDe.appendChild(deA);

    elem.appendChild(tsNo);
    elem.appendChild(tpId);
    elem.appendChild(tpFn);
    elem.appendChild(tpLn);
    elem.appendChild(tpPn);
    elem.appendChild(tpOr);
    elem.appendChild(tpPo);
    elem.appendChild(tpRk);
    elem.appendChild(tpEd);
    elem.appendChild(tpDe);

    return elem;
}

function displayPlayerDetailsInTable(players) {
    var elem = document.getElementById(playerPagesID.playerTableID);
    elem.innerHTML = ""
    for (var i = 0; i < players.length; i++) {
        elem.appendChild(createPlayerRow((i + 1), players[i]));
    }
}

function addPlayer() {
    var playerObj = new Player();
    var idF = document.getElementById(getPlayerFormIds(0));
    var nmF = document.getElementById(getPlayerFormIds(1));
    var lnF = document.getElementById(getPlayerFormIds(2));
    var orF = document.getElementById(getPlayerFormIds(3));
    var phF = document.getElementById(getPlayerFormIds(4));
    if (idF.value == '') {
        alert('Please Enter Player ID');
        return;
    }
    else {
        playerObj.uid = idF.value;
    }

    if (nmF.value == '') {
        alert('Please Enter Player First Name');
        return;
    }
    else {
        playerObj.name = nmF.value;
    }
    if (lnF.value == '') {
        alert('Please Enter Player Last Name');
        return;
    }
    else {
        playerObj.lname = lnF.value;
    }
    if (orF.value == '') {
        alert('Please Enter Player Origin');
        return;
    }
    else {
        playerObj.origin = orF.value;
    }
    if (phF.value == '') {
        alert('Please Enter Player Phone No');
        return;
    }
    else {
        playerObj.phno = parseInt(phF.value);
    }

    if (playerUnderUpdateID == undefined) {
        // Insert To Data Base
        newPlayer(selectedTournamentID, playerObj, (msg) => {
            if (msg == "Success") {
                showInfoMessage(msg + "! Player Added");
                refreshPlayerList();
            }
            else {
                showErrorMessage('Add Player', msg);
            }
        });
    }
    else {
        // Update To Data Base
        playerObj.pid = playerUnderUpdateID;
        editPlayer(selectedTournamentID, playerObj, (msg) => {
            if (msg == "Success") {
                showInfoMessage(msg + "! Player Updated");
                refreshPlayerList();
            }
            else {
                showErrorMessage('Update Player', msg);
            }
        })
    }
    clearPlayerFormField();
}

function updatePlayer(playerID) {
    if (selectedTournamentID == undefined) {
        showInfoMessage("Please Select a Tournament and then perform Any Action in Player Section");
        return;
    }
    if (playerID == undefined) {   
        if (matchList.length > 0) {
            showInfoMessage("Matches Started");
            return;
        }
        clearPlayerFormField();
        return;
    }
    var playerObj = playerList[playerIDListMapping[playerID]];
    playerUnderUpdateID = playerID;
    document.getElementById(playerPagesID.playerFormHeadingID).innerText = ' Update ';
    document.getElementById(getPlayerFormIds(0)).value = playerObj.uid;
    document.getElementById(getPlayerFormIds(1)).value = playerObj.name;
    document.getElementById(getPlayerFormIds(2)).value = playerObj.lname;
    document.getElementById(getPlayerFormIds(3)).value = playerObj.origin;
    document.getElementById(getPlayerFormIds(4)).value = playerObj.phno;
    toggleModal(playerPagesID.playerModalID);
}

function clearPlayerFormField() {
    playerUnderUpdateID = undefined;
    document.getElementById(getPlayerFormIds(0)).value = "";
    document.getElementById(getPlayerFormIds(1)).value = "";
    document.getElementById(getPlayerFormIds(2)).value = "";
    document.getElementById(getPlayerFormIds(3)).value = "";
    document.getElementById(getPlayerFormIds(4)).value = "";
    document.getElementById(playerPagesID.playerFormHeadingID).innerText = ' Add ';
    toggleModal(playerPagesID.playerModalID);
}

function deletePlayer(playerID) {
    if (selectedTournamentID == undefined) {
        showInfoMessage('Please Select a Tournament and then perform Delete');
        return;
    }
    var playerObj = playerList[playerIDListMapping[playerID]];
    var res = showConfirmMessage('Are You Sure To Delete\n--------------------------------------\n\n' +
        playerObj.info() + '\n\n--------------------------------------');
    if (res) {
        removePlayer(selectedTournamentID, playerObj.pid, (msg) => {
            if (msg == "Success") {
                showInfoMessage(msg + "! Player Deleted");
                refreshPlayerList();
            }
            else {
                showErrorMessage('Delete Player', msg);
            }
        });
    }
}

function openAddBulkPlayer() {
    if (selectedTournamentID == undefined) { showInfoMessage("Select Tournament"); return;}
    if (matchList.length > 0) { showInfoMessage("Tournament Started"); return;}
    toggleModal(playerPagesID.playerBulkModalID);
}

function closeAddBulkPlayer() {
    document.getElementById('playerBulkDets').value = "";
    toggleModal(playerPagesID.playerBulkModalID);
}

function checkAndSetRows(elem) {
    var data = elem.value;
    var rows = data.split("\n");
    var newRows = []
    rows.forEach((row) => {
        if (row.length > 0) {
            var plf = row.split(playerDetailsSep);
            if (plf.length < playerBulkEntries.length) {
                row = row + "".padEnd(playerBulkEntries.length - plf.length, playerDetailsSep);
            }
            else if (plf.length > playerBulkEntries.length) {
                var plfl = plf.length;
                while (plfl > playerBulkEntries.length) {
                    plf.pop();
                    plfl -= 1;
                }
                row = plf.join(playerDetailsSep);
            }
            else {
                row = row + "".padEnd(playerBulkEntries.length - plf.length, playerDetailsSep);
            }
            newRows.push(row);
        }
    });
    if (playerBulkEntries.length == 0) {
        elem.value = "";
    }
    else {
        elem.value = newRows.join("\n");
    }
}

function changeBulkPlayerEntries(elem) {
    if (elem.type == "checkbox") {
        if (elem.checked) {
            playerBulkEntries.push(elem.value);
        }
        else {
            playerBulkEntries = playerBulkEntries.filter((entry) => {
                if (entry != elem.value) {
                    return true;
                }
            });
        }
    }
    if (elem.type == "radio") {
        var x = document.getElementById("playerBulkDets").value;
        var y = x.split(playerDetailsSep);
        playerDetailsSep = elem.value;
        x = y.join(playerDetailsSep);
        document.getElementById("playerBulkDets").value = x;
    }
}

function getDetailedBulkList() {
    var elem = document.getElementById("playerBulkDets");
    checkAndSetRows(elem);
    var x = elem.value.split("\n");
    if (x[x.length - 1].length == 0) {
        x.pop();
    }
    for (var i = 0; i < x.length; i++) {
        var y = x[i].split(playerDetailsSep);
        var tempObj = {}
        for (var j = 0; j < playerBulkEntries.length; j++) {
            tempObj[playerBulkEntries[j]] = y[j];
        }
        x[i] = tempObj;
    }
    return x;
}

function addBulkPlayersDetails() {
    var playerToAddList = getFinalisedListOfBulkPlayers();
    newBulkPlayers(selectedTournamentID, playerToAddList, (msg) => {
        if (msg == 'Failed') {
            showErrorMessage("Add Bulk Players", msg)
        }
    });
    closeAddBulkPlayer();
}

function getFinalisedListOfBulkPlayers(){
    var playerBulk = getDetailedBulkList();
    var playerObjsList = []
    var autoIDgenCtr = 1;
    var autoIDgenFlag = !playerBulkEntries.includes("uid")
    playerBulk.forEach((p)=>{
        var pl = new Player();
        pl.uid = p["uid"]
        if(autoIDgenFlag) {
            pl.uid = "uid-"+autoIDgenCtr;
            autoIDgenCtr += 1;
        }
        pl.name = p["ufn"];
        pl.lname = p["uln"];
        pl.phno = p["uph"];
        pl.origin = p["uor"];
        playerObjsList.push(pl);
    });
    return playerObjsList;
}

document.getElementById('playerBulkDets').addEventListener('keydown', function (e) {
    if (e.key == "Enter") {
        checkAndSetRows(e.target);
    }
    if (e.key == "Tab") {
        e.preventDefault();
    }
})

// createDummyPlayers(32)
// displayPlayerDetailsInTable(playerList);

function loadPlayerList(p_list) {
    playerList = p_list;
    for (var i = 0; i < p_list.length; i++) {
        playerIDListMapping[p_list[i].pid] = i;
    }
    displayPlayerDetailsInTable(playerList);
}