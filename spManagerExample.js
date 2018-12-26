var spDBmanager = require('./spDB_lib/index');

const gui_table = 'c0a6425e-f816-4016-abb5-0f9ab2ba8ac2';


var spDB = new spDBmanager('soldai@grupoguia1.onmicrosoft.com', 'Hud52154', 'https://grupoguia1.sharepoint.com', '/sites/AVI/');


console.log("-----------")
var params = {
    "ESTATUS": "TERMINADO",
    "ID" : 132
}
/*
Ejemplo para pedir la informacion del usuario
*/
/*
spDB.userinfo().then((data)=>
{
    console.log(data)
})
*/
/*
Ejemplo para consultas
*/


spDB.consult('DESARROLLO', params).then((data)=>
{
    console.log(data)
})

//spDB.json2String(params)