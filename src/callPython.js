 //Si el script presenta algun error, se ignora el comando event.preventDefault();
//por lo tanto se recomienda comentar form.addEventListener y reparar el error
//......................................................

//Permite econtar la ubicacion del archivo
const path = require('path');
//Permite buscar url de archvivos
const url = require('url');
//Permite comunicaciones con scripts de python
 const {PythonShell} = require('python-shell');
 
//Seleciona el formulario del html
const form = document.querySelector('form');

    form.addEventListener('submit',event =>{
        console.log(event);
        //Almacena en una constante el texto
        //Obtiene la informacion 
        const mesg = document.getElementById('usermsg');
        //Asigna el valor a una variable
        let input = mesg.value;
        //El valor del formulario vuelve a ser un valor vacio
        mesg.value ='';
        
        //Prueba en consola
        console.log(input);
        
        //LLama la funcion de python que permite dar una respuesta 

        let options = {
            //Ubicacion del archivo
            scriptPath : path.join(__dirname, '/../pythonAplication/'),
            //Mensaje a enviar al script de python
            args: [input] };
        
            python = new PythonShell('prueba.py',options)
            //Corre el archivo python
        
            python.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                console.log(message);
                 //LLama la funcnion que agrega el texto escrito y la respuesta
                 addChat(input,message)
            });
            //Finaliza el llamado de la funcion 
            python.end(function (err,code,signal) {
                if (err) throw err;
                console.log('The exit code was: ' + code);
                console.log('The exit signal was: ' + signal);
                console.log('finished');
                  });
                   
        //cancela el comportamiento por defecto del formulario
        event.preventDefault();
    });
 
    //Agrega el texto al caja del chat
    function addChat(input, product) {
        //Se obtiene la caja del chat
        const mainDiv = document.getElementById("chatbox");
        //Se crea un div para el usuario y el bot un scroll aitmatico
        let userDiv = document.createElement("div");
        userDiv.id = "user";
        //Agrega html, etiqueta span que permite un espacio de linea
        userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
        mainDiv.appendChild(userDiv);
        
        let botDiv = document.createElement("div");
        botDiv.id = "bot";
        botDiv.innerHTML = `Margaret: <span id="bot-response">${product}</span>`;
        mainDiv.appendChild(botDiv);

        //LLama la funcion que permite convertir texto a voz
        speak(product);
 };
     //Funcion que permite usar una API y convertir texto a voz 
     function speak(text){
         //Funcion de conversion
         speechSynthesis.speak(new SpeechSynthesisUtterance(text));
     };



