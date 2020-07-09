//Permite tener las clases de elctron.
const electron= require('electron');
const path = require('path');
const {ipcRenderer} =  require('electron');
const remote = electron.remote

//Obtiene los datos de los elementos del formulario
const save_info = document.getElementById('save_data')
const closeBTn = document.getElementById('close_add');


//Al detectar el evento del boton cerrar la ventana se cerrará.
closeBTn.addEventListener('click',function(event){
    
    close_window();

});

//Guardara los datos que se encuetran en el formulario

save_info.addEventListener('click',function(event){

    //Obtiene la informacion 
    const name = document.getElementById('name_iot');
    const topic = document.getElementById('topic_iot');
    const payloadOn = document.getElementById('payload_iotOn');
    const payloadOff = document.getElementById('payload_iotOff');

    //Asigna el valor a una variable
    let input_name = name.value;
    let input_topic = topic.value;
    let input_payloadOn = payloadOn.value;
    let input_payloadOff = payloadOff.value;
    
    //Datos del formulario en archivo json
    let data = {
        name: input_name,
        topic:input_topic,
        payloadOn:input_payloadOn,
        payloadOff:input_payloadOff

    };

    //Envia un mensaje al archivo principal de electron
    ipcRenderer.send('message:data',data);
    //Recibe la respuesta de ese mensaje 
    //event.preventDefault()

    //Si los elementos  están vacios no cieera la ventana
    if (input_name !== '' && input_topic !== '' && input_payloadOn !== '' && input_payloadOff !== ''){
        close_window();
    };

    

});


//Funcion que permite cerrar la ventana 
function close_window(){
     //ventana
     let window = remote.getCurrentWindow();

     //Cierra la ventana semejanta al cerrarla dando a la x.
     window.close();

};