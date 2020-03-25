const dash = "----";
function getStyleHtmlString() {
    var styleString = "" +
        "* {box-sizing: border-box;margin: 0;padding: 0;font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;}\n" +
        ".key_value_holder {border-bottom: 2px solid black;border-top: 1px solid black;text-align: center;padding: 5px 0;}\n" +
        ".key_value_holder>h1,.key_value_holder>h3 {padding: 10px 0 0 0;}\n" +
        ".key_value_holder>h4,.key_value_holder>h5 {padding: 5px 0 10px 0;}\n" +
        ".row_holder>.key_value_holder {display: inline-block;width: 49%;}\n" +
        ".table_holder {border-top: 1px solid black;border-bottom: 2px solid black;}\n" +
        ".table_holder table {margin: 25px auto;}\n" +
        ".heading {padding: 10px;}\n" +
        "table td{padding: 5px 10px;}\n";
    return "<style>\n" + styleString + "</style>\n";
}

function getHeadHtmlString() {
    var headStr = "<meta charset=\'UTF-8\'>\n<title>Output Details</title>\n" + getStyleHtmlString();
    return "<head>\n" + headStr + "</head>\n";
}

function get_T_DetailsHtmlString(t_obj) {
    var t_str_list = [
        "<div class=\'key_value_holder\'>\n<h1>" + t_obj.tname + "</h1>\n<h4>Tournament Name</h4>\n</div>",
        "<div class=\'row_holder\'>\n<div class=\'key_value_holder\'>\n<h3>" + t_obj.tdate + "</h3>\n<h5>Date</h5>",
        "</div>\n<div class=\'key_value_holder\'>\n<h3>" + t_obj.tplayerCount + "</h3>\n<h5>Player Count</h5>\n</div>\n</div>",
        "<div class=\'key_value_holder\'>\n<img src=\'" + t_obj.tbackImage + "\' width=\'360\' alt=\'Image\'>",
        "<h3><u>" + t_obj.tbackImage + "</u></h3>\n<h5>Background Image</h5>\n</div>",
        "<div class=\'key_value_holder\'>\n<h3>"+t_obj.tdesc+"</h3>\n<h5>Description</h5>\n</div>"
    ];
    return t_str_list.join("\n");
}

function getDashForUNdefined(val) {
    if (val == undefined) {
        return dash;
    }
    return val;
}

function get_P_tableRows(p_objs, rounds) {
    var rowsStr = []
    var snoCtr = 1;
    p_objs.forEach((p) => {
        var temp_str = "<tr>\n" +
            "<td>" + snoCtr + "</td>\n" +
            "<td>" + p.uid + "</td>\n" +
            "<td>" + p.name + " " + p.lname + "</td>\n" +
            "<td>" + p.phno + "</td>\n" +
            "<td>" + p.origin + "</td>\n" +
            "<td>" + getDashForUNdefined(getVisibleNameForMIDstr(rounds, p.pos)) + "</td>\n" +
            "<td>" + getDashForUNdefined(p.rank) + "</td>\n" +
            "</tr>";
        snoCtr++;
        rowsStr.push(temp_str);
    });
    return rowsStr.join("\n");
}

function get_P_DetailsHtmlString(p_objs, rounds) {
    var p_str = "<div class=\'table_holder\'>\n<table border=\'5\'>\n<thead>\n<tr>\n" +
        "<th>Sno</th>\n<th>U ID</th>\n<th>Full Name</th>\n<th>Phone No</th>\n<th>Origin</th>\n<th>Ends At</th>\n<th>Rank</th>\n" +
        "</tr>\n</thead>\n<tbody>\n" + get_P_tableRows(p_objs, rounds) + "\n</tbody>\n</table>\n</div>\n";
    return p_str;
}

function get_M_tableRows(m_objs, rounds) {
    var rowsStr = []
    m_objs.forEach((m) => {
        var temp_str = "<tr>\n" +
            "<td>"+m.sno+"</td>\n" +
            "<td>"+getVisibleNameForMIDstr(rounds, m.mid)+"</td>\n" +
            "<td>"+((m.p1 == undefined)? dash:m.p1.uid)+"</td>\n" +
            "<td>"+((m.p1 == undefined)? dash:(m.p1.name +" "+m.p1.lname))+"</td>\n" +
            "<td>"+((m.p2 == undefined)? dash:m.p2.uid)+"</td>\n" +
            "<td>"+((m.p2 == undefined)? dash:(m.p2.name +" "+m.p2.lname))+"</td>\n" +
            "<td>"+((m.status == undefined)? dash: (m.status == "don")? "Finished":"Registered")+"</td>\n" +
            "<td>"+((m.winner == undefined)? dash:m.winner.uid)+"</td>\n" +
            "<td>"+((m.winner == undefined)? dash:(m.winner.name +" "+m.winner.lname))+"</td>\n" +
            "</tr>";
            rowsStr.push(temp_str);
    });
    return rowsStr.join("\n");
}

function get_M_DetailsHtmlString(m_objs, rounds) {
    if (m_objs.length == 0) {return "<h3 class=\'key_value_holder\'>No Yet Started</h3>"}
    var m_str = "<div class=\'table_holder\'>\n<table border=\'5\'>\n<thead>\n<tr>\n" +
        "<th>Sno</th>\n<th>Match ID</th>\n<th colspan=\'2\'>Player 1</th>\n<th colspan=\'2\'>Player 2</th>\n" +
        "<th>Status</th>\n<th colspan=\'2\'>Winner</th>\n</tr>\n</thead>\n<tbody>\n" +
        ((m_objs.length > 0)?get_M_tableRows(m_objs, rounds):"") + "\n</tbody>\n</table>\n</div>\n";
    return m_str;
}

function getBodyHtmlString(t_obj, p_obj, m_obj, rounds) {
    var bodyStr = "" +
        "<h2 class=\'heading\'>Tournament Details</h2>\n" + get_T_DetailsHtmlString(t_obj, rounds) + "\n" +
        "<h2 class=\'heading\'>Player Table</h2>\n" + get_P_DetailsHtmlString(p_obj, rounds) + "\n" +
        "<h2 class=\'heading\'>Matches Table</h2>\n" + get_M_DetailsHtmlString(m_obj, rounds) + "\n";
    return "<body>\n" + bodyStr + "</body>\n";
}

function getExportedHtmlString(t_obj, p_obj, m_obj, rounds) {
    try {
        return "<!DOCTYPE html>\n<html>\n" + getHeadHtmlString() +
            getBodyHtmlString(t_obj, p_obj, m_obj, rounds) + "\n</html>\n"   
    } catch (err) {
        showErrorMessage('Creating Export String', err);
    }
}