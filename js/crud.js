$(document).ready(function(){
    AbstractDHElement.prototype.addCssFiles(["bootstrap/css/bootstrap.min.css","css/style.css","css/jquery.json-view.css"]);
    AbstractDHElement.prototype.appendData("body", DHElement("button","btn","","+",["onclick:newTableRow()"]).html);
    addDataToTable();
    
});

function addDataToTable() {
    FetchData({url:CRUD_URL},function(resp){
        var tbl = MakeResponsiveDHTable(resp);
        tbl.addTitle("Remove");
        tbl.addTitle("Edit");
        tbl.addCell("");
        tbl.addCell("");
        AbstractDHElement.prototype.appendData("body",tbl.html);
        data = resp;
        updateTable();
        InitDataTable("#new_table");
    },function(resp) {
        console.log("!!!ERROR!!!");
        console.log(resp);
        console.log("!!!ERROR!!!");
        console.log(data);    
    });
}

function updateTable() {
    $("#new_table tbody").children().remove();
    var tableDataRows=[];
    for (var i = 0;i<data.length;i++) {
        var tableDataRow=[];
        for (var j = 0;j<Object.keys(data[i]).length;j++) {
            tableDataRow.push(data[i][Object.keys(data[i])[j]]);
        }
        tableDataRow.push(CreateTableBtn("deleteTableRow(\""+data[i].id+"\")","delete"));
        tableDataRow.push(CreateTableBtn("editTableRow("+JSON.stringify(data[i])+")","edit"));
        tableDataRows.push(tableDataRow);
    }
    UpdateTable({
       id: "#new_table",
       data: tableDataRows
    });
}

function deleteTableRow(id) {
    console.log("delete");
    console.log(id);
}
function newTableRow() {
    console.log("edit");
    console.log();
    
    var formContent = "";
    var rw ={};
    var keys = Object.keys(data[0]);
    for (var j=0;j<keys.length;j++) {
        formContent += CreateInputFormControl("text",keys[j],keys[j]+"_field","");    
        rw[keys[j]]=keys[j]+"_field";
    }
    //var userIdInput = CreateInputFormControl("number", "User ID", "user_", "");
    //var idInput = CreateInputFormControl("number", "ID", "id_", "");
    //var titleInput = CreateInputFormControl("text", "Title", "title_", "");
    //var bodyInput = CreateTextAreaFormControl("textarea", "Body", "body_", "");
    var fieldSetElement = DHElement("fieldset","content-group","",formContent,[],"margin-top:10px;");
    //var rw = {userId:"user_",id:"id_",title:"title_",body:"body_"};   
    $("#modal_large").remove();
    AppendToModal({
        data:fieldSetElement.html,
        title:"Dodaj red", 
        buttonLabel:"Dodaj", 
        method:"addTableRow("+JSON.stringify(rw)+")"
    });
}
function editTableRow(row) {
    console.log("edit");
    console.log(row);
    //var userIdInput = CreateInputFormControl("number", "User ID", "user_"+row.id, row.userId);
    //var idInput = CreateInputFormControl("number", "ID", "id_"+row.id, row.id);
    //var titleInput = CreateInputFormControl("text", "Title", "title_"+row.id, row.title);
    //var bodyInput = CreateTextAreaFormControl("textarea", "Body", "body_"+row.id, row.body);
    var keys = Object.keys(data);
    var formContent = "";
    var rw = {};    
    var keys = Object.keys(row);
    for (var j=0;j<keys.length;j++) {
        formContent += CreateInputFormControl("text",keys[j],keys[j]+"_field",row[keys[j]]);    
        rw[keys[j]]=keys[j]+"_field";
    }
    var fieldSetElement = DHElement("fieldset","content-group","",formContent,[],"margin-top:10px;");
    //var rw = {userId:"user_"+row.id,id:"id_"+row.id,title:"title_"+row.id,body:"body_"+row.id};   
    $("#modal_large").remove();
    AppendToModal({
        data:fieldSetElement.html,
        title:"Izmeni podatke", 
        buttonLabel:"Izmeni", 
        method:"updateTableRow("+JSON.stringify(rw)+")"
    });
}
function addTableRow(opt) {
    $("#modal_large").modal("toggle");
    console.log(opt);
    var user = {};
    for (var i = 0;i<Object.keys(opt).length;i++) {
        user[Object.keys(opt)[i]] = $("#"+opt[Object.keys(opt)[i]]).val(); 
    }
    
    PostData({
        url:CRUD_URL,
        data:JSON.stringify(user)
    },function(response){
        data=response;
        updateTable();        
    });
    
}

