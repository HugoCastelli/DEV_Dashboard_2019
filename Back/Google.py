from flask import *
import pyrebase
import secrets
from Database import db,user
from UsefulllFunctions import *
from Services import *
import requests

google_api = Blueprint('google', __name__)
google_map_access_token = 'AIzaSyBWR7UHJpaO_hU_UbjOCUKePc7vwIDBW0Y'

#Facebook register
@google_api.route('/googleregister', methods=['POST'])
def googleregister():
    userData = {
        "name": request.get_json()['name'],
        "access_token": request.get_json()['access_token'],
        "id_token": request.get_json()['id_token'],
        "profile_img": request.get_json()['image'],
        "google_user_id": request.get_json()['user_id'],
        "email": request.get_json()['email'],
        "role": "User",
        "type": "google",
        "google": {
            "name": request.get_json()['name'],
            "access_token": request.get_json()['access_token'],
            "id_token": request.get_json()['id_token'],
            "img": request.get_json()['image'],
            "google_user_id": request.get_json()['user_id'],
            "activated": "true"
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
    try:
        pass
    except:
        return returnMessage("Mauvaises donnees envoyees", 601), 601

    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for each in all_users.each():
            if 'email' in each.val() and each.val()['email'] == userData['email']:
                return returnMessage("Le compte existe deja", 600), 600
    db.child('users').push(userData, user['idToken'])

    return returnMessage("success", 200), 200


@google_api.route('/googlelogin', methods=['POST'])
def googlelogin():
    try:
        user_id = request.get_json()['user_id']
        access_token = request.get_json()['access_token']
        id_token = request.get_json()['id_token']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByGoogleId(user_id)
    if current_user is not None:
        db.child("users").child(current_user.key()).update({'access_token': access_token}, user['idToken'])
        db.child("users").child(current_user.key()).update({'id_token': id_token}, user['idToken'])
        db.child("users").child(current_user.key()).child('google').update({'access_token': access_token}, user['idToken'])
        db.child("users").child(current_user.key()).child('google').update({'id_token': id_token}, user['idToken'])
    else:
        return returnMessage("Le compte n'existe pas", 603), 603
    current_user = findUserByGoogleId(user_id)
    return current_user.val()


@google_api.route('/addgoogle', methods=['POST'])
def addgoogle():
    try:
        name = request.get_json()['name']
        google_access_token = request.get_json()['google_access_token']
        profile_img = request.get_json()['image']
        google_user_id = request.get_json()['user_id']
        email = request.get_json()['email']
        access_token = request.headers.get('access_token')
    except:
        return returnMessage("Mauvaises donnees envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601
    if current_user.val()['google']['activated'] == "true":
        return returnMessage("Deja active", 601), 601

    google_data = {
        "name": name,
        "access_token": google_access_token,
        "img": profile_img,
        "fb_user_id": google_user_id,
        "email": email,
        "activated": "true"
    }


    db.child("users").child(current_user.key()).child('google').update(google_data, user['idToken'])
    current_user = findUserByToken(access_token)
    return current_user, 200


@google_api.route('/place_reviews', methods=['POST', 'GET', 'PUT'])
def place_reviews():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            place_id = request.get_json()['place_id']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "place_review",
                "description": "Afficher les reviews d'un endroit choisis",
                "id": id,
                "params": {
                    "place_id": place_id,
                    "time": refresh_time
                },
                "position": {
                    "cols": 1,
                    "rows": 1,
                    "y": 0,
                    "x": 0
                }
            }
        }
        db.child('users').child(current_user.key()).child('user_widgets').update(widget, user['idToken'])
        return widget, 200
    elif request.method == 'GET':
        try:
            widget_id = request.args.get('widget_id')
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601
        place_id = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['place_id']
        url = 'https://maps.googleapis.com/maps/api/place/details/json'

        params = {
            'key': google_map_access_token,
            'fields': 'name, rating, formatted_phone_number',
            'place_id': place_id
        }
        data = requests.get(url, params=params)


        return returnMessage("success", 200), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.args.get_json()['widget_id']
            refresh_time = request.get_json()['time']
            info_type = request.get_json()['info_type']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'subscribed': info_type,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return jsonify(db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val()), 200
    return returnMessage("success", 200), 200