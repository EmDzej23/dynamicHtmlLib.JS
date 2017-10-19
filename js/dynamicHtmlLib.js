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
            else value = this.optionalAttributes[i].split(":")[1];
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
//Executing ajax and passing data to the passed function - 'afterDataReceived()'
AbstractDHElement.prototype.ajax = function (type, url, dataType, contentType, onSuccess, onComplete, data) {
    this.type = type;
    this.url = url;
    this.dataType = dataType;
    this.contentType = contentType;
    this.onSuccess = onSuccess;
    this.onComplente = onComplete;
    this.data = data;
     
    this.executeAjax = function(afterDataReceived) {
        $.ajax({
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
//Data can also be passed as any json - well formatted!
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
                    if (p[e].length===0) return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_text"+cell_id+"\",\""+btn_id+"\")"],"font-size:large;").html + DHElement("h6","collapse","inner_text"+cell_id,"No data yet",[]).html;
                    if (Object.prototype.toString.call(p[e][0])==="[object String]") return p[e];
                   return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_table"+cell_id+"\",\""+btn_id+"\")"],"font-size:large;").html + DHTable("inner_table table table-responsive collapse","inner_table"+cell_id,[],[],p[e]).html;
                }
                if (p[e]!==null && p[e] instanceof Object) {
                   return DHElement("button","btn btn-primary btn-sm",btn_id,"+",["onclick:collapseTable(\"#inner_table"+cell_id+"\",\""+btn_id+"\")"],"font-size:large;").html + DHTable("inner_table table table-responsive collapse","inner_table"+cell_id,[],[],[p[e]]).html;
                }
                if (p[e]!==null && (p[e].toString().indexOf(".jpg")>=0 || p[e].toString().indexOf(".png")>=0 || p[e].toString().indexOf(".icon")>=0)) {
                   return DHElement("img","","","",["src:"+p[e],"width:100px","height:100px"],"border-radius: 50%; border: 5px solid blue;").html;                
                }
                if (p[e]!==null && p[e].toString().indexOf("http")===0 && (p[e].toString().indexOf(".jpg")<0 && p[e].toString().indexOf(".png")<0 && p[e].toString().indexOf(".icon")<0)) {
                   return DHElement("a","","",p[e],["href:"+p[e],"target:_blank"]).html;                
                }
                else return p[e];
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
       $("#"+btn_id).text("-");     
    } else {$("#"+btn_id).text("+"); $(cell_id).addClass("collapse")}; 
}

function MakeResponsiveDHTable(data) {
    var table = DHTable("table table-responsive root-table","new_table",[],[],data);
    return table.html;
}
function InitDataTable(id) {
    var table = $(id).DataTable({"paging":false,"dom": '<lf<t>ip>'});
 
    table.on( 'draw', function () {
        var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
    } );
}

