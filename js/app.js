$(document).ready(function(){
    AbstractDHElement.prototype.addCssFiles(["bootstrap/css/bootstrap.min.css","css/style.css"]);
    AbstractDHElement.prototype.addPageTitle("DynamicHtmlLib");
    //Adding first and second div to body - half width and half height DHElement(tag,class,id,value,optionalAttributes)
    AbstractDHElement.prototype.appendData("body", DHElement("div","col-md-6 row-6","first","").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","col-md-6 row-6","second","").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","col-md-6 row-6","third","").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","col-md-6 row-6","forth","").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","col-md-6 row-6","fifth","").html);
    //Adding welcome text to previously added div
    DHElement("p","","",'HOW TO: AbstractDHElement.prototype.appendData("#first", DHElement("h1","","firstTitle","Welcome to web, DynamicHtmlLib").html)').appendTo("#first");
    AbstractDHElement.prototype.appendData("#first", DHElement("h1","","firstTitle","Welcome to web, Dynamic HTML Library!!!").html);
    
    DHElement("h2","","","Basic Table").appendTo("#second");
    DHElement("p","","",'HOW TO: DHTable("table table-responsive","my_table",["Firstname","Lastname","Email"],[["Marko","Jereminov","PP@example.com"],["Pavle","Jovanovic","pj@example.com"],["Jovan","Djokovic","dj@example.com"]]).appendTo("#second");').appendTo("#second");
    
    DHTable("table table-responsive","my_table",["Firstname","Lastname","Email"],[["Marko","Jereminov","PP@example.com"],["Pavle","Jovanovic","pj@example.com"],["Jovan","Djokovic","dj@example.com"]]).appendTo("#second");
    DHElement("p","","",'HOW TO: DHList("","",["","active",""],["Prvi2","Drugi2","Treci2"],"",[]).appendTo("#third");').appendTo("#third");    
    DHList("list-group","",["list-group-item trans","list-group-item active","list-group-item trans"],["Prvi2","Drugi2","Treci2"],"",[]).appendTo("#third");
    //getData();
    DHElement("button","btn btn-primary","btngd",'GET DATA',["onclick:getData()"]).appendTo("#fifth");     
    DHEmptyElement("input","","url_input","https://jsonplaceholder.typicode.com/posts/","text",[],"position:absolute;width:450px;").appendTo("#fifth");
    console.log(DHTable("", "", [], [["Marko","Jereminov","PP@example.com"],["Pavle","Jovanovic","pj@example.com"],["Jovan","Djokovic","dj@example.com"]]).bodyRows);
    
});
function prepareForWriting(data) {
    //$("#btngd").remove();
    //DHElement("button","btn btn-primary","btngd",'GET DATA',["onclick:getData()"]).appendTo("#fifth"); 
    writeText(data);
}
function writeText(data) {
    $("#new_table").remove();
    AbstractDHElement.prototype.appendData("#fifth",DHTable("table table-responsive","new_table",[],[],data).html);
}
function getData() {
    var url = $("#url_input").val();
    var d = AbstractDHElement.prototype.ajax("GET", url, "json", "application/json", "", "", "");
    d.executeAjax(prepareForWriting);
}
