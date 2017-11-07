/*!
 * Dinamic Html Lib for JavaScript v1.0.0
 * Must include jQuery.js and Bootstrap(optional)
 *
 * JS & jQuery library for dinamical creation of html elements, appending them to/refreshing containers.
 * Getting data and from any url manipulating it with one line of code.
 *
 * Date: 2017-10-10
 * 
 * Author: Marko Jereminov
 * 
 */


//Parent Component class where are the basic component's 
//attributes and values are initiated.
var AbstractDHElement = function (classes, id, value, optionalAttributes, styles) {
    this.classes = classes===''||classes.indexOf("class=")>=0?classes:" class='"+classes+"'";
    this.id = id===''||id.toString().indexOf("id=")>=0?id:" id='"+id+"'";
    this.value = value;
    this.optionalAttributes = optionalAttributes;
    this.styles = styles===undefined || styles===''||styles.indexOf("style=")>=0?styles:" style='"+styles+"'";;
    if (styles===undefined) this.styles = '';
    //Returns a string of optional attributes, ex. "min='0.0' max='50.0' contenteditable='true'"
    this.getAttributesString = function() {
        var attrString = " ";
        if (this.optionalAttributes===undefined || this.optionalAttributes.length===0) return "";
        var spacing = " ";
        for (var i = 0;i<this.optionalAttributes.length;i++) {
            if (i===(this.optionalAttributes.length-1)) spacing = "";
            var value = "";            
            if (this.optionalAttributes[i].split(":").length>2) {
                for (var j = 1;j< this.optionalAttributes[i].split(":").length;j++) {
                    value += this.optionalAttributes[i].split(":")[j];
                    if (j!==(this.optionalAttributes[i].split(":").length-1)) value+=":";                    
                }
            }
            else value = this.optionalAttributes[i].split(":")[1].replace("'","&#39");;
            attrString+=this.optionalAttributes[i].split(":")[0]+"='"+value+"'"+spacing;
        }
        return attrString;
    };
};

//Appending data elements to given container
AbstractDHElement.prototype.appendData = function (containerId, data) {
    $(containerId).append(data);
};
//Removing children data from container
AbstractDHElement.prototype.removeChildrenData = function (container) {
    $(container).children().remove();
};
//Adding CSS files to whole document
AbstractDHElement.prototype.addCssFiles = function (files) {
    var linkElementsString="";    
    for (var i = 0;i<files.length;i++) {
        linkElementsString+=DHEmptyElement("link","","","","",["rel:stylesheet","type:text/css","href:"+files[i]+""]).html;   
    }
    AbstractDHElement.prototype.appendData("head", linkElementsString);
};
//Adding page title dynamicaly
AbstractDHElement.prototype.addPageTitle = function (title) {
    AbstractDHElement.prototype.appendData("head", DHElement("title","","",title,[]).html);
};

AbstractDHElement.prototype.postData = function(options, onSuccess, onError) {
    var d = AbstractDHElement.prototype.ajax("POST",options.url,"json","application/json","","",options.data);
    d.executeAjax(onSuccess, onError);
};

AbstractDHElement.prototype.putData = function(options, onSuccess, onError) {
    var d = AbstractDHElement.prototype.ajax("PUT",options.url,"json","application/json","","",options.data);
    d.executeAjax(onSuccess, onError);
};

AbstractDHElement.prototype.fetchData = function(options, onSuccess, onError) {
    var d = AbstractDHElement.prototype.ajax("GET",options.url,"json","application/json","","","");
    d.executeAjax(onSuccess, onError);
};

AbstractDHElement.prototype.updateTable = function(options) {
    DHTable("","",[],options.data).refreshTableBody(options.id);
};

//Executing ajax and passing data to the passed function - 'afterDataReceived()'
AbstractDHElement.prototype.ajax = function (type, url, dataType, contentType, onSuccess, onComplete, data) {
    this.type = type;
    this.url = url;
    this.dataType = dataType;
    this.contentType = contentType;
    this.onSuccess = onSuccess;
    this.onComplente = onComplete;
    this.data = data;
     
    this.executeAjax = function(afterDataReceived, onError) {
        $.ajax({
            //crossOrigin: true,
            type : this.type,
            url : this.url,
            dataType: this.dataType,
            data: this.data,
            contentType: this.contentType,
            success : function(response) {
                afterDataReceived(response);
            },
            complete: function (response) {
                //test(response);      
            },
            error: function(response) {
                if (onError===undefined) {
                    alert("Problem sa komunikacijom. Azurirajte stranicu.");
                    console.log(response);
                }
                else {
                    onError(response);
                }        
            }
        });
    };
    return this;
};

