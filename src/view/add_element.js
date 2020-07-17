//Comunicacion con el main
const {ipcRenderer} =  require('electron');

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

//Cliente mqtt, configuraccion y funciones
clientID = "clientID-" + parseInt(Math.random() * 100);

var client = new Paho.MQTT.Client("m15.cloudmqtt.com", 30515,clientID);
// set callback handlers
client.onConnectionLost = onConnectionLost;
//client.onMessageArrived = onMessageArrived;

client.connect({
  useSSL: true,
  userName: "placa1",
  password: "12345678",
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


//Recibe el mensaje proveniente de main con la informacion de add 
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
      //Boton de eliminar etiqueta
      const btns = document.querySelectorAll('.btn.btn-warning');
      btns.forEach(btn => {
        btn.addEventListener('click', e => {
          e.target.parentElement.parentElement.parentElement.remove();
        });
      })
      //Boton de encender
      const btns_on = document.querySelectorAll('.btn.btn-success');
      btns_on.forEach(btn => {
        btn.addEventListener('click', e => {
          //Envia un mensaje al servidor  MQTT
          // Publish a Message
          var message = new Paho.MQTT.Message("ON");
          message.destinationName = "esp/helios/iluminacion";
          message.qos = 0;
          client.send(message);
        });
      })
      //Boton de apagar
      const btns_off = document.querySelectorAll('.btn.btn-danger');
      btns_off.forEach(btn => {
        btn.addEventListener('click', e => {
          //Envia un mensaje al servidor  MQTT
          // Publish a Message
          var message = new Paho.MQTT.Message("OFF");
          message.destinationName = "esp/helios/iluminacion";
          message.qos = 0;
          client.send(message);
        });
      });
    });

