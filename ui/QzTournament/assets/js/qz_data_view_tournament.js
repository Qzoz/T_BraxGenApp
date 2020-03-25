
// Tournament Variables

const tournamentPagesID = {
    tournamentDataViewBody : 'qz_tournamentDataViewBody',
    tournamentTableID : 'qz_tournamentTableValues',
    tournamentModalID : 'qz_tournamentFormModal',
    tournamentFormHeadingID : 'qz_tournament_form',
    tournamentIDSelected : 'tournamentIDSelected'
}
var tournamentList = []
var tournamentIDListMapping = {}
var tournamentUnderUpdateID = undefined;



/**
 * 0 -> ID
 * 1 -> name
 * 2 -> date
 * 3 -> playerCount
 * 4 -> description
 */
var tournamentFilterValues = ["", "", "", "", ""];

function getTournamentFormsIds(index){
    var tournamentFormIDs = ["qz_form_tournament_id", "qz_form_tournament_name", "qz_form_tournament_date", 
                        "qz_form_tournament_desc", "qz_form_tournament_file"]
    return tournamentFormIDs[index];
}

function createDummyTournaments(tournamentCtr) {
    for (var i = 1; i <= tournamentCtr; i++) {
        tournamentList.push(new Tournament(i, 'Torunament' + i, '15-07-'+(2000+i), i,
            undefined, 'desc-' + i));
            tournamentIDListMapping[i] = i-1;
    }
}

function tournamentFilterChanged(elem, filterTag) {
    tournamentFilterValues[parseInt(filterTag)] = document.getElementById(elem).value;
    tournamentFilterProcess();
}

function tournamentFilterProcess() {
    var isThereAnyFilter = true;
    var filteredList = []
    filteredList = tournamentList.filter((elem) => {
        return tournamentFilterPerformed(elem);
    })
    if (filteredList.length == 0) {
        isThereAnyFilter = false;
        tournamentFilterValues.forEach((e)=>{
            if(e != ""){
                isThereAnyFilter = true;
            }
        })
    }
    if (isThereAnyFilter) {
        displayTournamentDetailsInTable(filteredList);
    }
    else {
        displayTournamentDetailsInTable(tournamentList);
    }
}

function tournamentFilterPerformed(tournamentObj) {
    if (tournamentFilterValues[0] != '' &&
        checkStrForFilter('' + tournamentObj.tid, '' + tournamentFilterValues[0]) == false) {
        return false;
    }
    if (tournamentFilterValues[1] != '' &&
        checkStrForFilter('' + tournamentObj.tname, '' + tournamentFilterValues[1]) == false) {
        return false;
    }
    if (tournamentFilterValues[2] != '' &&
        checkStrForFilter('' + tournamentObj.tdate, '' + tournamentFilterValues[2]) == false) {
        return false;
    }
    if (tournamentFilterValues[3] != '' &&
        checkStrForFilter('' + tournamentObj.tplayerCount, '' + tournamentFilterValues[3]) == false) {
        return false;
    }
    if (tournamentFilterValues[4] != '' &&
        checkStrForFilter('' + tournamentObj.tdesc, '' + tournamentFilterValues[4]) == false) {
        return false;
    }
    return true;
}

function createTournamentRow(sno, tournamentObject) {
    var elem = document.createElement('tr');
    var tick = document.createElement('td');
    var tsNo = document.createElement('td');
    var ttId = document.createElement('td');
    var ttNm = document.createElement('td');
    var ttDt = document.createElement('td');
    var ttPc = document.createElement('td');
    var ttDs = document.createElement('td');
    var ttFi = document.createElement('td');
    var ttEd = document.createElement('td');

    var inp = document.createElement('input');
    inp.name = 'tournament';
    inp.type = 'radio';
    inp.className = "qz_form_input";
    inp.setAttribute('onclick', 'tournamentSelected(\''+tournamentObject.tid+'\')');

    var edA = document.createElement('a');
    edA.className = "qz_edit_link";
    edA.setAttribute('onclick', 'updateTournament(\''+tournamentObject.tid+'\')');
    edA.appendChild(document.createTextNode('edit'));

    tick.appendChild(inp);
    tsNo.appendChild(document.createTextNode(sno));
    ttId.appendChild(document.createTextNode(tournamentObject.tid));
    ttNm.appendChild(document.createTextNode(tournamentObject.tname));
    ttDt.appendChild(document.createTextNode(tournamentObject.tdate));
    ttPc.appendChild(document.createTextNode(tournamentObject.tplayerCount));
    ttDs.appendChild(document.createTextNode(tournamentObject.tdesc));
    var file = tournamentObject.tbackImage;
    if (file == null || file == undefined){
        ttFi.appendChild(document.createTextNode("--"));
    }
    else{
        ttFi.appendChild(document.createTextNode(file.substring(file.lastIndexOf("\\")+1, file.length)));
    }
    ttEd.appendChild(edA);

    elem.appendChild(tick);
    elem.appendChild(tsNo);
    elem.appendChild(ttId);
    elem.appendChild(ttNm);
    elem.appendChild(ttDt);
    elem.appendChild(ttPc);
    elem.appendChild(ttDs);
    elem.appendChild(ttFi);
    elem.appendChild(ttEd);

    return elem;
}

