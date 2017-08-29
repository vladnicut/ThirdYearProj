
// demo file
var csv_folder = "public";
var csv_filename = "P1_allclear.csv";
var original_fname = "P1_allclear.csv"

var queryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    } 
    return query_string;
}();

function saveAsPng(visualisation) {
    var svg = document.getElementById(visualisation).outerHTML;

    if (visualisation === "eventdrops_chart")
        svg = document.getElementById(visualisation).children[0].outerHTML;
    var canvas = document.getElementById("canvas");

    canvg(canvas, svg);

    var img_url = canvas.toDataURL("image/png");
    document.getElementById("save_button").href = img_url;
}

if (queryString.filename != null) {
    csv_filename = queryString.filename;
    original_fname = queryString.name;
}

if (queryString.folder != null) {
    csv_folder = queryString.folder;
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        document.getElementById('original_fname_span').innerHTML = original_fname;       
    }
};
