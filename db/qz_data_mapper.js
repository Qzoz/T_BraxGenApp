
class Player{
    constructor(id,name,phno,pos,lname,origin,rank,uid){
        this.pid = id;
        this.name = name;
        this.phno = phno;
        this.pos = pos;
        this.lname = lname;
        this.origin = origin;
        this.rank = rank;
        this.uid = uid;
    }
    info(){
        return 'ID          => [ '+this.uid+
            ' ]\nName       => [ '+this.name+
            ' ]\nSurname   => [ '+this.lname+
            ' ]\nPhno.      => [ '+this.phno+
            ' ]\nOrigin     => [ '+this.origin+
            ' ]\nPosition   => [ '+this.pos+' ]';
    }
}

class Match{
    constructor(sno, mid, pid1, pid2, status, nextMatchID, winner){
        this.sno = sno;
        this.mid = mid;
        this.p1 = pid1;
        this.p2 = pid2;
        this.status = status
        this.nextMatchID = nextMatchID;
        this.winner = winner;
    }
}

class Tournament{
    constructor(tid, tname, tdate, tplayerCount, tbackImage, tdesc){
        this.tid = tid;
        this.tname = tname;
        this.tdate = tdate;
        this.tplayerCount = tplayerCount;
        this.tbackImage = tbackImage;
        this.tdesc = tdesc;
    }
}

module.exports.Tournament = Tournament
module.exports.Player = Player
module.exports.Match = Match
