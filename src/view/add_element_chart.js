//Todas las llaves del localstorage tendran la siguiente estrucutra:
//"elemento" + "origen" ej:
//lampara mqtt
//El elemento permite buscar cuando se necesite
//El origen permite de donde provienen ese dato
//Comunicacion con el main
const {ipcRenderer} =  require('electron');
const {Chart} = require('chart.js')
const {Client} = require('paho-mqtt')
//Renderizar los datos guardados del localstorage
//renderHtml();
//renderChart();
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
let chartData = JSON.parse(localStorage.getItem('chart chartMqtt'));

//Cliente mqtt, configuraccion y funciones
clientID = "clientID-" + parseInt(Math.random() * 100);

let client = new Client(serverData.server,parseInt(serverData.port),clientID);
// set callback handlers

//client.onMessageArrived = onMessageArrived;

client.connect({
  useSSL: true,
  userName: serverData.user,
  password: serverData.password,
  onSuccess: onConnect,
  onFailure: onFailure
});

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected to m15.cloudmqtt.com...");
    toastr.success('¡Conectado con el servidor MQTT!','Estado:',optionsToastr);
    client.subscribe(chartData.topic);
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
 
//Datos y opciones para para los datos
let dataMqtt = {
  labels: [],
  datasets: [{
          label: "",
          data: [],
          lineTension: 0,
          fill: false,
          borderColor: 'orange',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          pointBorderColor: 'orange',
          pointBackgroundColor: 'rgba(255,150,0,0.5)',
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded'
        }]
      };
//Opciones de la grafica
let chartOptions = {
  legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 80,
            fontColor: 'black'
          }
        }
      };
//Crea la grafica
let ctx = document.getElementById("chart");
              let chart = new Chart(ctx, {
                type: 'line',
                data: dataMqtt,
                options: chartOptions
              });

//Se subcribe y actualiza el grafico
ipcRenderer.on('message:chart',(e, data) =>{
  
  storageMqtt('chart chartMqtt',data)
  client.subscribe(data.topic);
  //cambia el nombre y borra los datos del grafico
  updateNameChart(data.name)
  resetChart()
        });

//Permite cerrar la aplicacion
const close_app = document.getElementById('close');

close_app.addEventListener('click',function(event){
    ipcRenderer.send('message:close','close');
    
});

// called when a message arrives
function onMessageArrived(message) {
  let now = new Date();
  // convert date to a string in UTC timezone format:
  console.log(now.toUTCString());

  console.log("onMessageArrived:"+message.payloadString);
  addChart(now.toUTCString(),parseInt(message.payloadString))

}
//Funcion que permite actualizar los datos del grafico

function addChart(x,y){
  //actualiza el eje x
  chart.data.labels.push(x);
  //actualiza el eje y
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(y);
    });
  chart.update();
  let data = JSON.parse(localStorage.getItem('chart chartMqtt'));
  data.chartDatax.push(x)
  data.chartDatay.push(y)
  storageMqtt('chart chartMqtt',data);
}
//deja la grafica en blanco
function resetChart(){
  chart.data.datasets[0].data = [];
  chart.data.labels = [''];

  chart.update()

}
//actualiza la grafica con los datos del local storage
function updateChart(x,y){
  chart.data.datasets[0].data =y;
  chart.data.labels = x;
  chart.update()
  console.log('hola')
}
//Actualiza el nombre de la grafica
function updateNameChart(name){
  //actualiza el titulo de la grafica
  chart.data.datasets[0].label = name;
  chart.update();
}
//Si hay datos en el local storage los actualiza en la grafica
if (chartData != null){
  console.log(chartData)
  updateChart(chartData.chartDatax,chartData.chartDatay);
  
  updateNameChart(chartData.name);
}