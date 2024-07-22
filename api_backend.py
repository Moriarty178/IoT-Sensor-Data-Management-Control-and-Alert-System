from flask import Flask, jsonify, request
from flask_cors import CORS  
from flask_socketio import SocketIO, emit
import mysql.connector
import paho.mqtt.client as mqtt
import threading

app = Flask(__name__)
CORS(app)  

db_config = {
    "host": "localhost",  
    "user": "root", 
    "password": "17082002",  
    "database": "iot"  
}

mqtt_broker = "broker.emqx.io" 
mqtt_topic = "iot"
mqtt_status_topic = "light/status"


db = mysql.connector.connect(**db_config)
cursor = db.cursor()

socketio = SocketIO(app, cors_allowed_origins="*")

mqtt_client = mqtt.Client()
mqtt_client.connect(mqtt_broker, 1883, 60)
# --------------------------- Data Sensor -------------------------
# --------API lấy dữ liệu bảng sensor_data từ Database hiển thị lên web
@app.route("/api/sensor-data", methods=["GET"]) # chiều 1
def get_sensor_data():
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        query = "SELECT * FROM sensor_data ORDER BY id DESC"

        cursor.execute(query)
        results = cursor.fetchall()

        sensor_data = []
        for result in results:
            data = {
                "id": result[0],
                "temperature": result[1],
                "humidity": result[2],
                "light": result[3],
                "dust": result[4],
                "time": result[5].strftime("%Y-%m-%d %H:%M:%S") if result[5] else None,  # Định dạng lại thời gian
            }
            sensor_data.append(data)

        return jsonify(sensor_data)

    except Exception as e:
        return str(e)
    

# Tạo tuyến đường API để lấy dữ liệu theo khoảng thời gian
@app.route("/api/sensor-data/filter", methods=["POST"])
def filter_sensor_data():
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        # Lấy dữ liệu từ yêu cầu POST JSON
        data = request.json
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        query = "SELECT * FROM sensor_data WHERE timestamp BETWEEN %s AND %s ORDER BY timestamp DESC"#ASC
        cursor.execute(query, (start_date, end_date))
        results = cursor.fetchall()

        sensor_data = []
        for result in results:
            data = {
                "id": result[0],
                "temperature": result[1],
                "humidity": result[2],
                "light": result[3],
                "dust": result[4],
                "time": result[5].strftime("%Y-%m-%d %H:%M:%S") if result[5] else None,
            }
            sensor_data.append(data)

        return jsonify(sensor_data)

    except Exception as e:
        return str(e)


# Tạo tuyến đường API để lấy dữ liệu bảng action theo khoảng thời gian
@app.route("/api/action-data-light-fan/filter", methods=["POST"])
def filter_action_data():
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        # Lấy dữ liệu từ yêu cầu POST JSON
        data = request.json
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        query = "SELECT * FROM action_history1 WHERE timestamp BETWEEN %s AND %s ORDER BY timestamp DESC"#ASC
        cursor.execute(query, (start_date, end_date))
        results = cursor.fetchall()

        sensor_data = []
        for result in results:
            data = {
                "id": result[0],
                "DeviceName": result[1],
                "Status": result[2],
                "time": result[3].strftime("%Y-%m-%d %H:%M:%S") if result[3] else None,  
            }
            sensor_data.append(data)

        return jsonify(sensor_data)

    except Exception as e:
        return str(e)

@app.route("/api/action-data-light-fan", methods=["GET"]) # API chiều 3
def get_action_data_light_fan():
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        query = "SELECT * FROM action_history1 ORDER BY id DESC"# LIMIT 50"  

        cursor.execute(query)
        results = cursor.fetchall()

        action_data = []
        for result in results:
            data = {
                "id": result[0],
                "DeviceName": result[1],
                "Status": result[2],
                "time": result[3].strftime("%Y-%m-%d %H:%M:%S") if result[3] else None,  
            }
            action_data.append(data)

        return jsonify(action_data)

    except Exception as e:
        return str(e)




# -------API để Backend nhận yêu cầu bật/tắt đèn từ Front-end. Sau đó gủi đến MQTT Broker -> ESP8266. Không sử dùng Websockets ở bước này vì quy trình xử lý dữ liệu khá đơn giản
@app.route("/api/light-control", methods=["POST"]) 
def control_light():
    try:
        # Nhận yêu cầu từ front-end
        data = request.json
        action = data.get("action")  # action có thể là "on" hoặc "off"

        # Gửi lệnh tương ứng đến MQTT Broker
        if action == "on":
            mqtt_client.publish("light/control", "on")
        elif action == "off":
            mqtt_client.publish("light/control", "off")

        return jsonify({"message": f"Light {action} request sent successfully"})
    except Exception as e:
        return str(e)
        
# ----------API để Backend nhận yêu cầu bât/tắt quạt từ Front-end.
@app.route("/api/fan-control", methods=["POST"]) 
def control_fan():
    try:
        # Nhận yêu cầu từ front-end
        data = request.json
        action = data.get("action")  # action có thể là "on" hoặc "off"

        if action == "on":
            mqtt_client.publish("fan/control", "on")
        elif action == "off":
            mqtt_client.publish("fan/control", "off")

        return jsonify({"message": f"Fan {action} request sent successfully"})
    except Exception as e:
        return str(e)
# --------WebSocket event handler-----------
# Hàm kết nối MQTT
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT Broker")
    # Đăng ký chủ đề để nhận dữ liệu status từ MQTT Broker
    mqtt_client.subscribe("light/status") 
    mqtt_client.subscribe("fan/status")
    mqtt_client.subscribe("data_sensor")

# Hàm nhận dữ liệu từ MQTT Broker
def on_message(client, userdata, msg):
    if msg.topic == "light/status":
        print(f"Received status message on topic {msg.topic}: {msg.payload.decode()}")
        status_data = msg.payload.decode()
        emit_message_to_frontend(status_data) 
    elif msg.topic == "fan/status":
        print(f"Received status message on topic {msg.topic}: {msg.payload.decode()}")
        status_data1 = msg.payload.decode()
        emit_message_to_frontend1(status_data1)
    elif msg.topic == "data_sensor":
        print(f"Received status message on topic {msg.topic}: {msg.payload.decode()}")
        status_data2 = msg.payload.decode()
        emit_message_to_frontend2(status_data2)

def emit_message_to_frontend(status_data):
    with app.app_context():
        socketio.emit('message_from_backend', {"action": "status", "status": status_data}, namespace='/test')

def emit_message_to_frontend1(status_data1):
    with app.app_context():
        socketio.emit('message_from_backend1', {"action": "status", "status": status_data1}, namespace='/test1')
        
def emit_message_to_frontend2(status_data2):
    with app.app_context():
        socketio.emit('message_from_backend2', {"action": "status", "status": status_data2}, namespace='/test2')

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# WebSocket event handler
# light
@socketio.on('connect', namespace='/test')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect', namespace='/test')
def handle_disconnect():
    print('Client disconnected')
# fan
@socketio.on('connect1', namespace='/test1')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect1', namespace='/test1')
def handle_disconnect():
    print('Client disconnected')
# data_sensor
@socketio.on('connect2', namespace='/test2')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect2', namespace='/test2')
def handle_disconnect():
    print('Client disconnected')
    
if __name__ == "__main__":
    mqtt_client.loop_start()  # Bắt đầu vòng lặp MQTT để nhận dữ liệu từ Broker
    socketio.run(app, host="0.0.0.0", port=5000)