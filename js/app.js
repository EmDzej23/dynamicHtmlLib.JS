$(document).ready(function(){
    AbstractDHElement.prototype.addCssFiles(["bootstrap/css/bootstrap.min.css","css/style.css","css/jquery.json-view.css"]);
    AbstractDHElement.prototype.addPageTitle("DynamicHtmlLib");
    AbstractDHElement.prototype.appendData("body", DHElement("h2","col-md-12","","Convert JSON to DataTable").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","row col-md-12","container","").html);
    AbstractDHElement.prototype.appendData("#container", DHElement("div","col-md-3","fifth_1","").html);
    AbstractDHElement.prototype.appendData("#container", DHElement("div","col-md-9","fifth","").html);
    AbstractDHElement.prototype.appendData("#fifth", DHElement("div","col-md-12","fifth_2","").html);
    DHElement("button","btn btn-primary col-md-8","btngd",'GET DATA FROM URL',["onclick:getData()"]).appendTo("#fifth_1");     
    DHEmptyElement("input","col-md-10","url_input","https://jsonplaceholder.typicode.com/users/","text",[],"width:450px;margin:5px;").appendTo("#fifth_1");
    DHElement("button","btn btn-primary col-md-8","btngd",'GET DATA FROM JSON',["onclick:getDataFromJson()"]).appendTo("#fifth_1");     
    DHElement("textarea","col-md-12","json_input","{\"KEY\":\"VALUE\"}",[],"width:450px;margin:5px;height:10%").appendTo("#fifth_1");     
    DHElement("div","col-md-12","json_tree","").appendTo("#fifth_1"); 
});
function prepareForWriting(data) {
    writeText(data);
    prettyPrint(data);
}
function writeText(data) {
    $("#fifth_2").children().remove();
    AbstractDHElement.prototype.appendData("#fifth_2",MakeResponsiveDHTable(data));
    InitDataTable("#new_table");
}
function getData() {
    var url = $("#url_input").val();
    var d = AbstractDHElement.prototype.ajax("GET", url, "json", "application/json", "", "", "");
    d.executeAjax(prepareForWriting);
}

function getDataFromJson() {
    var data = JSON.parse($("#json_input").val());
    prepareForWriting(data);
    prettyPrint(data);
}

function prettyPrint(data) {
    var pretty = JSON.stringify(data, undefined, 4);
    document.getElementById('json_input').value = pretty;
    var players = {};
    players.data = data;
    $('#json_tree').children().remove();
    $('#json_tree').jsonView(JSON.stringify(players));
}
