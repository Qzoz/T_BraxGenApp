
/**
 * 
 * @param {Number} x 
 * @param {Number} val
 * return the power to which if {x} is raised will be equal to {val}
 * 2^(4) = 16 -> (2, 16) returns (4) 
 */
function getPowOfXForVal(x, val){
    if(val <= 0 || x < 0) {
        return -1;
    }
    return Math.log(val) / Math.log(x)
}

/**
 * 
 * @param {Number} num 
 * return true for integer 
 * 
 */
function isWholeNumber(num){
    return Number.isInteger(num);
}


/**
 * 
 * @param {Number} power power at player Count
 * @param {Number} totalPlayers 
 * 
 * return nearest Power
 * 
 */
function findTheNearestPow(power, totalPlayers){
    var x = 2;
    for (var x=2; x <= power+1; x++){
        let powered = Math.pow(2, x);
        if (powered >= totalPlayers) {
            return x;
        }
    }
}

/**
 * 
 * @param {Number} totalPlayers 
 * count of players
 * Brackets are divided into 2 blocks lb,rb
 * return Number of matches and rounds per blocks
 * 
 */
function calcRoundsAndMatchesPerBlock(totalPlayers){
    if (totalPlayers < 4) {
        return {matches:0, rounds:0};
    }
    var pow = getPowOfXForVal(2, totalPlayers);
    if (isWholeNumber(pow)) {
        return {matches:(totalPlayers/4), rounds:(((pow-2)*2 + 2)/2)};
    }
    else{
        pow = findTheNearestPow(parseInt(pow), totalPlayers);
        var round = (((pow-2)*2 + 2)/2);
        return {matches:Math.pow(2, round-1), rounds:round};
    }
}


/**
 * 
 * @param {Number} matchesCount  => Max Matches that are 
 *                                  possible for a round for example
 *                                  players = 128, matchesCount = 32
 * @param {Number} roundsCount   => Column Nos 
 *                                  e.g.: 2^7 = 128, (7-2)*2 + 2 = 12
 * 
 * return object with @param roundsWitdh, @param roundCount, @param roundsBlocks List
 *          each elements of @param roundBlocks contains:
 *          @param bHeight  => height Of Each Block
 *          @param bMatches => No Of Matches Per Round
 * 
 */
function calcMatchRectSize(matchesCount, roundsCount){
    var dimen = {
        roundWidth:0,
        roundCount: roundsCount,
        roundBlocks:[]
    }
    dimen.roundWidth = 100 / roundsCount;
    for (var i = roundsCount/2 - 1; i >= 0; i--) {
        var blockTemp = {bMatches:0, bHeight:0};
        var pow2 = Math.pow(2, i);
        blockTemp.bMatches = matchesCount / pow2;
        blockTemp.bHeight = pow2 * matchBlockHeight;
        dimen.roundBlocks.unshift(blockTemp);
        dimen.roundBlocks.push(blockTemp);
    }
    return dimen;
}


function getMatchRectSize(totalPlayers){
    var rm = calcRoundsAndMatchesPerBlock(totalPlayers);
    return calcMatchRectSize(rm.matches, rm.rounds*2);
}