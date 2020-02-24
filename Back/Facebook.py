from flask import *
import pyrebase
import secrets
from Database import db,user
from UsefulllFunctions import *
from Services import *

facebooke_api = Blueprint('facebook', __name__)

#Facebook register
@facebooke_api.route('/facebookregister', methods=['POST'])
def facebookregister():
    try:
        userData = {
            "name": request.get_json()['name'],
            "access_token": request.get_json()['access_token'],
            "profile_img": request.get_json()['image'],
            "fb_user_id": request.get_json()['user_id'],
            "email": request.get_json()['email'],
            "role": "User",
            "type": "facebook",
            "facebook": {
                "name": request.get_json()['name'],
                "access_token": request.get_json()['access_token'],
                "img": request.get_json()['image'],
                "fb_user_id": request.get_json()['user_id'],
                "email": request.get_json()['email'],
                "activated": "true"
            },
            "google": {
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
            if 'user_id' in users.val() and users.val()['user_id'] == userData['fb_user_id']:
                return returnMessage("Le compte existe deja", 600), 600
    db.child("users").push(userData, user['idToken'])
    return userData, 200


@facebooke_api.route('/facebooklogin', methods=['POST'])
def facebooklogin():
    try:
        user_id = request.get_json()['user_id']
        access_token = request.get_json()['access_token']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    current_user = findUserByFacebookId(user_id)
    if current_user is not None:
        db.child("users").child(current_user.key()).update({'access_token': access_token}, user['idToken'])
        db.child("users").child(current_user.key()).child('facebook').update({'access_token': access_token}, user['idToken'])
    else:
        return returnMessage("Le compte n'existe pas", 603), 603
    current_user = findUserByFacebookId(user_id)
    return current_user.val()


@facebooke_api.route('/addfacebook', methods=['POST'])
def addfacebook():
    try:
        name = request.get_json()['name']
        fb_access_token = request.get_json()['fb_access_token']
        profile_img = request.get_json()['image']
        fb_user_id = request.get_json()['user_id']
        email = request.get_json()['email']
        access_token = request.headers.get('access_token')
    except:
        return returnMessage("Mauvaises donnees envoyees", 601), 601

    current_user = findUserByToken(access_token)
    if current_user is None:
        return returnMessage("Mauvais access_token", 601), 601
    if current_user.val()['facebook']['activated'] == "true":
        return returnMessage("Deja active", 601), 601

    fb_data = {
        "name": name,
        "access_token": fb_access_token,
        "img": profile_img,
        "fb_user_id": fb_user_id,
        "email": email,
        "activated": "true"
    }

    db.child("users").child(current_user.key()).child('facebook').update(fb_data, user['idToken'])
    current_user = findUserByToken(access_token)
    return current_user, 200

