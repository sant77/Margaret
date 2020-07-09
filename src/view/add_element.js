const {ipcRenderer} =  require('electron');
const {PythonShell} = require('python-shell');

//Recibe el mensaje proveniente de main con la infomracion de add 
ipcRenderer.on('message:data',(e, data) =>{
  console.log(data);
  //etique html que va a ser insertada en helios.html
  const newIotElement = `
      <div class="col-xs-4 p-2">
      <div class="card text-center">
          <div class="card-header">
            <h5 class="card-title">${data.name}</h5>
          </div>
          <div class="card-body">
            ${data.topic}
            <hr>
            ${data.payloadOn} 
            <hr>
            ${data.payloadOff}
          </div>
          <div class="card-footer">
            <button class="btn btn-warning btn-sm">
              DELETE
            </button>
            <button class="btn btn-success btn-sm">
              ON
            </button>
            <button class="btn btn-danger btn-sm">
              OFF
            </button>
          </div>
      </div>
      </div>
    `;
    //Agrega este html cuando es llamada esta funcion
    products.innerHTML += newIotElement;
    //Funcionalidad de los botones
      const btns = document.querySelectorAll('.btn.btn-warning');
      btns.forEach(btn => {
        btn.addEventListener('click', e => {
          e.target.parentElement.parentElement.parentElement.remove();
        });
      })

      const btns_on = document.querySelectorAll('.btn.btn-success');
      btns_on.forEach(btn => {
        btn.addEventListener('click', e => {
            let options = {
                //Ubicacion del archivo
                scriptPath : path.join(__dirname, '../pythonAplication/'),
                //Mensaje a enviar al script de python
                args: 'on' };
            
                //Corre el codigo python y lo envia al main por el protocolo IPCR
                PythonShell.run('mqttPython.py', options, function (err, results) {
                    //if (err) throw err;
        
                    console.log(results);
  
                    });	
         
        });
      })

      const btns_off = document.querySelectorAll('.btn.btn-danger');
      btns_off.forEach(btn => {
        btn.addEventListener('click', e => {
            let options = {
                //Ubicacion del archivo
                scriptPath : path.join(__dirname, '../pythonAplication/'),
                //Mensaje a enviar al script de python
                args: 'off' };
                
                //Corre el codigo python y lo envia al main por el protocolo IPCR
                PythonShell.run('mqttPython.py', options, function (err, results) {
                    //if (err) throw err;
        
                    console.log(results);
  
                    });	
        });
      });
    });
