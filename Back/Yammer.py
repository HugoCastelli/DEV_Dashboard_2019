from flask import *
import secrets
from Database import db, user
from UsefulllFunctions import *
from Services import *
import requests
from datetime import *
import urllib.parse
from urllib.parse import parse_qs

yammer_api = Blueprint('yammer', __name__)
@yammer_api.route('/group_messages', methods=['POST', 'GET', 'PUT'])
def group_messages():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            group_url = request.get_json()['group_url']
            parsed = urllib.parse.urlparse(group_url.replace('#/', ''))
            group_id = parse_qs(parsed.query)['feedId']

            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "group_messages",
                "description": "Afficher les message d'un groupe yammer",
                "id": id,
                "params": {
                    "group_id": int(group_id[0]),
                    "group_url": group_url,
                    "time": refresh_time
                },
                "position": {
                    "cols": 3,
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

            yammer_access = current_user.val()['yammer']['access_token']
            group_id = current_user.val()['user_widgets'][str(widget_id)]['params']['group_id']
            url = 'https://www.yammer.com/api/v1/messages/in_group/' + str(group_id) + '.json'
        except:
            return returnMessage("bad", 601), 200

        head = {
            'Authorization': 'Bearer ' + yammer_access
        }

        params = {
            'limit': 8,
            'threaded': 'true'
        }

        data = requests.get(url, headers=head, params=params)

        JSON = {
            'messages': [],
            'group_name': data.json()['meta']['feed_name']
        }

        for each in data.json()['messages']:
            if each['replied_to_id'] is None and len(each['attachments']) == 0:
                tmp = {
                    'id': each['id'],
                    'title': each['title'] if 'title' in each else '',
                    'url': each['web_url'],
                    'message': each['body']['rich'],
                    'sender_name': yammerGetUserById(each['sender_id'], yammer_access)['name'] if 'name' in yammerGetUserById(each['sender_id'], yammer_access) else 'X',
                    'image': yammerGetUserById(each['sender_id'], yammer_access)['image'] if 'image' in yammerGetUserById(each['sender_id'], yammer_access) else 'X',
                    'likes': each['liked_by']['count']
                }
                JSON['messages'].append(tmp)
        return jsonify(JSON), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            refresh_time = request.get_json()['time']
            group_url = request.get_json()['group_url']

            parsed = urllib.parse.urlparse(group_url.replace('#/', ''))
            group_id = parse_qs(parsed.query)['feedId']

            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'group_id': int(group_id[0]),
            'group_url': group_url,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


@yammer_api.route('/thread_messages', methods=['POST', 'GET', 'PUT'])
def thread_messages():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            thread_url = request.get_json()['thread_url']

            parsed = urllib.parse.urlparse(thread_url)
            thread_id = str(parsed.path).split('/')[3]

            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "thread_messages",
                "description": "Afficher les message d'un thread yammer",
                "id": id,
                "params": {
                    "thread_id": int(thread_id),
                    "thread_url": thread_url,
                    "time": refresh_time
                },
                "position": {
                    "cols": 3,
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

            yammer_access = current_user.val()['yammer']['access_token']
            thread_id = current_user.val()['user_widgets'][str(widget_id)]['params']['thread_id']
            url = 'https://www.yammer.com/api/v1/messages/in_thread/' + str(thread_id) + '.json'
        except:
            return returnMessage("bad", 601), 200

        head = {
            'Authorization': 'Bearer ' + yammer_access
        }

        data = requests.get(url, headers=head)

        JSON = {
            'msg': {
                'sender_name': "",
                'title': "",
                'message': "",
                'id': "",
                'url': "",
                'likes': "",
                'image': ""
            },
            'comments': []
        }

        for each in data.json()['messages']:
            if each['replied_to_id'] is None:
                JSON['msg']['title'] = each['title'] if 'title' in each else ''
                JSON['msg']['message'] = each['body']['rich']
                JSON['msg']['id'] = each['id']
                JSON['msg']['url'] = each['web_url']
                JSON['msg']['likes'] = str(each['liked_by']['count'])
                JSON['msg']['sender_name'] = yammerGetUserById(each['sender_id'], yammer_access)['name'] if 'name' in yammerGetUserById(each['sender_id'], yammer_access) else 'X',
                JSON['msg']['image'] = yammerGetUserById(each['sender_id'], yammer_access)['image'] if 'image' in yammerGetUserById(each['sender_id'], yammer_access) else 'X'
            elif each['replied_to_id'] is not None:
                comment = {
                    'sender_name': "",
                    'message': "",
                    'id': "",
                    'url': "",
                    'likes': "",
                    'image': ""
                }
                comment['message'] = each['body']['rich']
                comment['id'] = each['id']
                comment['url'] = each['web_url']
                comment['likes'] = str(each['liked_by']['count'])
                comment['sender_name'] = yammerGetUserById(each['sender_id'], yammer_access)['name'],
                comment['image'] = yammerGetUserById(each['sender_id'], yammer_access)['image']
                JSON['comments'].append(comment)
        return jsonify(JSON), 200
    elif request.method == 'PUT':
        try:
            widget_id = request.get_json()['widget_id']
            refresh_time = request.get_json()['time']
            thread_url = request.get_json()['thread_url']
            parsed = urllib.parse.urlparse(thread_url)
            thread_id = str(parsed.path).split('/')[3]

            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            'thread_id': int(thread_id),
            'thread_url': thread_url,
            'time': refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


def yammerGetUserById(id, access_token):
    head = {'Authorization': 'Bearer ' + access_token}
    data = requests.get(url='https://www.yammer.com/api/v1/users/' + str(id) + '.json', headers=head)
    infos = {
        'name': data.json()['full_name'] if 'full_name' in data.json() else 'X',
        'image': data.json()['mugshot_url']
    }
    return infos