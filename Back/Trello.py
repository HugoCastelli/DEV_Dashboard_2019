from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *

trello_api = Blueprint('trello', __name__)
trello_api_key = 'f4319a3120463a49dfe493eefb21db51'


@trello_api.route('/get_boards', methods=['GET'])
def get_boards():
    try:
        access_token = request.headers.get('Authorization')
        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
        trello_access_token = db.child('users').child(current_user.key()).child('trello').get(user['idToken']).val()['access_token']
        trello_user_id = db.child('users').child(current_user.key()).child('trello').get(user['idToken']).val()['user_id']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    url = 'https://api.trello.com/1/members/' + trello_user_id + '/boards?key=' + trello_api_key + '&token=' + trello_access_token

    boards = requests.get(url)
    if boards.status_code is not 200:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    JSON = []

    for each in boards.json():
        tmp = {
            'name': each['name'],
            'id': each['id']
        }
        JSON.append(tmp)

    return jsonify(JSON)


@trello_api.route('/get_boards_member', methods=['POST'])
def get_boards_member():
    try:
        access_token = request.headers.get('Authorization')
        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvaises informations envoyees", 601), 601
        trello_access_token = db.child('users').child(current_user.key()).child('trello').get(user['idToken']).val()['access_token']
        trello_user_id = db.child('users').child(current_user.key()).child('trello').get(user['idToken']).val()['user_id']
        board_id = request.get_json()['board_id']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    param = {
        'token': trello_access_token,
        'cards': 'all',
        'key': trello_api_key
    }

    url = 'https://api.trello.com/1/boards/' + board_id + '/members'

    members = requests.get(url, params=param)
    if members.status_code is not 200:
        return returnMessage("Probleme Trello API", 601), 601

    JSON = []

    for each in members.json():
        tmp = {
            'name': each['fullName'],
            'id': each['id']
        }
        JSON.append(tmp)

    return jsonify(JSON)


@trello_api.route('/trello_board', methods=['POST','GET','PUT'])
def trello_board():
    if request.method == 'POST':
        try:
            board_id = request.get_json()['board_id']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601


        widget = {
            id: {
                "name": "trello_board",
                "description": "Afficher un tableau trello choisis",
                "id": id,
                "params": {
                    "board_id": board_id,
                    "time": refresh_time
                },
                "position": {
                    "cols": 8,
                    "rows": 3,
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

            trello_access_token = current_user.val()['trello']['access_token']
            board_id = current_user.val()['user_widgets'][str(widget_id)]['params']['board_id']
            board_url = 'https://api.trello.com/1/boards/' + board_id + '?key=' + trello_api_key + '&token=' + trello_access_token + '&cards=all'
            url = 'https://api.trello.com/1/boards/' + board_id + '/lists?key=' + trello_api_key + '&token=' + trello_access_token + '&cards=all'
        except:
            return returnMessage("bad", 601), 200

        board_data = requests.get(board_url)
        data = requests.get(url)
        if data.status_code is not 200 or board_data.status_code is not 200:
            return returnMessage('Trello API error', 601), 601

        ret = {
            'board_name': board_data.json()['name'],
            'lists': []
        }
        list = []

        for each in data.json():
            tmp = {
                'list_name': each['name'],
                'cards': []
            }
            for eachlist in each['cards']:
                if eachlist['closed'] == False:
                    tmpList = {
                        'card_name': eachlist['name'],
                        'id': eachlist['id'],
                        'tags': eachlist['labels'][0]['color'] if len(eachlist['labels']) > 0 else 'none'
                    }
                    tmp['cards'].append(tmpList)
            ret['lists'].append(tmp)

        return jsonify(ret), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            board_id = request.get_json()['board_id']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        update = {
            "board_id": board_id,
            "time": refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


@trello_api.route('/trello_member_tasks', methods=['POST', 'GET', 'PUT'])
def trello_member_tasks():
    if request.method == 'POST':
        try:
            board_id = request.get_json()['board_id']
            member_id = request.get_json()['member_id']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601


        widget = {
            id: {
                "name": "trello_member_tasks",
                "description": "Afficher les taches d'un membre choisis dans un tableau choisis",
                "id": id,
                "params": {
                    "board_id": board_id,
                    "member_id": member_id,
                    "time": refresh_time
                },
                "position": {
                    "cols": 2,
                    "rows": 4,
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

            trello_access_token = current_user.val()['trello']['access_token']
            board_id = current_user.val()['user_widgets'][str(widget_id)]['params']['board_id']
            member_id = current_user.val()['user_widgets'][str(widget_id)]['params']['member_id']
            board_url = 'https://api.trello.com/1/boards/' + board_id + '?key=' + trello_api_key + '&token=' + trello_access_token + '&cards=all'
            member_url = 'https://api.trello.com/1/member/' + member_id + '?key=' + trello_api_key + '&token=' + trello_access_token + '&cards=all'
            url = 'https://api.trello.com/1/boards/' + board_id + '/lists?key=' + trello_api_key + '&token=' + trello_access_token + '&cards=all'
        except:
            return returnMessage("bad", 601), 200

        data = requests.get(url)
        member_data = requests.get(member_url)
        board_data = requests.get(board_url)
        if data.status_code is not 200 and data.status_code is not 200 and board_data.status_code is not 200:
            return returnMessage('Trello API error', 601), 601

        JSON = {
            'board_name': board_data.json()['name'],
            'name': member_data.json()['fullName'],
            'list': []
        }

        for each in data.json():
            for eachcards in each['cards']:
                if len(eachcards['idMembers']) > 0 and eachcards['closed'] is False:
                    for eachMembers in eachcards['idMembers']:
                        if eachMembers == member_id:
                            tmpCard = {
                                'id': eachcards['id'],
                                'name': eachcards['name'],
                                'tags': eachcards['labels'][0]['color'] if len(eachcards['labels']) > 0 else 'none'
                            }
                            JSON['list'].append(tmpCard)

        return jsonify(JSON), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            board_id = request.get_json()['board_id']
            member_id = request.get_json()['member_id']
            refresh_time = request.get_json()['time']
            access_token = request.headers.get('Authorization')
            current_user = findUserByToken(access_token)
            if current_user is None:
                return returnMessage("Mauvais access_token", 601), 601
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        update = {
            "board_id": board_id,
            "member_id": member_id,
            "time": refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


