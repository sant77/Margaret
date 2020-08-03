function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
//cabecera del csv
const headers = {
    datax: "Fecha",
    datay: "Datos eje y"
};
//datos que tendra el csv
const data = [
  
   ];

//Cuando se oprima el boton realiza  la descarga
const downloadButton = document.getElementById('download');

downloadButton.addEventListener('click',function(event){
    let chartData = JSON.parse(localStorage.getItem('chart chartMqtt'));
    //itera por los datos y los agraga al json
    for (let i = 0; i < chartData.chartDatax.length; i++) {
        data.push({fecha:chartData.chartDatax[i],datay:chartData.chartDatay[i]})
     }


    //funcion que realiza la converacion
    exportCSVFile(headers, data, 'Datos de '+chartData.name);

});