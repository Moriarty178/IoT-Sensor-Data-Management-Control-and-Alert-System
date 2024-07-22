import paho.mqtt.client as mqtt
import mysql.connector
import json

# MQTT Broker configuration
mqtt_broker = "broker.emqx.io" 
mqtt_topic = "data_sensor"  
mqtt_status_topic = "light/status" 

# MySQL database configuration
db_config = {
    "host": "localhost",  
    "user": "root",  
    "password": "17082002",  
    "database": "iot"  
}

db = mysql.connector.connect(**db_config)
cursor = db.cursor()

# MQTT Broker connection
client = mqtt.Client()  
client_status = mqtt.Client()  

# Hàm xử lý khi kết nối MQTT Broker
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")
    client.subscribe(mqtt_topic)  
    client.subscribe("device_status")

def on_message(client, userdata, msg):
    if msg.topic == "data_sensor": 
        print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")
        data = json.loads(msg.payload.decode())

        insert_data_sql = "INSERT INTO sensor_data (temperature, humidity, light, dust) VALUES (%s, %s, %s, %s)" 
        insert_data_values = (data["temperature"], data["humidity"], data["light"], data["dust"])
        cursor.execute(insert_data_sql, insert_data_values)
        db.commit()
        print("Data inserted into MySQL")
    elif msg.topic == "device_status": 
        print(f"Received status message on topic {msg.topic}: {msg.payload.decode()}")
        data = json.loads(msg.payload.decode())

        insert_status_sql1 = "INSERT INTO action_history1 (DeviceName, Status) VALUES (%s, %s)"
        insert_status_values1 = (data["DeviceName"], data["Status"])

        cursor.execute(insert_status_sql1, insert_status_values1)
        db.commit()
        print("Data has been inserted into MySQLL") 
        

# Đăng ký hàm xử lý cho các sự kiện MQTT
client.on_connect = on_connect
client.on_message = on_message

client_status.on_connect = on_connect
client_status.on_message = on_message

# Kết nối tới MQTT Broker
client.connect(mqtt_broker, 1883, 60)
client_status.connect(mqtt_broker, 1883, 60)

# Lặp vô hạn cho cả hai máy chủ MQTT
client.loop_forever()
client_status.loop_forever()

