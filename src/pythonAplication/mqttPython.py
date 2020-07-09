import paho.mqtt.publish as publish
import sys

#Array proveniente de javascript
prueba = sys.argv[1]

if prueba == 'off':
    publish.single("esp/helios/iluminacion",
    "F",
    qos=0,
    retain=False,
    hostname="",
    port=,
    client_id="",
    keepalive=60,
    will=None,
    auth={'username':"", 'password':""}, tls=None,)
    print('enviado off')
    
else:
    publish.single("esp/helios/iluminacion",
    "N",
    qos=0,
    retain=False,
    hostname="",
    port=,
    client_id="",
    keepalive=60,
    will=None,
    auth={'username':"", 'password':""}, tls=None,)
    print('enviado on')
		