function displayTournamentDetailsInTable(tournaments) {
    var elem = document.getElementById(tournamentPagesID.tournamentTableID);
    elem.innerHTML = ""
    for (var i = 0; i < tournaments.length; i++) {
        elem.appendChild(createTournamentRow((i + 1), tournaments[i]));
    }
}

function createTournament(){
    var tournamentObj = new Tournament();
    var idF = document.getElementById(getTournamentFormsIds([0]));
    var nmF = document.getElementById(getTournamentFormsIds([1]));
    var dtF = document.getElementById(getTournamentFormsIds([2]));
    var dsF = document.getElementById(getTournamentFormsIds([3]));
    var bfF = document.getElementById(getTournamentFormsIds([4]));

    if (nmF.value == '') {
        alert('Please Enter Tournament Name');
        return;
    }
    else{
        tournamentObj.tname = nmF.value;
    }
    if (dtF.value == '' || dtF.value == undefined) {
        alert('Please Enter Tournament Date');
        return;
    }
    else{
        var dateSplitted = dtF.value.split('-');
        tournamentObj.tdate = dateSplitted[2]+'-'+dateSplitted[1]+'-'+dateSplitted[0];
    }
    tournamentObj.tid = idF.value;
    tournamentObj.tplayerCount = 0;
    tournamentObj.tdesc = dsF.value;
    tournamentObj.tbackImage = bfF.value;

    if (tournamentUnderUpdateID == undefined){
        // Insert To Data Base
        newTournament(tournamentObj, (msg) => {
            if (msg == "Success") {
                showInfoMessage(msg+'! Tournament Added');
                showAllTP();
            }
            else{
                showErrorMessage('Add Tournament', msg);
            }
        });
    }
    else{
        // Update To Data Base
        tournamentObj.tid = tournamentUnderUpdateID;
        editTournament(tournamentObj, (msg) => {
            if (msg == "Success") {
                showInfoMessage(msg+'! Tournament Update');
                showAllTP();
            }
            else{
                showErrorMessage('Update Tournament', msg);
            }
        })
    }
    clearTournamentFormField();
}

function updateTournament(tournamentID){
    var tournamentObj = tournamentList[tournamentIDListMapping[tournamentID]];
    tournamentUnderUpdateID = tournamentID;
    document.getElementById(tournamentPagesID.tournamentFormHeadingID).innerText = ' Update ';
    document.getElementById(getTournamentFormsIds([0])).value=tournamentObj.tid;
    document.getElementById(getTournamentFormsIds([1])).value=tournamentObj.tname;
    document.getElementById(getTournamentFormsIds([2])).value=tournamentObj.tdate;
    document.getElementById(getTournamentFormsIds([3])).value=tournamentObj.tdesc;
    document.getElementById(getTournamentFormsIds([4])).value=tournamentObj.tbackImage;
    toggleModal(tournamentPagesID.tournamentModalID);
}

function clearTournamentFormField(){
    tournamentUnderUpdateID = undefined;
    document.getElementById(getTournamentFormsIds([0])).value="";
    document.getElementById(getTournamentFormsIds([1])).value="";
    document.getElementById(getTournamentFormsIds([2])).value="";
    document.getElementById(getTournamentFormsIds([3])).value="";
    document.getElementById(getTournamentFormsIds([4])).value="";
    document.getElementById(tournamentPagesID.tournamentFormHeadingID).innerText = ' Add ';
    toggleModal(tournamentPagesID.tournamentModalID);
}

function imageFileSelected(){
    openSelectFileDialog((filepath) => {
        document.getElementById(getTournamentFormsIds(4)).value = filepath;
    });
}

function tournamentSelected(tournamentID){
    var tournamentObj = tournamentList[tournamentIDListMapping[tournamentID]];
    rounds = calcRoundsAndMatchesPerBlock(tournamentObj.tplayerCount).rounds*2;
    document.getElementById(tournamentPagesID.tournamentIDSelected).value = tournamentObj.tid+' - '+tournamentObj.tname;
    selectedTournamentID = tournamentID;
    tournamentsSelectionChanged();
}

// createDummyTournaments(5)
// displayTournamentDetailsInTable(tournamentList);

function loadTournamentList(t_list) {
    tournamentList = t_list;
    for (var i=0; i < t_list.length; i++) {
        tournamentIDListMapping[t_list[i].tid] = i;
    }
    displayTournamentDetailsInTable(tournamentList);
}