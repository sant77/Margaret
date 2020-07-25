const {ipcRenderer} =  require('electron');

const close_app = document.getElementById('close');

close_app.addEventListener('click',function(event){
    ipcRenderer.send('message:close','close');
    
});