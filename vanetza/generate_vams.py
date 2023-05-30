import json
import paho.mqtt.client as mqtt
import threading
from time import sleep

coordinates = [
    [40.64298146111145, -8.656243938860625],  # gran turino
    [40.642887841187765, -8.656163472597399],
    [40.64287970031862, -8.656007904488495],
    [40.642932615950244, -8.655814785456753],
    [40.64279829157265, -8.65568603943559],  # cais do pescado
    [40.64263140333302, -8.655702132688235],  # O bairro
    [40.64252557155021, -8.655986446818302],
    [40.642668037372594, -8.656034726576237],
]

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("vanetza/out/vam")
    # client.subscribe("vanetza/out/denm")
    # ...


# É chamada automaticamente sempre que recebe uma mensagem nos tópicos subscritos em cima
def on_message(client, userdata, msg):
    message = json.loads(msg.payload.decode('utf-8'))

    print('Topic: ' + msg.topic)
    print('Message' + message)

    # lat = message["latitude"]
    # ...


def generate(coordinate):
    with open('in_vam.json') as f:
        m = json.load(f)

    latitude, longitude = coordinate
    m["vamParameters"]["basicContainer"]["referencePosition"]["latitude"] = latitude
    m["vamParameters"]["basicContainer"]["referencePosition"]["longitude"] = longitude

    m = json.dumps(m)

    client.publish("vanetza/in/vam", m)
    f.close()


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("192.168.98.10", 1883, 60)

threading.Thread(target=client.loop_forever).start()

counter = 0
while True:
    if counter >= len(coordinates):
        counter = 0

    coordinate = coordinates[counter]
    generate(coordinate)

    counter += 1
    sleep(1)
