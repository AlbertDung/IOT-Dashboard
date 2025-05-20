from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'yourgroupemail@gmail.com'
app.config['MAIL_PASSWORD'] = 'yourapppassword'
mail = Mail(app)
jwt = JWTManager(app)

# Group members as users
users = {
    "2124801030179": {
        "name": "Nguyễn Duy Dũng",
        "email": "2124801030179@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030179"),
    },
    "2124801030036": {
        "name": "Lương Nguyễn Khôi",
        "email": "2124801030036@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030036"),
    },
    "2124801030180": {
        "name": "Nguyễn Tiến Dũng",
        "email": "2124801030180@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030180"),
    },
    "2124801030076": {
        "name": "Trương Bồ Quốc Thắng",
        "email": "2124801030076@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030076"),
    },
    "2124801030233": {
        "name": "Trần Lê Thảo",
        "email": "2124801030233@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030233"),
    },
    "2124801030017": {
        "name": "Nguyễn Minh Khôi",
        "email": "2124801030017@student.tdmu.edu.vn",
        "password": generate_password_hash("2124801030017"),
    },
}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    student_id = data.get('studentId')
    password = data.get('password')
    user = users.get(student_id)
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=student_id, expires_delta=datetime.timedelta(hours=12))
        return jsonify(access_token=access_token, name=user['name'])
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    student_id = data.get('studentId')
    email = data.get('email')
    user = users.get(student_id)
    if user and user['email'] == email:
        reset_token = create_access_token(identity=student_id, expires_delta=datetime.timedelta(minutes=10))
        msg = Message("Password Reset", sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f"Click the link to reset your password: http://localhost:3000/reset-password?token={reset_token}"
        mail.send(msg)
        return jsonify({"msg": "Reset email sent"})
    return jsonify({"msg": "Student ID or email not found"}), 404

@app.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    student_id = get_jwt_identity()
    data = request.json
    new_password = data.get('password')
    if student_id in users:
        users[student_id]['password'] = generate_password_hash(new_password)
        return jsonify({"msg": "Password updated"})
    return jsonify({"msg": "User not found"}), 404

# Protect your IoT endpoints with @jwt_required() if needed

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)