function updateTableRow(opt) {
    $("#modal_large").modal("toggle");
    console.log(opt);
    var user = {};
    for (var i = 0;i<Object.keys(opt).length;i++) {
        user[Object.keys(opt)[i]] = $("#"+opt[Object.keys(opt)[i]]).val(); 
    }
    
    PutData({
        url:CRUD_URL+user.id,
        data:JSON.stringify(user)
    },function(response){
        data=response;
        updateTable();        
    });
}
var data = [
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  },
  {
    "userId": 1,
    "id": 4,
    "title": "eum et est occaecati",
    "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
  },
  {
    "userId": 1,
    "id": 5,
    "title": "nesciunt quas odio",
    "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
  },
  {
    "userId": 1,
    "id": 6,
    "title": "dolorem eum magni eos aperiam quia",
    "body": "ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae"
  },
  {
    "userId": 1,
    "id": 7,
    "title": "magnam facilis autem",
    "body": "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas"
  },
  {
    "userId": 1,
    "id": 8,
    "title": "dolorem dolore est ipsam",
    "body": "dignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae"
  },
  {
    "userId": 1,
    "id": 9,
    "title": "nesciunt iure omnis dolorem tempora et accusantium",
    "body": "consectetur animi nesciunt iure dolore\nenim quia ad\nveniam autem ut quam aut nobis\net est aut quod aut provident voluptas autem voluptas"
  },
  {
    "userId": 1,
    "id": 10,
    "title": "optio molestias id quia eum",
    "body": "quo et expedita modi cum officia vel magni\ndoloribus qui repudiandae\nvero nisi sit\nquos veniam quod sed accusamus veritatis error"
  },
  {
    "userId": 2,
    "id": 11,
    "title": "et ea vero quia laudantium autem",
    "body": "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi"
  },
  {
    "userId": 2,
    "id": 12,
    "title": "in quibusdam tempore odit est dolorem",
    "body": "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio"
  },
  {
    "userId": 2,
    "id": 13,
    "title": "dolorum ut in voluptas mollitia et saepe quo animi",
    "body": "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam"
  },
  {
    "userId": 2,
    "id": 14,
    "title": "voluptatem eligendi optio",
    "body": "fuga et accusamus dolorum perferendis illo voluptas\nnon doloremque neque facere\nad qui dolorum molestiae beatae\nsed aut voluptas totam sit illum"
  },
  {
    "userId": 2,
    "id": 15,
    "title": "eveniet quod temporibus",
    "body": "reprehenderit quos placeat\nvelit minima officia dolores impedit repudiandae molestiae nam\nvoluptas recusandae quis delectus\nofficiis harum fugiat vitae"
  },
  {
    "userId": 2,
    "id": 16,
    "title": "sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio",
    "body": "suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores voluptatibus quia\nvoluptatem quis ullam qui in alias quia est\nconsequatur magni mollitia accusamus ea nisi voluptate dicta"
  },
  {
    "userId": 2,
    "id": 17,
    "title": "fugit voluptas sed molestias voluptatem provident",
    "body": "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeserunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo"
  },
  {
    "userId": 2,
    "id": 18,
    "title": "voluptate et itaque vero tempora molestiae",
    "body": "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam"
  },
  {
    "userId": 2,
    "id": 19,
    "title": "adipisci placeat illum aut reiciendis qui",
    "body": "illum quis cupiditate provident sit magnam\nea sed aut omnis\nveniam maiores ullam consequatur atque\nadipisci quo iste expedita sit quos voluptas"
  },
  {
    "userId": 2,
    "id": 20,
    "title": "doloribus ad provident suscipit at",
    "body": "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus totam\nomnis rerum consequatur expedita quidem cumque explicabo"
  },
  {
    "userId": 3,
    "id": 21,
    "title": "asperiores ea ipsam voluptatibus modi minima quia sint",
    "body": "repellat aliquid praesentium dolorem quo\nsed totam minus non itaque\nnihil labore molestiae sunt dolor eveniet hic recusandae veniam\ntempora et tenetur expedita sunt"
  },
  {
    "userId": 3,
    "id": 22,
    "title": "dolor sint quo a velit explicabo quia nam",
    "body": "eos qui et ipsum ipsam suscipit aut\nsed omnis non odio\nexpedita earum mollitia molestiae aut atque rem suscipit\nnam impedit esse"
  },
  {
    "userId": 3,
    "id": 23,
    "title": "maxime id vitae nihil numquam",
    "body": "veritatis unde neque eligendi\nquae quod architecto quo neque vitae\nest illo sit tempora doloremque fugit quod\net et vel beatae sequi ullam sed tenetur perspiciatis"
  },
  {
    "userId": 3,
    "id": 24,
    "title": "autem hic labore sunt dolores incidunt",
    "body": "enim et ex nulla\nomnis voluptas quia qui\nvoluptatem consequatur numquam aliquam sunt\ntotam recusandae id dignissimos aut sed asperiores deserunt"
  },
  {
    "userId": 3,
    "id": 25,
    "title": "rem alias distinctio quo quis",
    "body": "ullam consequatur ut\nomnis quis sit vel consequuntur\nipsa eligendi ipsum molestiae et omnis error nostrum\nmolestiae illo tempore quia et distinctio"
  },
  {
    "userId": 3,
    "id": 26,
    "title": "est et quae odit qui non",
    "body": "similique esse doloribus nihil accusamus\nomnis dolorem fuga consequuntur reprehenderit fugit recusandae temporibus\nperspiciatis cum ut laudantium\nomnis aut molestiae vel vero"
  },
  {
    "userId": 3,
    "id": 27,
    "title": "quasi id et eos tenetur aut quo autem",
    "body": "eum sed dolores ipsam sint possimus debitis occaecati\ndebitis qui qui et\nut placeat enim earum aut odit facilis\nconsequatur suscipit necessitatibus rerum sed inventore temporibus consequatur"
  },
  {
    "userId": 3,
    "id": 28,
    "title": "delectus ullam et corporis nulla voluptas sequi",
    "body": "non et quaerat ex quae ad maiores\nmaiores recusandae totam aut blanditiis mollitia quas illo\nut voluptatibus voluptatem\nsimilique nostrum eum"
  },
  {
    "userId": 3,
    "id": 29,
    "title": "iusto eius quod necessitatibus culpa ea",
    "body": "odit magnam ut saepe sed non qui\ntempora atque nihil\naccusamus illum doloribus illo dolor\neligendi repudiandae odit magni similique sed cum maiores"
  }
]












































