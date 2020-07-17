//configuracion Toastr
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

//Clase que permite usar socket en modo cliente
 const io = require('socket.io-client');
//conexion al cliente
const socket = io('http://localhost:5000/');

//Verificacion en la consola de conexion al servidor
socket.on('connect', () => {
    console.log('Cliente conectado:');
  });

if (socket.connected == true){
    toastr.success('¡Conectado con Margaret!','Estado:',optionsToastr);
} else{
    toastr.error('¡No se pudo conectar con Margaret!','Estado:',optionsToastr);
};

//Funcion del chat
(function () {
    var Message;
    //Esto de alguna forma adiciona el html  cuando se recibe el mensaje
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        //variable que controla si el mensaje aparece en la izquierda o derecha de la caja
        message_side = 'right';
        //Obtiene el mensaje de la caja del input
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        //Envia el mensaje a la caja del chat
        sendMessage = function (text, user) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            if  (user == 'Margaret'){
                message_side = 'left'
            }
            else{
                message_side = 'right'
            }
            //message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            
            message.draw();
            //Si el mensaje es de Margaret reproduce su voz
            if  (user == 'Margaret'){
                speak(text);
            }
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        //Escucha los eventos de click en el boton y presionar letra "key"
        //Escucha el boton
        $('.send_message').click(function (e) {
            //counter
            let n = 0;
            //Mensaje que se envia al main
            let getmenssage = getMessageText()
            //Mensaje proveniente del usuario que se envia a la caja de texto
            sendMessage(getmenssage,'me');
            let response = {
                name: 'me',
                menssage: getmenssage
            };
          
            //Envia un mensaje al servidor
            socket.emit('message',getmenssage);
            //Recibe la respuesta de ese mensaje 
            socket.on('message',(response) =>{
                //console.log(response);
                //Mensaje proveniente de Margaret que se envia a la caja de texto
                if (n < 1){
                    sendMessage(response['message'],response['name']);
                    //Cosa para evitar que se repita la frase de respuesta
                    //No se sabe que causa este comportamiento
                    n = 1
                } 
                
            });

            return null ;
        });

        //Escucha "key"
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                let n = 0;
                //Mensaje que se envia al main
                let getmenssage = getMessageText()
                //Envia el mensaje del usuario
                sendMessage(getmenssage,'me');
                
                let response = {
                    name: 'me',
                    menssage:getmenssage
                };
                //Envia un mensaje al servidor
                socket.emit('message',getmenssage);
                //Recibe la respuesta de ese mensaje 
                socket.on('message',(response) =>{
                    if (n < 1){
                        sendMessage(response['message'],response['name']);
                        //Cosa para evitar que se repita la frase de respuesta
                        //No se sabe que causa este comportamiento
                        n = 1
                    } 
            });
            return null ;
            }
        });
        sendMessage('Hola Santiago! :3','Margaret');
        
    });
}.call(this));

//permite utilizar un API que pasa de texto a voz
function speak(text){
    //Funcion de conversion
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

