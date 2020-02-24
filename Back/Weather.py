from flask import *
import pyrebase
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *

weather = Blueprint('weather', __name__)
api_key = "57330a1bfce207b4c42b0c4297c4a62e"

#Weather API
@weather.route('/current_weather', methods=['POST', 'GET', 'PUT'])
def current_weather():
    if request.method == 'POST':
        current_user = findUserByToken(request.headers.get('Authorization'))
        city = request.get_json()['city']
        refresh_time = request.get_json()['time']
        id = secrets.token_hex(5)
        widget = {
            id: {
                "name": "current_weather",
                "description": "Afficher la meteo dans une ville choisie",
                "id": id,
                "params": {
                    "city": city,
                    "time": refresh_time
                },
                "position": {
                    "cols": 2,
                    "rows": 1,
                    "y": 0,
                    "x": 0
                }
            }
        }
        if current_user is not None:
            db.child('users').child(current_user.key()).child('user_widgets').update(widget, user['idToken'])
            return widget, 200
    elif request.method == 'GET':
        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            access_token = request.headers.get('Authorization')
            widget_id = request.args.get('widget_id')
            currentUser = findUserByToken(access_token)
            city = db.child('users').child(currentUser.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['city']
        except:
            return returnMessage("bad", 601), 200

        param = {
            "q": city,
            "appid": api_key,
            "lang": "fr",
            "units": "metric"
        }
        current_weather = requests.get(url=url, params=param)

        if current_weather.status_code != 200:
            return returnMessage("Erreur d'orthographe dans le nom de la ville", 605), 605

        if currentUser is None:
            return returnMessage("Mauvais access_token", 604), 604

        weather_res = {
            "city": city,
            "meteo": current_weather.json()['weather'][0]['description'],
            "icon": current_weather.json()['weather'][0]['icon'],
            "temperatures": current_weather.json()['main']
        }
        return weather_res
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


@weather.route('/forecast_weather', methods=['POST', 'GET', 'PUT'])
def forecast_weather():
    if request.method == 'POST':
        try:
            current_user = findUserByToken(request.headers.get('Authorization'))
            city = request.get_json()['city']
            id = secrets.token_hex(5)
            refresh_time = request.get_json()['time']
            widget = {
                id: {
                    "name": "forecast_weather",
                    "description": "Afficher les previsions meteos d'une ville choisie",
                    "id": id,
                    "params": {
                        "city": city,
                        "time": refresh_time
                    },
                    "position": {
                        "cols": 4,
                        "rows": 1,
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
        url = "https://api.openweathermap.org/data/2.5/forecast"
        try:
            access_token = request.headers.get('Authorization')
            widget_id = request.args.get('widget_id')
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
            city = current_user.val()['user_widgets'][str(widget_id)]['params']['city']
        except:
            return returnMessage("bad", 601), 200

        params = {
            'q': city,
            "appid": api_key,
            "lang": "fr",
            "units": "metric"
        }

        forecast_res = requests.get(url=url, params=params)

        weather_list = []

        try:
            i = 0
            list_forecast = forecast_res.json()
            for each in list_forecast['list']:
                if i == 8:
                    weather_res = {
                        "city": city,
                        "meteo": "",
                        "icon": "",
                        "temperatures": "",
                        "day": "",
                        "timestamp": 0
                    }
                    weather_res['meteo'] = each['weather'][0]['description']
                    weather_res['icon'] = each['weather'][0]['icon']
                    weather_res['temperatures'] = each['main']['temp']
                    weather_res['timestamp'] = each['dt']
                    weather_res['day'] = datetime.fromtimestamp(int(each['dt'])).strftime("%A")
                    weather_list.append(weather_res)
                    i = 0
                i = i + 1
        except:
            return returnMessage("Mauvaises informations", 601), 601

        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update({"city": city}, user['idToken'])
        return jsonify(weather_list), 200

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