//Creating html string for any tag, with given id, class, value and optionalAttributes
//which are formatted as e.g. ["min:0.0","max:100.0"] 
function DHElement(tag, classes, id, value, optionalAttributes, styles) {
    if (!(this instanceof DHElement)){
        return new DHElement(tag, classes, id, value, optionalAttributes, styles);
    }
    if (this.initialized === undefined || this.initialized) {
        AbstractDHElement.call(this, classes, id, value, optionalAttributes, styles);
    }
    this.initialized = true;
    this.tag = tag;
    this.getComponent = function() {
        return "<"+tag+this.classes+this.id+this.styles+this.getAttributesString()+">"+this.value+"</"+tag+">";
    };
    this.html = this.getComponent();
    //You can use this when creating DHElement like this: DHElement("div","class1 class2","Id","val23",[]).appendTo("body");
    //as a substitute to this: AbstractDHElement.prototype.appendData("body", DHElement("div","class1 class2","Id","val23",[]).html);
    this.appendTo = function(container) {
        AbstractDHElement.prototype.appendData.call(this,container, this.getComponent());
    };
    this.children = [];
    this.child = function(child) {
        this.children.push(child);
        return this;
    };
    
    this.getComponentsTree = function(element) {
        var elementValue = "";
        for (var i = 0;i<element.children.length;i++) {
             elementValue += DHElement(element.children[i].tag, element.children[i].classes, element.children[i].id, 
                             element.children[i].value===""?this.getComponentsTree(element.children[i]):element.children[i].value, 
                             element.children[i].optionalAttributes, element.children[i].styles).html;
        }
        return elementValue;
    };
    this.appendWithChildren = function(container, element) {
        AbstractDHElement.prototype.appendData.call(this, container, this.getComponentsTree(element));
    };
    return this;
};

