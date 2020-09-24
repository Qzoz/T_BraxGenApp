const infoModalID = 'qz_playerInfoModal'
const confirmModalID = 'qz_confirmModal'
const matchInfoModalID = 'qz_matchInfoModal'
const finalRankModalID = 'qz_finalRankingModal';
var elemID = undefined;

function showInfoModal(playerObj){
    document.getElementById('qz_info_id').innerText = playerObj.uid;
    document.getElementById('qz_info_fname').innerText = playerObj.name;
    document.getElementById('qz_info_sname').innerText = playerObj.lname;
    document.getElementById('qz_info_phno').innerText = playerObj.phno;
    document.getElementById('qz_info_origin').innerText = playerObj.origin;
    document.getElementById('qz_info_match').innerText = playerObj.pos;
    toggleModal(infoModalID);
}


function showConfirmModal(playerObj, eid){
    elemID = eid;
    document.getElementById('qz_conf_fname').innerText = playerObj.name;
    document.getElementById('qz_conf_sname').innerText = playerObj.lname;
    document.getElementById('qz_conf_match').innerText = playerObj.pos;
    document.getElementById('qz_conf_origin').innerText = playerObj.origin;
    toggleModal(confirmModalID);
}

function playerProceedConfirmed(res, forceConf){
    if (forceConf && showConfirmMessage('Are You Sure!')) {
        confClicked(res, elemID, true);
        return;
    }
    confClicked(res, elemID);
}

function revertMatchResult(elem){
    var matchID = elem.dataset.target;
    revertTheMatchResult(matchID);
    toggleModal(matchInfoModalID);
}

function showMatchInfo(matchObj){
    document.getElementById('qz_match_info').innerText = matchObj.mid;
    if (matchObj.status == 'don') { 
        document.getElementById('qz_match_status').innerText = 'Completed';
    }
    else{
        document.getElementById('qz_match_status').innerText = 'Running';
    }
    // document.getElementById('qz_match_next').innerText = matchObj.nextMatchID;
    document.getElementById('qz_match_no').innerText = matchObj.sno;

    if (matchObj.p1 != undefined){
        document.getElementById('qz_match_id1').innerText = matchObj.p1.uid;
        document.getElementById('qz_match_fname1').innerText = matchObj.p1.name;
        document.getElementById('qz_match_sname1').innerText = matchObj.p1.lname;
        document.getElementById('qz_match_match1').innerText = matchObj.p1.pos;
        document.getElementById('qz_match_origin1').innerText = matchObj.p1.origin;
    }
    else{
        document.getElementById('qz_match_id1').innerText = "";
        document.getElementById('qz_match_fname1').innerText = "";
        document.getElementById('qz_match_sname1').innerText = "";
        document.getElementById('qz_match_match1').innerText = "";
        document.getElementById('qz_match_origin1').innerText = "";
    }
    if (matchObj.p2 != undefined) {
        document.getElementById('qz_match_id2').innerText = matchObj.p2.uid;
        document.getElementById('qz_match_fname2').innerText = matchObj.p2.name;
        document.getElementById('qz_match_sname2').innerText = matchObj.p2.lname;
        document.getElementById('qz_match_match2').innerText = matchObj.p2.pos;
        document.getElementById('qz_match_origin2').innerText = matchObj.p2.origin;
    }
    else{
        document.getElementById('qz_match_id2').innerText = "";
        document.getElementById('qz_match_fname2').innerText = "";
        document.getElementById('qz_match_sname2').innerText = "";
        document.getElementById('qz_match_match2').innerText = "";
        document.getElementById('qz_match_origin2').innerText = "";
    }

    document.getElementById('qz_backtrackBtn').dataset.target = matchObj.mid;

    toggleModal(matchInfoModalID);
}

function finalRankingModal(finalMatch, playOffMatch){
    if(finalMatch.p1.rank == 'first'){
        document.getElementById('qz_rank_1').innerText = finalMatch.p1.name+' '+finalMatch.p1.lname;
        document.getElementById('qz_rank_2').innerText = finalMatch.p2.name+' '+finalMatch.p2.lname;
    }
    else{
        document.getElementById('qz_rank_2').innerText = finalMatch.p1.name+' '+finalMatch.p1.lname;
        document.getElementById('qz_rank_1').innerText = finalMatch.p2.name+' '+finalMatch.p2.lname;
    }
    if(playOffMatch.p1.rank == 'third'){
        document.getElementById('qz_rank_3').innerText = playOffMatch.p1.name+' '+playOffMatch.p1.lname;
        document.getElementById('qz_rank_4').innerText = playOffMatch.p2.name+' '+playOffMatch.p2.lname;
    }
    else{
        document.getElementById('qz_rank_4').innerText = playOffMatch.p1.name+' '+playOffMatch.p1.lname;
        document.getElementById('qz_rank_3').innerText = playOffMatch.p2.name+' '+playOffMatch.p2.lname;
    }
    toggleModal(finalRankModalID);
}

function changeModalStyle(path){
    document.getElementById('qz_modal_style').href = path;
}