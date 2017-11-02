$(document).ready(function(){
    AbstractDHElement.prototype.addCssFiles(["bootstrap/css/bootstrap.min.css","css/style.css","css/jquery.json-view.css"]);
    AbstractDHElement.prototype.addPageTitle("DynamicHtmlLib");
    AbstractDHElement.prototype.appendData("body", DHElement("h2","col-md-12","","Convert JSON to DataTable").html);
    AbstractDHElement.prototype.appendData("body", DHElement("div","row col-md-12","container","").html);
    AbstractDHElement.prototype.appendData("#container", DHElement("div","col-md-3","fifth_1","").html);
    AbstractDHElement.prototype.appendData("#container", DHElement("div","col-md-9","fifth","").html);
    AbstractDHElement.prototype.appendData("#fifth", DHElement("div","col-md-12","fifth_2","").html);
    DHElement("button","btn btn-primary col-md-8","btngd",'GET DATA FROM URL',["onclick:getData()"]).appendTo("#fifth_1");     
    DHEmptyElement("input","col-md-8","url_input","https://jsonplaceholder.typicode.com/users/","text",[],"margin:5px;").appendTo("#fifth_1");
    DHElement("button","btn btn-primary col-md-8","btngd",'GET DATA FROM JSON',["onclick:getDataFromJson()"]).appendTo("#fifth_1");     
    DHElement("textarea","col-md-8","json_input","{\"KEY\":\"VALUE\"}",[],"margin:5px;height:10%").appendTo("#fifth_1"); 
    DHElement("div","col-md-12","json_tree","").appendTo("#fifth_1"); 
    data = [{
            type:"text",
            label:"Prva tekst labela",
            value:"Prva tekst vrednost",
            id:"labela1"       
        },
        {
            type:"text",
            label:"Druga tekst labela",
            value:"Druga tekst vrednost",
        },
        {
            type:"number",
            label:"Broj labela",
            value:20,
            id:"labela3"        
        },
        {
            type:"checkbox",
            label:"Checkbox labela",
            id:"labela_cbox"        
        },
        {
            type:"date",
            label:"Date labela",
            id:"labela_date"        
        },
        {
            type:"week",
            label:"Demo Type",
            value:20,
            id:"labela_demo"        
        },
        {
            type:"select",
            label:"DemoSelect",
            items:[{
                id:"1",
                name:"Prvi"            
            },
            {
                id:"2",
                name:"Drugi"            
            }],
            id:"selectId"
        }];    
    demoModal = DHModalForm({
        title:"DEMO TITLE OF THE MODAL FORM",
        buttonLabel:"Ispisi",
        method:"demo()",
        data: data
    });
    AbstractDHElement.prototype.appendData("body", demoModal.html);
    $("#modal_large").modal("show");
});
var data;
var demoModal;
function prepareForWriting(data) {
    writeText(data);
    prettyPrint(data);
}
function writeText(data) {
    $("#fifth_2").children().remove();
    AbstractDHElement.prototype.appendData("#fifth_2",MakeResponsiveDHTable(data).html);
    //outerTable = InitDataTable("#new_table");
    InitDataTable("#new_table");
    //allInnerTables = InitAllDataTables();
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
function demo() {
    console.log("testing...");
}