//Creating html string for simple lists with subelements
//Parameters are classes for ul, id for ul, classes for li elements, li data
function DHList(classes, id, liClasses, elements, value, optionalAttributes, styles) {
    if (!(this instanceof DHList)){
        return new DHList(classes, id, liClasses, elements, value, optionalAttributes, styles);
    }
    this.classes = classes;
    this.id = id;
    this.value = value;
    this.liClasses = liClasses;
    this.elements = elements;
    this.getComponent = function() {
        var listElements = "";
        for (var i = 0;i<this.elements.length;i++) {
            listElements += DHElement("li",liClasses[i],"",this.elements[i]).html;
        }
        return DHElement("ul",this.classes,this.id,listElements).html;
    };
    this.html = this.getComponent();
    this.appendTo = function(container) {
        AbstractDHElement.prototype.appendData.call(this,container, this.getComponent());
    };
    return this;
};
//Creating html string for whole table or for table body rows.
//Data is passed as ["rb","name","email"] for titles and [["1","mj","@"]["1","mj","@"]["1","mj","@"]] for rows.
//Data can also be passed as any json!
function DHTable(classes, id, titles, rows, json, styles) {
    if (!(this instanceof DHTable)){
        return new DHTable(classes, id, titles, rows, json, styles);
    }
    this.classes = classes;
    this.id = id;
    this.json = json!==undefined && json.length===undefined?[json]:json;
    this.getRowsFromJson = function() {
        var rows = [];
        if (this.json===undefined) return [];
        for (var i = 0;i<this.json.length;i++) {
            var p = this.json[i];
            rows.push(Object.keys(this.json[i]===null?"/":this.json[i]).map(function(e){
                var cell_id = (Math.random()*Math.random()).toString().replace(".","");
                var btn_id = "btn_"+(Math.random()*Math.random()).toString().replace(".","");
                if (p[e]!==null && p[e] instanceof Array) {
                    if (p[e].length===0) return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_text"+cell_id+"\",\""+btn_id+"\")"],"font-size:xx-small;").html + 
                                                DHElement("h6","collapse","inner_text"+cell_id,"No data yet",[]).html;
                    if (Object.prototype.toString.call(p[e][0])==="[object String]") {
                        return p[e];
                    }
                    allInnerTableIds.push("#inner_table"+cell_id);
                    return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_table"+cell_id+"\",\""+btn_id+"\")"],"font-size:xx-small;").html + 
                          DHTable("inner_table table table-responsive collapse","inner_table"+cell_id,[],[],p[e]).html;
                }
                if (p[e]!==null && p[e] instanceof Object) {
                    allInnerTableIds.push("#inner_table"+cell_id);
                    return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_table"+cell_id+"\",\""+btn_id+"\")"],"font-size:xx-small;").html + 
                           DHTable("inner_table table table-responsive collapse","inner_table"+cell_id,[],[],[p[e]]).html;
                }
                if (p[e]!==null && (p[e].toString().indexOf(".jpg")>=0 || p[e].toString().indexOf(".png")>=0 || p[e].toString().indexOf(".icon")>=0)) {
                    return DHElement("img","","","",["src:"+p[e],"width:100px","height:100px"],"border-radius: 50%; border: 5px solid blue;").html;                
                }
                if (p[e]!==null && p[e].toString().indexOf("http")===0 && (p[e].toString().indexOf(".jpg")<0 && p[e].toString().indexOf(".png")<0 && p[e].toString().indexOf(".icon")<0)) {
                    return DHElement("a","","",p[e],["href:"+p[e],"target:_blank"]).html;                
                }
                if (Object.prototype.toString.call(p[e])==="[object String]") {
                    var text = p[e];
                    var isitHtml = /<[a-z][\s\S]*>/i.test(text);
                    if (text.toString().length>50) {
                        console.log(text);
                        if (isitHtml)
                        return DHElement("div","","",$(text).text().substring(0,49)+"...",["data-toggle:tooltip","title:"+$(text).text()]).html;
                        else return DHElement("div","","",text.substring(0,49)+"...",["data-toggle:tooltip","title:"+text]).html;
                    } 
                    return text;
                }
                return p[e];
            }));        
        }
        return rows;
    };
    this.getTitlesFromJson = function() {
        if (this.json===undefined) return [];
        return this.json.length>0?Object.keys(this.json[0]):[];
    };     
    this.rows = (rows.length===0||rows===""||rows===undefined)?this.getRowsFromJson():rows;
    this.titles = (titles.length===0||titles===""||titles===undefined)?this.getTitlesFromJson():titles;

    //Returns string for whole table
    this.getComponent = function() {
        var tableString="";
        var tableBodyString="";
        var tableBodyOneRowString="";
        var tableBodyRowsString="";
        var tableTitlesString = "";
        var tableHeaderString = "";
        for (var i = 0;i<this.titles.length;i++) {
            tableTitlesString += DHElement("th","","",this.titles[i]).html;          
        }
        tableHeaderString = DHElement("thead","","", DHElement("tr","","",tableTitlesString).html).html;
        for (var i = 0;i<this.rows.length;i++) {
            tableBodyOneRowString="";            
            for (var j = 0;j<this.rows[i].length;j++) {
                tableBodyOneRowString += DHElement("td","","",this.rows[i][j]).html;  
            }
            tableBodyRowsString += DHElement("tr","","",tableBodyOneRowString).html;
        }
        
        tableBodyString = DHElement("tbody","","", tableBodyRowsString).html;
        tableString = DHElement("table",this.classes,this.id,tableHeaderString+tableBodyString).html;
        return tableString;
    };
    //Returns string for body rows of the table
    this.getBodyRows = function() {
        var tableBodyOneRowString="";
        var tableBodyRowsString="";
        for (var i = 0;i<this.rows.length;i++) {
            tableBodyOneRowString="";            
            for (var j = 0;j<this.rows[i].length;j++) {
                var cell = this.rows[i][j]!==null&&this.rows[i][j].toString().indexOf("<td")>=0?this.rows[i][j].toString():DHElement("td","","",this.rows[i][j]).html;
                tableBodyOneRowString += cell;  
            }
            tableBodyRowsString += DHElement("tr","","",tableBodyOneRowString).html;
        }
        return tableBodyRowsString;
    };
    this.getHeaderRows = function() {
        var tableTitlesString = "";
        var tableHeaderString = "";
        for (var i = 0;i<this.titles.length;i++) {
            tableTitlesString += DHElement("th","","",this.titles[i]).html;          
        }
        tableHeaderString = DHElement("tr","","",tableTitlesString).html;
        return tableHeaderString;
    };
    this.bodyRows = this.getBodyRows();
    this.headerRow = this.getHeaderRows();
    this.html = this.getComponent();
    this.addTitle = function(title) {
        this.titles.push(title);    
        this.html = this.getComponent();
    }
    this.addCell = function(cell) {
        for (var i = 0;i<this.rows.length;i++) {
            this.rows[i].push(cell);       
        }    
        this.html = this.getComponent();
    }
    this.refreshTableBody = function(container) {
        AbstractDHElement.prototype.removeChildrenData.call(this, container+" tbody");
        AbstractDHElement.prototype.appendData.call(this,container+" tbody", this.bodyRows);
    };
    this.refreshTableHeader = function(container) {
        AbstractDHElement.prototype.removeChildrenData.call(this, container+" thead");        
        AbstractDHElement.prototype.appendData.call(this,container+" thead", this.headerRow);
    };
    this.appendTo = function(container) {
        //AbstractDHElement.prototype.removeChildrenData.call(this, container);        
        AbstractDHElement.prototype.appendData.call(this,container, this.getComponent());
    };
    return this;
}
//Used for creating html string for input and similar tags.
function DHEmptyElement(tag, classes, id, value, type, optionalAttributes, styles) {
    if (!(this instanceof DHEmptyElement)){
        return new DHEmptyElement(tag, classes, id, value, type, optionalAttributes, styles);
    }
    AbstractDHElement.call(this, classes, id, value, optionalAttributes, styles);
    this.tag = tag;    
    this.type = type;
    this.getComponent = function() {
        return "<"+tag+this.classes+this.id+this.styles+" value='"+this.value+"' type='"+this.type+"'"+this.getAttributesString()+">";
    };
    this.html = this.getComponent();
    this.appendTo = function(container) {
        AbstractDHElement.prototype.appendData(container, this.getComponent());
    };
    return this;
};

