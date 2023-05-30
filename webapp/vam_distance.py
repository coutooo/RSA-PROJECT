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
    message = json.loads(msg.payload.decode('utf-8'))

    #print('Topic: ' + str(msg.topic))
    #print('Message' + str(message))

    rsu1_coords=(40.64301567606588,-8.656095959997351)


    latitude = message["fields"]["vam"]["vamParameters"]["basicContainer"]["referencePosition"]["latitude"]
    longitude = message["fields"]["vam"]["vamParameters"]["basicContainer"]["referencePosition"]["longitude"]

    vam_coords=(latitude,longitude)

    distance = geodesic(rsu1_coords, vam_coords).meters

    if distance < 50:
        print("Send information to the client from RSU 1 ({:.4f} meters)".format(distance))
        vam_coords_list.append(vam_coords)  # Add vam_coords to the list
    else:
        print("Client too far from RSU 1 ({:.4f} meters)".format(distance))

    return vam_coords_list


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("192.168.98.20", 1883, 60)  # vru 1

threading.Thread(target=client.loop_forever).start()

