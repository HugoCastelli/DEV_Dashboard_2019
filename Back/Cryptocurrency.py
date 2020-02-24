from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *
from money import Money

crypto_api = Blueprint('crypto', __name__)
api_token = 'ef2693b0-9538-4c5b-97a1-1a5b4a2e43c5'
base_url = 'https://pro-api.coinmarketcap.com/'


@crypto_api.route('/crypto_actual_value', methods=['POST', 'GET', 'PUT'])
def crypto_actual_value():
    if request.method == 'POST':
        try:
            crypto_currency = request.get_json()['crypto']
            currency = request.get_json()['currency']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "crypto_actual_value",
                "description": "Afficher les la valeur d'une cryptomonaie choisie dans la monaie choisie",
                "id": id,
                "params": {
                    "crypto_currency": crypto_currency,
                    "currency": currency,
                    "time": float(refresh_time)
                },
                "position": {
                    "cols": 1,
                    "rows": 2,
                    "y": 0,
                    "x": 0
                }
            }
        }
        db.child('users').child(current_user.key()).child('user_widgets').update(widget, user['idToken'])
        return widget, 200
    elif request.method == 'GET':
        url = base_url + '/v1/tools/price-conversion'
        try:
            widget_id = request.args.get('widget_id')
            access_token = request.headers.get('Authorization')
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
            crypto_currency = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['crypto_currency']
            currency = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['currency']
        except:
            return returnMessage("bad", 601), 200


        headers = {
            'Accept': 'application/json',
            'X-CMC_PRO_API_KEY': api_token
        }
        params = {
            'symbol': crypto_currency,
            'amount': 1,
            'convert': currency
        }
        data = requests.get(url, headers=headers, params=params)
        values = {
            "name": data.json()['data']['name'],
            'cryptocurrency': crypto_currency,
            'currency': currency,
            'price': Money(data.json()['data']['quote'][str(currency)]['price'], currency).format('en_US')[1:],
        }
        return values, 200
    elif request.method == 'PUT':
        try:
            crypto_currency = request.get_json()['crypto_currency']
            currency = request.get_json()['currency']
            refresh_time = request.get_json()['time']
            widget_id = request.get_json()['widget_id']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'crypto_currency': crypto_currency,
            'currency': currency,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


@crypto_api.route('/crypto_actual_worth', methods=['POST', 'GET', 'PUT'])
def crypto_actual_worth():
    if request.method == 'POST':
        try:
            crypto_currency = request.get_json()['crypto']
            currency = request.get_json()['currency']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "crypto_actual_worth",
                "description": "Afficher la capitalisation d'une cryptomonnaie choisie dans la monnaie choisie",
                "id": id,
                "params": {
                    "crypto_currency": crypto_currency,
                    "currency": currency,
                    "time": refresh_time
                },
                "position": {
                    "cols": 3,
                    "rows": 1,
                    "y": 0,
                    "x": 0
                }
            }
        }
        db.child('users').child(current_user.key()).child('user_widgets').update(widget, user['idToken'])
        return widget, 200
    elif request.method == 'GET':
        url = base_url + '/v1/cryptocurrency/quotes/latest'
        try:
            widget_id = request.args.get('widget_id')
            access_token = request.headers.get('Authorization')
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
            crypto_currency = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['crypto_currency']
            currency = db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').get(user['idToken']).val()['currency']
        except:
            return returnMessage("bad", 601), 200

        headers = {
            'Accept': 'application/json',
            'X-CMC_PRO_API_KEY': api_token
        }
        params = {
            'symbol': crypto_currency,
            'convert': currency
        }
        data = requests.get(url, headers=headers, params=params)
        values = {
            "name": data.json()['data'][str(crypto_currency)]['name'],
            'cryptocurrency': crypto_currency,
            'currency': currency,
            'worth': Money(data.json()['data'][str(crypto_currency)]['quote'][str(currency)]['market_cap'], currency).format('en_US')[1:]
        }
        return values, 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            crypto_currency = request.get_json()['crypto_currency']
            currency = request.get_json()['currency']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'crypto_currency': crypto_currency,
            'currency': currency,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200