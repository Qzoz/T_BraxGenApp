
// Matches Variables
const matchPagesID = {
    matchDataViewBody : 'qz_matchDataViewBody',
    matchTableID : 'qz_matchTableValues',
    matchModalID : 'qz_matchFormModal'
}

// Match Object List
var matchList = []
// Match ID List Mapper {ID:Pos}
var matchIDListMapping = {}

/**
 * 0 -> no
 * 1 -> player name
 * 2 -> winner no
 * 3 -> status
 * 4 -> id
 */
var matchFilterValues = ["", "", "", "", "",""];

/**
 * 
 * @param {String} key      => key contains the type of ID
 * @param {Number} index    => index contains the position of ID
 * 
 * return ID for Match ID
 */
function getMatchFormIds(key, index){
    var matchInfoIDs = {
        'm': ["qz_match_status", "qz_match_no", "qz_match_id"],
        'p1': ["qz_match_info_p_1", "qz_match_id_p_1", "qz_match_fn_p_1", "qz_match_ln_p_1",
                "qz_match_or_p_1", "qz_match_ph_p_1"],
        'p2': ["qz_match_info_p_2", "qz_match_id_p_2", "qz_match_fn_p_2", "qz_match_ln_p_2",
                "qz_match_or_p_2", "qz_match_ph_p_2"]
    }
    return matchInfoIDs[key][index];
}

/**
 * 
 * @param {Number} matchCtr => Match Counter
 * 
 * creates Dummy Matches for Testing Purpose
 */
function createDummyMatches(matchCtr) {
    var plCtr = 0
    for (var i = 1; i <= matchCtr; i++) {
        matchList.push(new Match(i, 'm-' + i, playerList[plCtr],  playerList[plCtr+1],
            'don', 'next-' + (i+1), undefined));
        if(i%2==0){
            matchList[i-1].winner = matchList[i-1].p1;
        }
        else{
            matchList[i-1].winner = matchList[i-1].p2;
        }
        plCtr += 2;
        matchIDListMapping['m-'+i] = i-1;
    }
}

/**
 * 
 * @param {Element} elem        => Element For Filter Change Detect
 * @param {String} filterTag    => Tags For example ['1', '2', '3', .....]
 * 
 */
function matchFilterChanged(elem, filterTag) {
    matchFilterValues[parseInt(filterTag)] = document.getElementById(elem).value;
    matchFilterProcess()
}

/**
 * processed The Filter for List
 */
function matchFilterProcess() {
    var isThereAnyFilter = true;
    var filteredList = []
    filteredList = matchList.filter((elem) => {
        return matchFilterPerformed(elem);
    })
    if (filteredList.length == 0) {
        isThereAnyFilter = false;
        matchFilterValues.forEach((e)=>{
            if(e != ""){
                isThereAnyFilter = true;
            }
        })
    }
    if (isThereAnyFilter) {
        displayMatchDetailsInTable(filteredList);
    }
    else {
        displayMatchDetailsInTable(matchList);
    }
}


/**
 * 
 * @param {Object} matchObj  => contains the match Object to be checked
 * return true or false
 * 
 */
function matchFilterPerformed(matchObj) {
    if (matchFilterValues[0] != '' &&
        checkStrForFilter('' + matchObj.sno, '' + matchFilterValues[0]) == false) {
        return false;
    }
    if (matchFilterValues[1] != '') {
        if (matchObj.p1 == undefined && matchObj.p2 == undefined) {
            return false;
        }
        if ((matchObj.p1 != undefined && checkStrForFilter('' + matchObj.p1.name + ' ' + matchObj.p1.lname,
            '' + matchFilterValues[1]) == false) &&
            (matchObj.p2 != undefined && checkStrForFilter('' + matchObj.p2.name + ' ' + matchObj.p2.lname,
            '' + matchFilterValues[1]) == false)) {
            return false;
        }
    }
    if (matchFilterValues[2] != '' && matchObj.winner != undefined &&
        checkStrForFilter('' + matchObj.winner.name, '' + matchFilterValues[2]) == false) {
        return false;
    }
    if (matchFilterValues[3] != '' &&
        checkStrForFilter('' + matchObj.status, '' + matchFilterValues[3]) == false) {
        return false;
    }
    if (matchFilterValues[4] != '' &&
        checkStrForFilter('' + getVisibleNameForMIDstr(rounds, matchObj.mid),
             '' + matchFilterValues[4]) == false) {
        return false;
    }
    return true;
}

/**
 * 
 * @param {Object} matchObject   => contains the match Object for row creation of table
 * 
 * returns row {<tr>} for table
 */
function createMatchRow(matchObject) {
    var elem = document.createElement('tr');
    var msNo = document.createElement('td');
    var mpl1 = document.createElement('td');
    var mpl2 = document.createElement('td');
    var mstt = document.createElement('td');
    var mmid = document.createElement('td');

    msNo.appendChild(document.createTextNode(matchObject.sno));
    if (matchObject.p1 != undefined) {
        mpl1.appendChild(document.createTextNode(matchObject.p1.name + ' ' + matchObject.p1.lname));
    }
    else{
        mpl1.appendChild(document.createTextNode("--"));
    }
    if (matchObject.p2 != undefined) {
        mpl2.appendChild(document.createTextNode(matchObject.p2.name + ' ' + matchObject.p2.lname));
    }
    else{
        mpl2.appendChild(document.createTextNode("--"));
    }
    if(matchObject.status == 'don') {
        mstt.innerHTML = 'Finished';
    } else {
        mstt.innerHTML = 'Running';
    }
    mmid.appendChild(document.createTextNode(getVisibleNameForMIDstr(rounds, matchObject.mid)));

    if (matchObject.status == 'don') {
        if (matchObject.p1 == matchObject.winner) {
            mpl1.classList.add('qz_winner_dk');
            mpl2.classList.add('qz_loser_dk');
        }
        else{
            mpl2.classList.add('qz_winner_dk');
            mpl1.classList.add('qz_loser_dk');
        }
    }

    elem.appendChild(msNo);
    elem.appendChild(mpl1);
    elem.appendChild(mpl2);
    elem.appendChild(mstt);
    elem.appendChild(mmid);

    elem.setAttribute('ondblclick', 'showMatchInfo(\''+matchObject.mid+'\')');

    return elem;
}

