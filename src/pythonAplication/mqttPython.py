import paho.mqtt.publish as publish
import sys

#Array proveniente de javascript
prueba = sys.argv[1]

if prueba == 'off':
    publish.single("esp/helios/iluminacion",
    "F",
    qos=0,
    retain=False,
    hostname="54.227.205.125",
    port=10515,
    client_id="",
    keepalive=60,
    will=None,
    auth={'username':"placa1", 'password':"12345678"}, tls=None,)
    print('enviado off')
    
else:
    publish.single("esp/helios/iluminacion",
    "N",
    qos=0,
    retain=False,
    hostname="54.227.205.125",
    port=10515,
    client_id="",
    keepalive=60,
    will=None,
    auth={'username':"placa1", 'password':"12345678"}, tls=None,)
    print('enviado on')
		