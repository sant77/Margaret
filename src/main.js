//Modulos que proviene de electron y permite usar sus funciones
//menu nos permite modificar el menu del programa
//ipcMAin permite la cominicacion por IPC entre en los render y el principal
const {app,BrowserWindow,Menu,ipcMain} = require('electron');
//Permite econtar la ubicacion del archivo
const path = require('path');
//Permite buscar url de archvivos
const url = require('url');
//Consola de python para ejecutar codigo python 
const {PythonShell} = require('python-shell');

//Permite refrescar el programa sin cerrar la ventana(solo para desarrollo)
if(process.env.NODE_ENV !== 'production') {
	require('electron-reload')(__dirname, {
		electron:path.join(__dirname,'../node_modules','.bin','electron')
	  
	});
  }

  
//Variables globales para las ventanas
let win;
let newMargaretWindow;

//Arreglo que representa el menu
const templateMenu = [
	{
		label: 'File',
		submenu:[
			{
				label: 'Etique_p',
				//Atajo
				accelerator: 'Ctrl+N',
				//detecta el evento click
				click(){
					//LLama a la funcion de crear una ventana
					createNewWindow()
				}
			}
		]
	},
	{
		label:'help'
	}
	
];

if (process.env.NODE_ENV !== 'production') {
	templateMenu.push({
	  label: 'DevTools',
	  submenu: [
		{
		  //Nombre de la pestaña
		  label: 'Show/Hide Dev Tools',
		  accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
		  click(item, focusedWindow) {
			
			focusedWindow.toggleDevTools();
		  }
		},
		{
		//Refresca la ventana
		  role: 'reload'
		}
	  ]
	})
  }



//Funcion que crea la ventana principal
function createWindow(){
	//create browser window
	win = new BrowserWindow({
		width:1300,
		height:800,
		icon:__dirname+'/img/icon2.png',
		//Esta linea permite que los nodos sea capces de acceder a las librerias 
		webPreferences: {
			nodeIntegration: true
		}
	});
    //Carga el archivo html principal
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'view/index.html'),
		prtocol:'file',
		slashes: true

	}));

	// Herramientas de desarrollador 
	/*
	if(process.env.NODE_ENV !== 'production') {
		win.webContents.openDevTools();
	  }

	win.on('closed', () => {
		win = null;
	});
	*/

	//Menu

	const mainMenu = Menu.buildFromTemplate(templateMenu);
	//Integrando el menu
	Menu.setApplicationMenu(mainMenu);

	//Escucha el cierre de la ventana principal y cierra todas las ventanas

	win.on('closed',() =>{
		app.quit();
	});
}

//Crea una nueva ventana al dar clik en etiqueta_p
function createNewWindow(){
	newMargaretWindow = new BrowserWindow({
		width:400,
		height: 330,
		title: 'Ventana de prueba'
	});
	//Elimina el menu
	newMargaretWindow.setMenu(null);
	//carga el html de la nueva ventana
	newMargaretWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'view/prueba.html'),
		prtocol:'file',
		slashes: true

	}))
}

//Cuando esta lista la aplicacion llama la funcion y crea la ventana principal
app.on('ready',createWindow);


//Funcion de python que permite comuniacion con los archivos python

//Escuha la petecion del render process (add) 

ipcMain.on('message:data',(e,data) =>{
	console.log(data);
	win.webContents.send('message:data',data);

});

	