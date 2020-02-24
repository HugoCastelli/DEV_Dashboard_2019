from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *

air_quality_api = Blueprint('air_quality', __name__)


@air_quality_api.route('/air_quality', methods=['POST', 'GET', 'PUT'])
def air_quality():
        if request.method == 'POST':
            try:
                current_user = findUserByToken(request.headers.get('Authorization'))
                city = request.get_json()['city']
                id = secrets.token_hex(5)
                refresh_time = request.get_json()['time']
                widget = {
                    id: {
                        "name": "air_quality",
                        "description": "Afficher la qualite de l'air d'une ville choisie",
                        "id": id,
                        "params": {
                            "city": city,
                            "time": refresh_time
                        },
                        "position": {
                            "cols": 2,
                            "rows": 2,
                            "y": 0,
                            "x": 0
                        }
                    }
                }
            except:
                return returnMessage("Mauvaises informations envoyees", 601), 601
            if current_user is not None:
                db.child('users').child(current_user.key()).child('user_widgets').update(widget, user['idToken'])
                return widget, 200
        elif request.method == 'GET':
            try:
                access_token = request.headers.get('Authorization')
                widget_id = request.args.get('widget_id')
                current_user = findUserByToken(access_token)
                if current_user is None:
                    return returnMessage("Mauvais access_token", 601), 601
                city = current_user.val()['user_widgets'][str(widget_id)]['params']['city']
                url = "https://api.waqi.info/feed/" + city + "/?token=63e53c1d0dec47141aeecb30ff2a75993cd2f273"
            except:
                return returnMessage("bad", 601), 200

            qualitydata = requests.get(url)

            if qualitydata.status_code is not 200:
                return returnMessage('Ville non existante', 601), 601

            colors = 'green'
            health = ''
            quality = int(qualitydata.json()['data']['aqi'])

            if 0 <= quality <= 50:
                colors = "#499a66"
                health = 'Good'
            if 51 <= quality <= 100:
                colors = "#ffde33"
                health = 'Moderate'
            if 101 <= quality <= 150:
                colors = "#f49732"
                health = 'Unhealthy'
            if 151 <= quality <= 200:
                colors = "#ce4534"
                health = 'Unhealthy'
            if 201 <= quality <= 300:
                colors = "#6a4399"
                health = 'Very Unhealthy'
            if 301 <= quality:
                colors = "#7f2824"
                health = 'Hazardous'

            JSON = {
                'city_name': city,
                'city_geo': qualitydata.json()['data']['city']['geo'],
                'quality': quality,
                'color': colors,
                'health': health
            }
            return jsonify(JSON)

        elif request.method == 'PUT':
            try:
                widget_id = request.get_json()['widget_id']
                city = request.get_json()['city']
                refresh_time = request.get_json()['time']
                access_token = request.headers.get('Authorization')
            except:
                return returnMessage("Mauvaises informations envoyees", 601), 601

            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601

            update = {
                'city': city,
                'time': refresh_time
            }
            db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
            return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200

