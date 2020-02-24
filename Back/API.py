import secrets
#remove cors when launched
from datetime import datetime
from flask_cors import CORS
from OpenSSL import SSL
import os
context = SSL.Context(SSL.SSLv23_METHOD)
cer = os.path.join(os.path.dirname(__file__), 'localhost.crt')
key = os.path.join(os.path.dirname(__file__), 'localhost.key')
##########################

#importing other files
from UsefulllFunctions import *
from Services import *
from Database import db,user
from Weather import weather
from Facebook import facebooke_api
from Google import google_api
from Github import github_api
from Cryptocurrency import crypto_api
from Intra import intra_api
from ServicesActivation import services_api
from Yammer import yammer_api
from Trello import trello_api
from AirQuality import air_quality_api


app = Flask(__name__)
app.register_blueprint(facebooke_api)
app.register_blueprint(weather)
app.register_blueprint(google_api)
app.register_blueprint(github_api)
app.register_blueprint(crypto_api)
app.register_blueprint(intra_api)
app.register_blueprint(services_api)
app.register_blueprint(yammer_api)
app.register_blueprint(trello_api)
app.register_blueprint(air_quality_api)
CORS(app)


@app.route('/')
def index():
    return "Best api ever"

#Normal login
@app.route('/login', methods=['POST'])
def login():
    access_token = secrets.token_hex(16)
    try:
        email = request.get_json()['email']
        password = request.get_json()['password']
    except:
        return returnMessage("Missing infos in body\nInfos sended:\n\n" + str(request.get_json()) + "\n\nThat's shitty", 601), 601

    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for users in all_users.each():
            if users.val()['email'] == email:
                if users.val()['password'] == password:
                    if "access_token" not in users.val():
                        db.child('users').child(users.key()).update({"access_token": access_token}, user['idToken'])
                        users.val()['access_token'] = access_token
                else:
                    return returnMessage("Mauvais mot de passe", 602), 602
                del users.val()['password']
                return users.val()
    else:
        return returnMessage("Non inscrit", 603), 603


#Normal register
@app.route('/register', methods=['POST'])
def register():
    try:
        email = str(request.get_json()['email'])
        userData = {
            "access_token": secrets.token_hex(16),
            "email": request.get_json()['email'],
            "password": request.get_json()['password'],
            "name": request.get_json()['name'],
            "role": "User",
            "type": "normal",
            "google": {
                "activated": "false"
            },
            "facebook": {
                "activated": "false"
            },
            "github": {
                "activated": "false"
            },
            "intra": {
                "activated": "false"
            },
            "yammer": {
                "activated": "false"
            },
            "trello": {
                "activated": "false"
            },
            "user_widgets": basicWidget
        }
    except:
        return returnMessage("Missing infos in body\nInfos sended:\n\n" + str(request.get_json()) + "\n\nThat's shitty", 601), 601

    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for users in all_users.each():
            if 'email' in users.val() and users.val()['email'] == userData['email']:
                return returnMessage("Le compte existe deja", 600), 600

    db.child("users").push(userData, user['idToken'])
    return returnMessage("success", 200), 200


@app.route('/about.json')
def aboutJSON():
    tmpJSON = About
    tmpJSON['server']['current_time'] = int(datetime.timestamp(datetime.now()))
    tmpJSON['customer']['host'] = request.remote_addr
    return jsonify(tmpJSON), 200

@app.route('/change_widget_positions', methods=['POST'])
def change_widget_position():
    try:
        access_token = request.headers.get('Authorization')
        widget_id = request.get_json()['widget_id']
        x = request.get_json()['x']
        y = request.get_json()['y']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is not None:
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('position').update({"x": x, "y": y}, user['idToken'])
        return returnMessage("success", 200), 200
    else:
        return returnMessage("Mauvaises informations envoyees", 601), 601


@app.route('/delete_widget', methods=['DELETE'])
def delete_widget():
    try:
        access_token = request.headers.get('Authorization')
        widget_id = request.args.get('id')
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601

    db.child("users").child(current_user.key()).child('user_widgets').child(str(widget_id)).remove(user['idToken'])
    return jsonify(db.child("users").child(current_user.key()).child('user_widgets').get(user['idToken']).val()), 200


@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    try:
        access_token = request.headers.get('Authorization')
        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    if current_user.val()['role'] != 'King Admin':
        return returnMessage('Not admin account', 606), 606
    all_db = db.child('users').get(user['idToken']).val()
    JSON = []
    for each in all_db:
        JSON.append(db.child('users').child(each).get(user['idToken']).val())
    return jsonify(JSON)


@app.route('/delete_user', methods=['POST'])
def delete_user():
    try:
        access_token = request.headers.get('Authorization')
        user_access_token = request.get_json()['user_access_token']
        current_user = findUserByToken(access_token)
        delete_user = findUserByToken(user_access_token)
        if current_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
        if delete_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601
    if current_user.val()['role'] != 'King Admin':
        return returnMessage('Not admin account', 606), 606

    db.child('users').child(delete_user.key()).remove(user['idToken'])
    all_db = db.child('users').get(user['idToken']).val()
    JSON = []
    for each in all_db:
        JSON.append((db.child('users').child(each).get(user['idToken']).val()))
    return jsonify(JSON)


@app.route('/change_role', methods=['POST'])
def change_role():
    try:
        access_token = request.headers.get('Authorization')
        user_access_token = request.get_json()['user_access_token']
        role = request.get_json()['role']
        current_user = findUserByToken(access_token)
        change_user = findUserByToken(user_access_token)
        if current_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
        if change_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601
    if current_user.val()['role'] != 'King Admin':
        return returnMessage('Not admin account', 606), 606

    db.child('users').child(change_user.key()).update({'role': role}, user['idToken'])
    return returnMessage('success', 200)


if __name__ == "__main__":
    context = (cer, key)
    app.run(host="0.0.0.0", ssl_context=context, debug=False)
