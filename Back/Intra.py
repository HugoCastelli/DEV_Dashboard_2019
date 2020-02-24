from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *

intra_api = Blueprint('intra', __name__)
base_url = 'https://intra.epitech.eu/'

@intra_api.route('/intra_modules', methods=['GET', 'POST', 'PUT'])
def intra_modules():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            subscribed = request.get_json()['subscribed']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "intra_modules",
                "description": "Afficher les modules inscrits/non inscrits",
                "id": id,
                "params": {
                    "subscribed": subscribed,
                    "time": refresh_time
                },
                "position": {
                    "cols": 4,
                    "rows": 2,
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
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
            subscribed = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['subscribed']
            autologin = db.child('users').child(current_user.key()).child('intra').get(user['idToken']).val()['autologin']
            url = base_url + autologin + '/course/filter'
        except:
            return returnMessage("bad", 601), 200

        params = {
            'format': 'json'
        }
        data = requests.get(url, params=params)
        print(data.status_code)
        modules = []
        for each in data.json():
            tmp = {
                "title": "",
                "status": "",
                "code": "",
                "credits": 0
            }
            if subscribed == "true" and each['scolaryear'] == 2019 and each['status'] != 'notregistered':
                if each['status'] == 'ongoing':
                    tmp['title'] = each['title']
                    tmp['status'] = "On going"
                    tmp['credits'] = each["credits"]
                    tmp['code'] = each["code"]
                elif each['status'] == 'valid':
                    tmp['title'] = each['title']
                    tmp['status'] = "Finished"
                    tmp['credits'] = each["credits"]
                    tmp['code'] = each["code"]
                elif each['status'] == 'fail':
                    tmp['title'] = each['title']
                    tmp['status'] = "Failed"
                    tmp['credits'] = each["credits"]
                    tmp['code'] = each["code"]
                modules.append(tmp)
            elif subscribed == "false" and each['scolaryear'] == 2019 and each['status'] == 'notregistered':
                if each['status'] == 'notregistered':
                    tmp['title'] = each['title']
                    tmp['status'] = "Unsubscribed"
                    tmp['credits'] = each["credits"]
                    tmp['code'] = each["code"]
                modules.append(tmp)
        return jsonify(modules), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            refresh_time = request.get_json()['time']
            subscribed = request.get_json()['subscribed']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'subscribed': subscribed,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


@intra_api.route('/intra_infos', methods=['GET', 'POST', 'PUT'])
def intra_infos():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            info_type = request.get_json()['info_type']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "intra_infos",
                "description": "Afficher les infos du profil intra",
                "id": id,
                "params": {
                    "type": info_type,
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
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601

            info_type = current_user.val()['user_widgets'][str(widget_id)]['params']['type']
            autologin = db.child('users').child(current_user.key()).child('intra').get(user['idToken']).val()['autologin']
            url = base_url + autologin + '/user'
        except:
            return returnMessage("bad", 601), 200

        params = {
            'format': 'json'
        }
        data = requests.get(url, params=params)
        if info_type == 'GPA':
            infos = {
                'type': info_type,
                'GPA': data.json()['gpa'][0]['gpa']
            }
        elif info_type == 'credits':
            infos = {
                'type': info_type,
                'credits': data.json()['credits']
            }
        elif info_type == 'image':
            infos = {
                'type': info_type,
                'image': "https://intra.epitech.eu" + data.json()['picture']
            }
        return infos, 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            refresh_time = request.get_json()['time']
            info_type = request.get_json()['info_type']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'type': info_type,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200