function collapseTable(cell_id, btn_id) {
    if ($(cell_id).hasClass("collapse")) {
       $(cell_id).removeClass("collapse");
       //$(cell_id+"_filter").removeClass("collapse");
       //$(cell_id+"_info").removeClass("collapse");
       $("#"+btn_id).text("-");     
    } else {
       $("#"+btn_id).text("+"); 
       $(cell_id).addClass("collapse"); 
       //$(cell_id+"_filter").addClass("collapse");
       //$(cell_id+"_info").addClass("collapse");
    }; 
    refreshTable();
}

function MakeResponsiveDHTable(data) {
    var table = DHTable("table table-responsive root-table","new_table",[],[],data);
    return table;
}
var outerTable;
var allInnerTableIds=[];
var allInnerTables = []; 
function InitDataTable(id) {
    var table = $(id).DataTable({
        "paging":false,
        "dom": '<lf<t>ip>',
        "scrollY": 400,
        "scrollX": true,
        "scrollCollapse": true,
    });
 
    table.on( 'draw', function () {
        var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
    } );
    outerTable = table;
    return table;
    
}
function InitAllDataTables() {
    var innerTables = [];
    for (var i = 0;i<allInnerTableIds.length;i++) {
        innerTables.push(InitDataTable(allInnerTableIds[i]));
        $(allInnerTableIds[i]+"_filter").addClass("collapse");
        $(allInnerTableIds[i]+"_info").addClass("collapse");
    }
    return innerTables;
    
}
function refreshTable() {
    outerTable.columns.adjust().draw();
} 