/**
 * 
 * @param {List} matches    => matches List to be displayed on the table
 * 
 */
function displayMatchDetailsInTable(matches) {
    var elem = document.getElementById(matchPagesID.matchTableID);
    elem.innerHTML = ""
    for (var i = 0; i < matches.length; i++) {
        elem.appendChild(createMatchRow(matches[i]));
    }
}

/**
 * 
 * @param {String} matchID  => contains Match ID for which Info Modal
 */
function showMatchInfo(matchID){
    clearMatchFormField();
    var matchObj = matchList[matchIDListMapping[matchID]];
    
    if(matchObj.status == 'don') {
        document.getElementById(getMatchFormIds('m', 0)).innerHTML = 'Finished';
    } else {
        document.getElementById(getMatchFormIds('m', 0)).innerHTML = 'Running';
    }
    document.getElementById(getMatchFormIds('m', 1)).innerHTML = matchObj.sno;
    document.getElementById(getMatchFormIds('m', 2)).innerHTML = matchObj.mid;

    // Player 1

    if (matchObj.p1 != undefined) {
        document.getElementById(getMatchFormIds('p1', 1)).innerHTML = matchObj.p1.uid;
        document.getElementById(getMatchFormIds('p1', 2)).innerHTML = matchObj.p1.name;
        document.getElementById(getMatchFormIds('p1', 3)).innerHTML = matchObj.p1.lname;
        document.getElementById(getMatchFormIds('p1', 4)).innerHTML = matchObj.p1.origin;
        document.getElementById(getMatchFormIds('p1', 5)).innerHTML = matchObj.p1.phno;
    }
    else{
        document.getElementById(getMatchFormIds('p1', 1)).innerHTML = "";
        document.getElementById(getMatchFormIds('p1', 2)).innerHTML = "";
        document.getElementById(getMatchFormIds('p1', 3)).innerHTML = "";
        document.getElementById(getMatchFormIds('p1', 4)).innerHTML = "";
        document.getElementById(getMatchFormIds('p1', 5)).innerHTML = "";
    }

    // Player 2

    if (matchObj.p2 != undefined) {
        document.getElementById(getMatchFormIds('p2', 1)).innerHTML = matchObj.p2.uid;
        document.getElementById(getMatchFormIds('p2', 2)).innerHTML = matchObj.p2.name;
        document.getElementById(getMatchFormIds('p2', 3)).innerHTML = matchObj.p2.lname;
        document.getElementById(getMatchFormIds('p2', 4)).innerHTML = matchObj.p2.origin;
        document.getElementById(getMatchFormIds('p2', 5)).innerHTML = matchObj.p2.phno;
    }
    else{
        document.getElementById(getMatchFormIds('p2', 1)).innerHTML = "";
        document.getElementById(getMatchFormIds('p2', 2)).innerHTML = "";
        document.getElementById(getMatchFormIds('p2', 3)).innerHTML = "";
        document.getElementById(getMatchFormIds('p2', 4)).innerHTML = "";
        document.getElementById(getMatchFormIds('p2', 5)).innerHTML = "";
    }

    if (matchObj.status == 'don') {
        if (matchObj.p1 == matchObj.winner) {
            document.getElementById(getMatchFormIds('p1', 0)).classList.add('qz_winner');
            document.getElementById(getMatchFormIds('p2', 0)).classList.add('qz_loser');
        }
        else{
            document.getElementById(getMatchFormIds('p2', 0)).classList.add('qz_winner');
            document.getElementById(getMatchFormIds('p1', 0)).classList.add('qz_loser');
        }
    }

    // Toggle Modal for Match
    toggleModal(matchPagesID.matchModalID);
}

// Clears Match Modal Styles
function clearMatchFormField(){
    var pl = document.getElementById(getMatchFormIds('p1', 0));
    var pr = document.getElementById(getMatchFormIds('p2', 0));
    pl.classList.remove('qz_loser');
    pl.classList.remove('qz_winner');
    pr.classList.remove('qz_loser');
    pr.classList.remove('qz_winner');
}


/**
 * deletes All MAtches of a Tournament
 */
function resetMatchListOfSelectedT(){
    if (selectedTournamentID == undefined) {return;}
    var res = showConfirmMessage("Sure to Delete All Matches");
    if (!res) {return;}
    resetTMatches(selectedTournamentID, (message) => {
        if (message == "Failed") {
            showErrorMessage("Resetting Match", message);
        }
        else{
            showAllTP();
        }
    })
}

/**
 * 
 * @param {List} m_list => contains Match List
 * 
 * displays the match details
 */
function loadMatchList(m_list) {
    matchList = m_list;
    for (var i=0; i < m_list.length; i++) {
        matchIDListMapping[m_list[i].mid] = i;
    }
    displayMatchDetailsInTable(matchList);
}



// Below is for dummy test

// createDummyMatches(16)
// displayMatchDetailsInTable(matchList);
