//Todas las llaves del localstorage tendran la siguiente estrucutra:
//"elemento" + "origen" ej:
//lampara mqtt
//El elemento permite buscar cuando se necesite
//El origen permite de donde provienen ese dato
//Comunicacion con el main
const {ipcRenderer} =  require('electron');
//Renderizar los datos guardados del localstorage
renderHtml();
//Opciones para los toastr
//Parametros para los toastr
optionsToastr = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};

//Datos del servidor mqtt
const serverData = JSON.parse(localStorage.getItem('data validation'));



//Cliente mqtt, configuraccion y funciones
clientID = "clientID-" + parseInt(Math.random() * 100);

var client = new Paho.MQTT.Client(serverData.server,parseInt(serverData.port),clientID);
// set callback handlers
client.onConnectionLost = onConnectionLost;
//client.onMessageArrived = onMessageArrived;

client.connect({
  useSSL: true,
  userName: serverData.user,
  password: serverData.password,
  onSuccess: onConnect,
  onFailure: onFailure
});


  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected to m15.cloudmqtt.com...");
    toastr.success('¡Conectado con el servidor MQTT!','Estado:',optionsToastr);
  
    //client.subscribe("#");
  };
  
  function onFailure(errorMessage) {
    console.log(errorMessage)
    toastr.error('¡No se pudo conectar!','Estado:',optionsToastr);
  };

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("Connection lost:", responseObject.errorMessage);
      setTimeout(function() { client.connect() }, 5000);
    }
  };

  //Almacenamiento local
  const storageMqtt = (id,data) =>{
    localStorage.setItem(id,JSON.stringify(data))

  };

  function removeData(class_name){

    let key_class = class_name.split(" ");
    //
    finally_key = key_class[key_class.length - 1]+" mqttData";
    //Remueve el dato seleccionado del localstorage
    localStorage.removeItem(finally_key);
  };
  //Obtener el valor alamcenado en el localsorage
  function getData(class_name){
     //se busca la utlima palabra de la clase que es la llave del localstorage
     let key_class = class_name.split(" ");
     //Se busca la clase especifica en el local storage y se convierte a un objeto
     finally_key = key_class[key_class.length - 1]+" mqttData";
     let localstorage_data = JSON.parse(localStorage.getItem(finally_key));
     return localstorage_data;
  };
  //Pinta las etiquetas html y controla el comportamiento de estas
  function renderMqtt(data,location){
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
            <button class="btn btn-warning btn-sm ${data.name}">
              DELETE
            </button>
            <button class="btn btn-success btn-sm ${data.name}" >
              ON
            </button>
            <button class="btn btn-danger btn-sm ${data.name}" >
              OFF
            </button>
          </div>
      </div>
      </div>
    `;
    //Agrega este html cuando es llamada esta funcion
    products.innerHTML += newIotElement;
    //Guarda los datos de la etiqueta,agregar el mqtt data permite identificar a los elementos mas facilmente
    //El if permite diferenciar de donde vienen los archivos y si hay que guardarlos
    if (location == 'ipcRenderer'){
      storageMqtt(data.name+" mqttData",data);
    };
    //Funcionalidad de los botones
      //Boton de eliminar etiqueta
      const btns = document.querySelectorAll('.btn.btn-warning');
      btns.forEach(btn => {
        btn.addEventListener('click', e => {
          let class_name = e.target.className;
          //Funcion para remover el dato
          removeData(class_name)
          //Remueve la etiqueta html
          e.target.parentElement.parentElement.parentElement.remove();
        });
      })
      //Boton de encender
      const btns_on = document.querySelectorAll('.btn.btn-success');
      btns_on.forEach(btn => {
        btn.addEventListener('click', e => {
          //Se obtiene la clase especifica del boton pulsado
          let class_name = e.target.className;
          localstorage_data = getData(class_name)
        
          //Envia un mensaje al servidor  MQTT
          // Publish a Message
          
          var message = new Paho.MQTT.Message(localstorage_data.payloadOn);
          message.destinationName = localstorage_data.topic;
          message.qos = 0;
          client.send(message);
          
        });
      })
      //Boton de apagar
      const btns_off = document.querySelectorAll('.btn.btn-danger');
      btns_off.forEach(btn => {
        btn.addEventListener('click', e => {
          let class_name = e.target.className;
          localstorage_data = getData(class_name)

          //Envia un mensaje al servidor  MQTT
          // Publish a Message
          var message = new Paho.MQTT.Message(localstorage_data.payloadOff);
          message.destinationName = localstorage_data.topic;
          message.qos = 0;
          client.send(message);
        });
      });
    };

//Recibe el mensaje proveniente de main con la informacion de add 
ipcRenderer.on('message:data',(e, data) =>{
  renderMqtt(data,'ipcRenderer');
    });

    //Funcion que permite buscar los datos guardados y volver a pintarlos en pantalla
function renderHtml(){

  //Busca todas las llaves del localstorage y las devuelve en un array
  Object.keys(localStorage)
      .map(function(x){
        //El array es recorriedo y se evalua si las etiquetas son elementos deseados
        if (x.split(" ")[x.split(" ").length-1] == "mqttData"){
          //Si es asi pinta la etiqueta en pantalla
          console.log("Funciono")
          renderMqtt(JSON.parse(localStorage.getItem(x)),'renderMqtt');
        }
      }
      )};
