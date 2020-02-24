from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests as requette
from datetime import *
import locale

services_api = Blueprint('services', __name__)
github_client_id = '3820d97bb3f1476707c9'
github_client_secret = '809fbed7f29694c0369322d3a4832278a831f902'
trello_api_key = 'f4319a3120463a49dfe493eefb21db51'

@services_api.route('/activate_intra', methods=['POST'])
def activate_intra():
    try:
        autologin = (request.get_json()['autologin'])[25:]
        access_token = request.headers.get('Authorization')
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601

    activation = {
        "activated": "true",
        "autologin": autologin
    }

    db.child("users").child(current_user.key()).child('intra').update(activation, user['idToken'])
    return list_services(current_user), 200


@services_api.route('/activate_google', methods=['POST'])
def activate_google():
    try:
        activation = {
            "name": request.get_json()['name'],
            "access_token": request.get_json()['access_token'],
            "id_token": request.get_json()['id_token'],
            "img": request.get_json()['image'],
            "google_user_id": request.get_json()['user_id'],
            "activated": "true"
        }
        access_token = request.headers.get('Authorization')
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601

    db.child("users").child(current_user.key()).child('google').update(activation, user['idToken'])
    return list_services(current_user), 200


@services_api.route('/activate_github', methods=['POST'])
def activate_github():
    url_token = 'https://github.com/login/oauth/access_token'
    url_user = 'https://api.github.com/user'
    try:
        code = request.get_json()['code']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    params = {
        "client_id": github_client_id,
        "client_secret": github_client_secret,
        "code": code
    }
    headers = {
        "Accept": "application/json"
    }

    r = requette.post(url=url_token, headers=headers, params=params)
    if r.status_code is not 200:
        return returnMessage("Bad code", 601)

    headers_user = {
        "Authorization": "Bearer " + r.json()['access_token']
    }
    user_info = requette.get(url=url_user, headers=headers_user)
    if user_info.status_code is not 200:
        return returnMessage("Bad access_token", 601), 601
    try:
        activation = {
            "activated": "true",
            "access_token": r.json()['access_token'],
            "github_id": user_info.json()['id'],
            "img": user_info.json()['avatar_url']
        }
        access_token = request.headers.get('Authorization')
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601

    db.child("users").child(current_user.key()).child('github').update(activation, user['idToken'])
    return list_services(current_user), 200


@services_api.route('/activate_yammer', methods=['POST'])
def activate_yammer():
    try:
        yammer_code = request.get_json()['code']
        access_token = request.headers.get('Authorization')
        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    params = {
        'client_id': 'LHqOYz3vFN6mwvQas20rhQ',
        'client_secret': 'oXX2A7u3QJk456ukmPIrTM7ZR8grQBHUUiejOhL610',
        'code': yammer_code
    }

    access_request = requette.get('https://www.yammer.com/oauth2/access_token.json', params=params)

    JSON = {
        'access_token': access_request.json()['access_token']['token'],
        'name': access_request.json()['user']['name'],
        'url': access_request.json()['user']['url'],
        'img': access_request.json()['user']['mugshot_url'],
        'activated': 'true'
    }

    db.child('users').child(current_user.key()).child('yammer').update(JSON, user['idToken'])
    return list_services(current_user)



@services_api.route('/activate_trello', methods=['POST'])
def activate_trello():
    try:
        trello_code = request.get_json()['code']
        access_token = request.headers.get('Authorization')
        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    url = 'https://api.trello.com/1/tokens/' + trello_code + '?token=' + trello_code + '&key=' + trello_api_key

    access_request = requette.get(url)

    if access_request.status_code is not 200:
        print(access_request.status_code)


    JSON = {
        'access_token': trello_code,
        'user_id': access_request.json()['idMember'],
        'activated': 'true'
    }

    db.child('users').child(current_user.key()).child('trello').update(JSON, user['idToken'])
    return list_services(current_user)


def list_services(current_user):
    ret = {
        "google": db.child("users").child(current_user.key()).child('google').get(user['idToken']).val(),
        "intra": db.child("users").child(current_user.key()).child('intra').get(user['idToken']).val(),
        "facebook": db.child("users").child(current_user.key()).child('facebook').get(user['idToken']).val(),
        "github": db.child("users").child(current_user.key()).child('github').get(user['idToken']).val(),
        "yammer": db.child("users").child(current_user.key()).child('yammer').get(user['idToken']).val(),
        "trello": db.child("users").child(current_user.key()).child('trello').get(user['idToken']).val()
    }
    return ret