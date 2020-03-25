
/**
 * 
 * @param {Number} matchNo  => holds the match Number 1 - n
 * @param {Number} roundNo  => holds roundNo 0 - n [n -> {2 (4),12 (128)}] (x) -> x players
 * @param {Char} lrToken    => whether tile is in left or right 'l' or 'r'
 * 
 * return HTML CODE a Match Tile
 * 
 */
function getMatchTileGen(matchNo, roundNo, lrToken) {
    var matchID = "r-" + roundNo + "-m-" + matchNo;

    var p1i = document.createElement('p');
    var p1 = document.createElement('p');
    var p2i = document.createElement('p');
    var p2 = document.createElement('p');

    p1.setAttribute("class", "qz_brax_name");
    p1.setAttribute("onclick", "playerClicked(this)");
    p1i.setAttribute("class", "qz_brax_info");
    p1i.setAttribute("onclick", "infoClicked(this)");
    p1i.innerHTML = "&ii;";

    p2.setAttribute("class", "qz_brax_name");
    p2.setAttribute("onclick", "playerClicked(this)");
    p2i.setAttribute("class", "qz_brax_info");
    p2i.setAttribute("onclick", "infoClicked(this)");
    p2i.innerHTML = "&ii;";

    var p1d = document.createElement('div');
    p1d.setAttribute("class", "qz_brax_pl pl_1 h50 qz_brax_pl_" + lrToken + " disFlex alignCenter");
    p1d.setAttribute("id", matchID + "-p-1");
    p1d.appendChild(p1i);
    p1d.appendChild(p1);

    var p2d = document.createElement('div');
    p2d.setAttribute("class", "qz_brax_pl pl_2 h50 qz_brax_pl_" + lrToken + " disFlex alignCenter");
    p2d.setAttribute("id", matchID + "-p-2");
    p2d.appendChild(p2i);
    p2d.appendChild(p2);

    var finalDiv = document.createElement('div');
    finalDiv.setAttribute("class", "qz_brax_match_tile");
    finalDiv.setAttribute("id", matchID);

    finalDiv.appendChild(p1d);
    finalDiv.appendChild(p2d);

    return finalDiv;
}

/**
 * 
 * @param {Number} matchNo contains MatchNo
 * 
 * return String of HTML CODE to added as innerHTML for Left
 * 
 */
function createMatchLeft(matchNo, roundNo) {
    var matchInfoBtn = document.createElement('p');
    matchInfoBtn.setAttribute("class", "posAbs");
    matchInfoBtn.setAttribute("onclick", "matchClicked(this)");
    matchInfoBtn.innerHTML = matchCount;
    var matchDiv = document.createElement('div');
    matchDiv.setAttribute("class", "qz_brax_match qz_brax_match_left posRel");
    matchDiv.appendChild(matchInfoBtn);
    matchDiv.appendChild(getMatchTileGen(matchNo, roundNo, 'l'));

    return matchDiv;
}

/**
 * 
 * @param {Number} matchNo contains MatchNo
 * 
 * return String of HTML CODE to added as innerHTML for Right
 * 
 */
function createMatchRight(matchNo, roundNo) {
    var matchInfoBtn = document.createElement('p');
    matchInfoBtn.setAttribute("class", "posAbs");
    matchInfoBtn.setAttribute("onclick", "matchClicked(this)");
    matchInfoBtn.innerHTML = matchCount;
    var matchDiv = document.createElement('div');
    matchDiv.setAttribute("class", "qz_brax_match qz_brax_match_right posRel");
    matchDiv.appendChild(matchInfoBtn);
    matchDiv.appendChild(getMatchTileGen(matchNo, roundNo, 'r'));

    return matchDiv;
}


/**
 * 
 * @param {Number} bMatches contains number of matches in a round
 * @param {Number} bHeight contains clock height for a particular column
 * @param {Boolean} isLeft contains whether the tile is in left or Not
 * 
 * return String of HTML CODE to add as innerHTML
 * 
 */
function createMatchBlocksAndTiles(parent, bMatches, bHeight, isLeft, roundNo, brax_flag) {
    for (var i = 0; i < bMatches; i++) {
        var blockDiv = document.createElement("div");
        blockDiv.setAttribute("class", "qz_brax_block disFlex justifyCenter alignCenter");
        blockDiv.setAttribute("style", "height:" + bHeight + "px");
        matchCount++;
        if (brax_flag) {
            var brackDiv = document.createElement("div");
            brackDiv.setAttribute("style", "height:" + bHeight / 2 + "px");
            if (isLeft) {
                brackDiv.setAttribute("class", "qz_brax_block_l disFlex justifyCenter alignCenter");
                brackDiv.appendChild(createMatchLeft(i, roundNo));
            }
            else {
                brackDiv.setAttribute("class", "qz_brax_block_r disFlex justifyCenter alignCenter");
                brackDiv.appendChild(createMatchRight(i, roundNo));
            }
            blockDiv.appendChild(brackDiv);
        }
        else{
            if (isLeft) {
                blockDiv.appendChild(createMatchLeft(i, roundNo));
            }
            else {
                blockDiv.appendChild(createMatchRight(i, roundNo));
            }
        }
        parent.appendChild(blockDiv);
    }
}


/**
 * 
 * @param {Number} roundWidth width Of the columns or Rounds
 * 
 * return Rounds Column Node (Element)
 * 
 */
function createRoundsCol(roundWidth) {
    var elem = document.createElement("div");
    elem.className = "qz_brax_round disInBlock";
    elem.style.width = roundWidth + "%";
    return elem;
}

/**
 * 
 * @param {String} elemID Id of element in which it is to be appended
 * @param {JS Object} dimen dimen Object having roundWidth, roundBlocks List
 * 
 * Generates Brackets with desired Input
 * 
 */
function generateBrax(elemID, dimen) {
    var elem = document.getElementById(elemID);
    rounds = dimen.roundCount;
    for (var i = 0; i < dimen.roundCount; i++) {
        elem.appendChild(createRoundsCol(dimen.roundWidth));
        roundMatches.push(dimen.roundBlocks[i].bMatches);
    }
    let len = dimen.roundCount;
    for (var i = 0; i < len / 2; i++) {
        createMatchBlocksAndTiles(elem.children[i], dimen.roundBlocks[i].bMatches,
            dimen.roundBlocks[i].bHeight, true, i, (i == 0)?false:true);
        createMatchBlocksAndTiles(elem.children[len - i - 1], dimen.roundBlocks[len - i - 1].bMatches,
            dimen.roundBlocks[len - i - 1].bHeight, false, (len - i - 1), (i == 0)?false:true);
    }
}



