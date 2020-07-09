//Importamos moduelo de de electron
const electron =  require('electron');
//importamos path
const path = require('path');


//Permite crear otras ventanas
const BrowserWindow = electron.remote.BrowserWindow

//Enlaza el boton con el codigo javaScript
const add_element = document.getElementById('add_component');

//Cuando se preciona el boton de acciona la funcion que crea una nueva ventana
add_element.addEventListener('click',function(event){
   
    const path_1  = path.join('file://',__dirname,'add.html');
    //frame:false  elimina la barra de la ventana,tranparent:true convierte la ventana transparente
    //alwaysontop: ture permite que simpre este encima de la ventana
    let win = new BrowserWindow({
        frame:true,
        transparent:true,
        alwaysOnTop:true,
        width:600, 
        height:600,
        webPreferences: {
			nodeIntegration: true
		}
    
    });
    win.on('close',function(){win = null});
    win.loadURL(path_1)
    win.show();
    console.log('funciono')
});