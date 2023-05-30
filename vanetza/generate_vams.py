import json
import paho.mqtt.client as mqtt
import threading
from time import sleep

coordinates = [
    [40.64295612665284,-8.656200885707223],
    [40.64290725527005,-8.656163334781015],
    [40.64285431123166,-8.656120419436776],
    [40.642805439774314,-8.656098961764657],
    [40.64275656828118,-8.656072139674508],
    [40.64270769675227,-8.65603995316633],
    [40.6426588251876,-8.65601313107618],
    [40.642614026221864,-8.655975580149972],[40.64255293667468,-8.655927300387704],
    [40.64252850084015,-8.655862927371347],[40.6425447913975,-8.65578782551893],
    [40.642577372500256,-8.655712723666513],[40.64261809885636,-8.655648350650155],
    [40.64266289781935,-8.655626892978036],[40.64270769675227,-8.655648350650155],
    [40.642744350402296,-8.655675172740304],[40.64278914928056,-8.655701994830453],
    [40.64283802074983,-8.655728816920602],[40.642878746946906,-8.655755639010751],
    [40.64291947311909,-8.65577709668287],[40.64296427187985,-8.65579855435499],
    [40.643013143220855,-8.655830740863168],[40.643066087133306,-8.655857562953317],
    [40.64300499799985,-8.655825376445138],[40.64297648971843,-8.65580391877302],[40.642927618350555,-8.65578782551893],
    [40.642895037418754,-8.655825376445138],[40.642878746946906,-8.655884385043466],[40.64284616599124,-8.655927300387704],
    [40.64284616599124,-8.655991673404062],[40.64283394812877,-8.65605068200239],[40.64283394812877,-8.656082868510568],
    [40.64288689218333,-8.656136512690866],[40.64290318265322,-8.656157970362985],[40.64293576358102,-8.656190156871164],
    [40.64296019926645,-8.656206250125253]
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
client.connect("192.168.98.10", 1883, 60)  # .10 -> rsu1

threading.Thread(target=client.loop_forever).start()

counter = 0
while True:
    if counter >= len(coordinates):
        counter = 0

    coordinate = coordinates[counter]
    generate(coordinate)

    counter += 1
    sleep(1)