function DHModalForm (options) {
    if (!(this instanceof DHModalForm)){
        return new DHModalForm(options);
    }
    this.options = options;
    this.title = options.title===undefined?"":options.title;
    this.buttonLabel = options.buttonLabel===undefined?"":options.buttonLabel;
    this.method = options.method===undefined?"":options.method;
    this.icon = options.icon===undefined?"":options.icon;
    this.createDataDynamically = function () {
        if (Object.prototype.toString.call(this.options.data)==="[object String]") return this.options.data;
        var htmlText="";
        for (var i = 0;i<this.options.data.length;i++) {
            if (this.options.data[i].type!=="select") { 
                if (this.options.data[i].type==="textarea") {
                    var wrapper = CreateTextAreaFormControl(this.options.data[i].type, this.options.data[i].label, this.options.data[i].id===undefined?"":this.options.data[i].id, this.options.data[i].value);
                    htmlText+=wrapper;                
                } 
                else {
                    var wrapper = CreateInputFormControl(this.options.data[i].type, this.options.data[i].label, this.options.data[i].id===undefined?"":this.options.data[i].id, this.options.data[i].value);
                    htmlText+=wrapper;
                }         
            }
            else {
                var opts = 
                        {
                          items:this.options.data[i].items, 
                          label:this.options.data[i].label,
                          id:this.options.data[i].id
                        };
                htmlText+=CreateSelectElement(opts);
            }
        }
        
        return htmlText;
    };
    this.data = this.createDataDynamically();
    
    this.getComponent = function() {
        var d = DHElement("div","modal fade","modal_large","",[],"display:none;")
                .child(DHElement("div","modal-dialog","","")
                .child(DHElement("div","modal-content","","")
                .child(DHElement("div","modal-header bg-teal-400","","")
                .child(DHElement("h2","panel-title","",this.title,[],"display:inline"))
                .child(DHElement("button","close","","x",["data-dismiss:modal"])))
                .child(DHElement("div","modal-body","","")
                .child(DHElement("div","row","","")
                .child(DHElement("div","col-md-12 col-lg-12 col-sm-12 col-xs-12","","")
                .child(DHElement("div","panel panel-flat","","",[],"max-height: 350px; overflow: auto;")
                .child(DHElement("div","panel-body","","",[],"overflow-y: auto; max-height: 250px;")
                .child(DHElement("div","form-group","",DHElement("div",this.icon,"","",[],"font-size:50px;display:inline;position: absolute;").html+this.data))))))
                .child(DHElement("div","modal-body","","")
                .child(DHElement("div","row","","")
                .child(DHElement("div","col-md-12 col-lg-12 col-sm-12 col-xs-12","","")
                .child(DHElement("button","btn bg-teal-400","",this.buttonLabel,["data-dismiss:modal"]))))))));
        var htmlText = DHElement(d.tag, d.classes, d.id, d.getComponentsTree(d), d.optionalAttributes, d.styles).html;
        return htmlText;
    };
    this.html = this.getComponent();
}

function DHModalDialog (options) {
    if (!(this instanceof DHModalDialog)){
        return new DHModalDialog(options);
    }
    this.question = options.question;
    this.getComponent = function() {
        var d = DHElement("div","modal fade","dialog","",[],"display:none;")
                .child(DHElement("div","modal-dialog","","")
                .child(DHElement("div","modal-content","","")
                .child(DHElement("div","modal-body","","")
                .child(DHElement("button","bootbox-close-button close","","x",["type:button","data-dismiss:modal","aria-hidden:true"],"margin-top: -10px;"))
                .child(DHElement("div","bootbox-body","",this.question)))
                .child(DHElement("div","modal-footer","","")
                .child(DHElement("button","btn btn-default","noBtn","Ne",["data-bb-handler:cancel"]))
                .child(DHElement("button","btn btn-primary","yesBtn","Yes",["data-bb-handler:confirm"])))));
        var htmlText = DHElement(d.tag, d.classes, d.id, d.getComponentsTree(d), 
        d.optionalAttributes, d.styles).html;        
        return htmlText;
    };
    this.html = this.getComponent();
}

