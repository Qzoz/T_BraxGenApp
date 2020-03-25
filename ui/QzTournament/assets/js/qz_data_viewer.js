

function toggleCollapsable(elem){
    var ceid = elem.dataset.target
    togglerForCollapsable(ceid);
}

function togglerForCollapsable(eid){
    var elem = document.getElementById(eid);
    if(elem.style.display == 'none'){
        elem.style.display = 'block';
    }
    else{
        elem.style.display = 'none';
    }
}

// function for Searching String

function checkStrForFilter(checkStr, checkParamStr) {
    if (checkParamStr.length > checkStr) {
        return false;
    }
    if (checkStr.search(checkParamStr) == -1) {
        return false;
    }
    return true;
}

function changeStyleCSS(path) {
    document.getElementById('qz_page_style').href = path;
}

function getVisibleNameForMIDstr(rounds, matchID){
    if (matchID == undefined) {return;}
    var split_list = matchID.split("-");
    if (split_list[0] == "final" || split_list[0] == "playoff") {return split_list[0];}
    var round_id = parseInt(split_list[1]);
    if (round_id > rounds/2) {
        round_id = rounds - round_id; 
    }
    else if (round_id == rounds/2 || round_id == rounds/2-1) {
        return "semi-final";
    }
    else{
        round_id += 1;
    }
    return "round - "+round_id;
}