from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

latest_data = {}
history = []
devices = {}

@app.route('/data', methods=['POST'])
def receive_data():
    global latest_data, history, devices
    data = request.get_json()
    now = datetime.now()
    data['time'] = now.isoformat()
    latest_data = data

    # Track device info
    device_id = data.get('deviceId', 'esp8266')
    device_name = data.get('deviceName', 'ESP8266')
    ip = request.remote_addr

    # Update device status
    devices[device_id] = {
        'id': device_id,
        'name': device_name,
        'status': True,
        'lastSeen': now.strftime('%Y-%m-%d %H:%M:%S'),
        'ip': ip
    }

    # Add to history (keep only last N records if you want)
    history.append({
        'deviceId': device_id,
        'deviceName': device_name,
        'ip': ip,
        'sensor': 'All',
        'temperature': data.get('temperature'),
        'humidity': data.get('humidity'),
        'light': data.get('light'),
        'value': None,  # Optional: for single-value logs
        'time': now.isoformat()
    })

    return jsonify({"status": "success"}), 200

@app.route('/data', methods=['GET'])
def send_data():
    return jsonify(latest_data), 200

@app.route('/devices', methods=['GET'])
def get_devices():
    # Mark devices offline if not seen in last 15 seconds
    now = datetime.now()
    for dev in devices.values():
        last_seen = datetime.strptime(dev['lastSeen'], '%Y-%m-%d %H:%M:%S')
        dev['status'] = (now - last_seen) < timedelta(seconds=15)
    return jsonify({
        "devices": list(devices.values()),
        "lastUpdated": now.isoformat()
    })

@app.route('/history', methods=['GET'])
def get_history():
    # Return all history (or paginate/filter if needed)
    return jsonify(history)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)