function AppendInfoModal(title, text, icon){
    $("#modal_large").remove();
    var iconClass=""; 
    if (icon === "warn") iconClass = " glyphicon glyphicon-warning-sign";
    if (icon === "info") iconClass = " glyphicon glyphicon-info-sign"; 
    if (icon === "ok") iconClass = " glyphicon glyphicon-ok-sign";
    var demoModal = DHModalForm({
        title:title,
        buttonLabel:"OK",
        icon:iconClass,
        data: CreateLabel(text)
    });
    AbstractDHElement.prototype.appendData("body", demoModal.html);
    $("#modal_large").modal("show");
}

function CreateTableBtn(method, type) {
    var t = type==="edit"?"list":"remove";
    return DHElement("button","btn btn-rounded","",
    DHElement("i","glyphicon glyphicon-"+t,"","",["aria-hidden:true"]).html,
    ["type:button","name:action","onclick:"+method]).html;
}

function CreateSelectElement(options) {
    var optionsData = "";
    for (var i = 0;i<options.items.length;i++) {
        optionsData+=DHElement("option","","",options.items[i].name,["value:"+options.items[i].id]).html;
    }
    var cOptionsSelectElem = DHElement("select","form-control",options.id,optionsData,["name:select"]);
    var cOptionsFormLabel = DHElement("label","control-label col-md-2","",options.label);
    var cOptionsSelectDiv = DHElement("div","col-md-10","",cOptionsSelectElem.html);
    return DHElement("div","form-group col-md-12","",cOptionsFormLabel.html+cOptionsSelectDiv.html).html;
}

function CreateInputFormControl(type, labelText, id, value) {
    var input = DHEmptyElement("input","form-control",id,value,type);
    var label = DHElement("label","control-label col-md-2","",labelText);
    var inputDiv = DHElement("div","col-md-10","",input.html);
    var div = DHElement("div","form-group col-md-12","",label.html+inputDiv.html);
    return div.html;
}

function CreateTextAreaFormControl(type, labelText, id, value) {
    var input = DHElement("textarea","form-control",id,value);
    var label = DHElement("label","control-label col-md-2","",labelText);
    var inputDiv = DHElement("div","col-md-10","",input.html);
    var div = DHElement("div","form-group col-md-12","",label.html+inputDiv.html);
    return div.html;
}

function CreateLabel(labelText) {
    var label = DHElement("label","control-label col-md-8 col-md-offset-2","",labelText);
    return label.html;
}

function CreateCheckboxFormControl(id, label) {
    var input = DHEmptyElement("input","styled","","","checkbox",["checked:checked"]);
    var span = DHElement("span","checkbox",id,input.html);
    var divChecker = DHElement("div","checker","",span.html,[],"top:-6px!important;");
    var divLabel = DHElement("label","","", divChecker.html+label);
    var divCheckBox = DHElement("div","checkbox","",divLabel.html);
    return divCheckBox.html;
}

//Appending data to Modal form
function AppendToModal(opt) {
    var htmlText = DHModalForm(opt).html;
    AbstractDHElement.prototype.appendData("body", htmlText);
    $("#modal_large").modal("show");
}

function AppendModalDialogDelete(opts) {
    $("#dialog").remove();
    var htmlText = DHModalDialog({
                                  question:"Da li si siguran da zelis da obrises "+opts.name+opts.type+"?"
                                 }).html;
    AbstractDHElement.prototype.appendData("body", htmlText);
    $("#dialog").modal("show");
    updateDeleteEvents(opts.id, opts.type, opts.onYes, opts.onNo);
}

function updateDeleteEvents(id, type, fnYes, fnNo) {
    $("#noBtn").on("click",function(){
        fnNo();
    });
    $("#yesBtn").on("click",function(){
        fnYes(id,type);
    });
}

function GetOptionsForSelectElement(list, params) {
    var items = [];
    for (var i = 0;i<list.length;i++) {
        items.push({id:list[i][params.id],name:list[i][params.name]});
    }
    return items;
}

function UpdateTable(opt) {
    AbstractDHElement.prototype.updateTable(opt);
}

function PostData(opt, fn, onError) {
    AbstractDHElement.prototype.postData(opt, fn, onError);
}

function PutData(opt, fn, onError) {
    AbstractDHElement.prototype.putData(opt, fn, onError);
}

function FetchData(opt, fn, onError) {
    AbstractDHElement.prototype.fetchData(opt, fn, onError);
}
