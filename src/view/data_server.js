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

  const dataDefault ={
    server:'none',
    port:'none',
    user:'none',
    password:'none'
};


const save_data_server = document.getElementById('servidorData');



  //Almacenamiento local
  const storageData = (id,data) =>{
    localStorage.setItem(id,JSON.stringify(data))

  };


  if (localStorage.getItem('data validation') == null){
    storageData('data validation',dataDefault);
}


save_data_server.addEventListener('click',function(event){
    //Previene el comportamiento por defecto de un formulario (refrescar la pagina)
    event.preventDefault();
    
    const server = document.getElementById('servidor');
    const port = document.getElementById('port');
    const user = document.getElementById('users');
    const password = document.getElementById('password');

     //Asigna el valor a una variable
     let input_server = server.value;
     let input_port = port.value;
     let input_user = user.value;
     let input_password = password.value;

     let data ={
         server:input_server,
         port:input_port,
         user:input_user,
         password:input_password
     };
     //Primero removemos los datos y despues guardamos
     localStorage.removeItem('data validation');
     storageData('data validation',data);
     toastr.success('¡Datos guardados!','Estado:',optionsToastr);
     server.value = '';
     port.value = '';
     user.value = '';
     password.value = '';

});

