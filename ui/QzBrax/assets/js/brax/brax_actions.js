
function playerClicked(elem) {
    var eid = elem.parentNode.id;
    var match = getMatchObject((eid.substr(0, eid.length-4)));
    if(match.status == 'don'){
        return;
    }
    if(eid.charAt(eid.length-1) == '1'){
        showConfirmModal(match.p1, eid);
    }
    else{
        showConfirmModal(match.p2, eid);
    }
}

function winnersInfinalClicked(eid) {
    var match = getMatchObject((eid.substr(0, eid.length-4)));
    if (getMatchObject('final').status == 'don' && getMatchObject('playoff').status == 'don') {
        finalRankingModal(getMatchObject('final'),getMatchObject('playoff'));
    }
    if(match.status == 'don'){
        return;
    }
    if (match.p1 == undefined || match.p2 == undefined){
        return;
    }
    if(eid.charAt(eid.length-1) == '1'){
        showConfirmModal(match.p1, eid);
    }
    else{
        showConfirmModal(match.p2, eid);
    }
}

function confClicked(res, eid, isForceful){
    if(eid == undefined){
        return;
    }
    if(res){
        if ((eid.substr(0, eid.length-4)) == 'final' || (eid.substr(0, eid.length-4)) == 'playoff') {
            winnerDecided((eid.substr(0, eid.length-4)), eid.charAt(eid.length-1), isForceful);
        }
        else {
            proceedPlayer((eid.substr(0, eid.length-4)), eid.charAt(eid.length-1), isForceful);
        }
    }
}

function infoClicked(elem) {
    var eid = elem.parentNode.id;
    infoClickedResolved(eid);
}

function infoClickedResolved(eid){
    var match = getMatchObject((eid.substr(0, eid.length-4)));
    if(eid.charAt(eid.length-1) == '1'){
        if (match.p1 == undefined) {
            return;
        }
        showInfoModal(match.p1);
    }
    else{
        if (match.p2 == undefined) {
            return;
        }
        showInfoModal(match.p2);
    }
}

function matchClicked(elem) {
    var meid = elem.nextSibling.id;
    if (meid) {
        showMatchInfo(getMatchObject(meid))
    }
}

function toggleFloatingButton(elem) {
    var floatContent = document.getElementById(elem.dataset.target);
    if (floatContent.style.display == 'block') {
        floatContent.style.display = '';
        elem.children[0].innerHTML = '&plus;';
    }
    else{
        floatContent.style.display = 'block';
        elem.children[0].innerHTML = '&times;';
    }
}

function revertTheMatchResult(matchID){
    var matchObj = getMatchObject(matchID);
    if(matchObj.status != 'don'){return;}
    if(matchObj.nextMatchID.substr(0, matchObj.nextMatchID.length-4) == 'final' ||
        matchObj.nextMatchID.substr(0, matchObj.nextMatchID.length-4) == 'playoff'){return;}
    var nextMatchObj = getMatchObject(matchObj.nextMatchID.substr(0, matchObj.nextMatchID.length-4));
    if(nextMatchObj.status == 'don'){return;}
    if(!showConfirmMessage('Are You Sur! To revert Back')) {return;}

    setTextOfChild1AtElemID(matchObj.nextMatchID, "");
    if (nextMatchObj.p1 != undefined && nextMatchObj.p1.pid == matchObj.winner.pid) {
        nextMatchObj.p1 = undefined;
    }
    else {
        nextMatchObj.p2 = undefined;
    }
    if (nextMatchObj.p1 == undefined && nextMatchObj.p2 == undefined) {
        setDisplayNone(nextMatchObj.mid);
        nextMatchObj.status = undefined;
    }
    if (matchObj.p1 != undefined && matchObj.winner.pid == matchObj.p1.pid) {
        matchObj.p1.pos = matchObj.mid;
        setTextOfChild1AtElemID(matchObj.mid+'-p-1', matchObj.p1.name);
    }
    else {
        matchObj.p2.pos = matchObj.mid;
        setTextOfChild1AtElemID(matchObj.mid+'-p-2', matchObj.p2.name);
    } 
    matchObj.status = 'reg';
    matchObj.winner = undefined;
    document.getElementById(matchObj.mid).parentNode.style.opacity = 1;
    updateDBforMatchPlayer(matchObj);
    updateDBforMatchPlayer(nextMatchObj);
}

function changePageStyle(path) {
    document.getElementById('qz_page_style').href = path;
}


