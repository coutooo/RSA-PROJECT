import json
import paho.mqtt.client as mqtt
import threading
from time import sleep
from geopy.distance import geodesic

vam_coords_list = []  # Initialize a list to store all vam_coords

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("vanetza/out/vam")

# É chamada automaticamente sempre que recebe uma mensagem nos tópicos subscritos em cima
def on_message(client, userdata, msg):
    global vam_coords_list
    tmp = 0

    message = json.loads(msg.payload.decode('utf-8'))

    #print('Topic: ' + str(msg.topic))
    #print('Message' + str(message))

    rsu1_coords=(40.6429,-8.65608)
    #rsu2_coords=(40.64255,-8.65568)

    latitude = message["fields"]["vam"]["vamParameters"]["basicContainer"]["referencePosition"]["latitude"]
    longitude = message["fields"]["vam"]["vamParameters"]["basicContainer"]["referencePosition"]["longitude"]

    #receiverID = message["receiverID"]
    vruID = message["stationID"]

    vam_coords_distance=(latitude,longitude)
    vam_coords=(latitude,longitude,vruID)
    vam_coords_list.append(vam_coords)

    distance = geodesic(rsu1_coords, vam_coords_distance).meters

    #if distance < 50 and tmp != distance:
    #    tmp = distance
    #    print("Send information to the client from RSU 1 ({:.4f} meters)".format(distance))
    #else:
    #    print("Client too far from RSU 1 ({:.4f} meters)".format(distance))

    return vam_coords_list


rsu1 = mqtt.Client()
rsu1.on_connect = on_connect
rsu1.on_message = on_message
rsu1.connect("192.168.98.10", 1883, 60)  # rsu 1

#rsu2 = mqtt.Client()
#rsu2.on_connect = on_connect
#rsu2.on_message = on_message
#rsu2.connect("192.168.98.11", 1883, 60)  # rsu 2

threading.Thread(target=rsu1.loop_forever).start()
#threading.Thread(target=rsu2.loop_forever).start()

