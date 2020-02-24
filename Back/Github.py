from flask import *
import pyrebase
import secrets
from Database import db,user
from UsefulllFunctions import *
from Services import *
import requests as requette
import urllib.parse
from urllib.parse import parse_qs
from datetime import datetime



client_id = '3820d97bb3f1476707c9'
client_secret = '809fbed7f29694c0369322d3a4832278a831f902'

github_api = Blueprint('github', __name__)
@github_api.route('/githublogin', methods=["POST"])
def githublogin():
    url_token = 'https://github.com/login/oauth/access_token'
    url_user = 'https://api.github.com/user'
    try:
        code = request.get_json()['code']
    except:
        return returnMessage("Mauvaises informations envoyees", 601), 601

    params = {
        "client_id": client_id,
        "client_secret": client_secret,
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
        userData = {
            "email": "null",
            "name": user_info.json()['name'],
            "access_token": r.json()['access_token'],
            "github_id": user_info.json()['id'],
            "github_img": user_info.json()['avatar_url'],
            "role": "User",
            "type": "github",
            "google": {
                "activated": "false"
            },
            "facebook": {
                "activated": "false"
            },
            "github": {
                "activated": "true",
                "access_token": r.json()['access_token'],
                "github_id": user_info.json()['id'],
                "img": user_info.json()['avatar_url']
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
        return returnMessage("Mauvaises infos", 601), 601

    current_user = findUserByGithubId(user_info.json()['id'])
    if current_user is None:
        db.child('users').push(userData, user['idToken'])
    else:
        db.child('users').child(current_user.key()).update({'access_token': r.json()['access_token']}, user['idToken'])
        db.child('users').child(current_user.key()).child('github').update({'access_token': r.json()['access_token']}, user['idToken'])

    retUser = findUserByGithubId(user_info.json()['id'])
    retUs = db.child("users").child(retUser.key()).get(user['idToken'])
    return retUs.val()


@github_api.route('/repo_commits', methods=['POST','GET','PUT'])
def repo_commits():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            repo_url = request.get_json()['repo_url']
            parsed = urllib.parse.urlparse(repo_url)
            path = str(parsed.path).split('/')
            owner = path[1]
            repo = path[2]
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "repo_commits",
                "description": "Afficher les commits d'un repo choisis",
                "id": id,
                "params": {
                    "repo": repo,
                    "repo_owner": owner,
                    "repo_url": repo_url,
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

            github_access_token = current_user.val()['github']['access_token']
            repo = current_user.val()['user_widgets'][str(widget_id)]['params']['repo']
            owner = current_user.val()['user_widgets'][str(widget_id)]['params']['repo_owner']
            url = 'https://api.github.com/repos/' + owner + '/' + repo + '/commits'
        except:
            return returnMessage("bad", 601), 200

        head = {
            'Authorization': 'Bearer ' + github_access_token
        }

        data = requette.get(url, headers=head)

        JSON = {
            'name': repo,
            'commits': []
        }


        for each in data.json():
            if 'author' in each and each['author'] is not None:
                tmp = {
                    'author': each['commit']['author']['name'],
                    'message': each['commit']['message'],
                    'author_img': each['author']['avatar_url'],
                    'author_url': each['author']['html_url'],
                    'commit_url': each['html_url'],
                    'date': datetime.strptime(str(each['commit']['author']['date']).split('T')[0], '%Y-%m-%d').strftime("%d %B %Y")
                }
                JSON['commits'].append(tmp)
        return jsonify(JSON), 200
    elif request.method == 'PUT':
        try:
            refresh_time = request.get_json()['time']
            repo_url = request.get_json()['repo_url']
            parsed = urllib.parse.urlparse(repo_url)
            path = str(parsed.path).split('/')
            owner = path[1]
            repo = path[2]
            widget_id = request.get_json()['widget_id']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            "repo": repo,
            "repo_owner": owner,
            "repo_url": repo_url,
            "time": refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200


@github_api.route('/repo_issues', methods=['POST','GET','PUT'])
def repo_issues():
    if request.method == 'POST':
        try:
            refresh_time = request.get_json()['time']
            repo_url = request.get_json()['repo_url']
            parsed = urllib.parse.urlparse(repo_url)
            path = str(parsed.path).split('/')
            owner = path[1]
            repo = path[2]
            access_token = request.headers.get('Authorization')
            id = secrets.token_hex(5)
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        widget = {
            id: {
                "name": "repo_issues",
                "description": "Afficher les issues d'un repo choisis",
                "id": id,
                "params": {
                    "repo": repo,
                    "repo_owner": owner,
                    "repo_url": repo_url,
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

            github_access_token = current_user.val()['github']['access_token']
            repo = current_user.val()['user_widgets'][str(widget_id)]['params']['repo']
            owner = current_user.val()['user_widgets'][str(widget_id)]['params']['repo_owner']
            url = 'https://api.github.com/repos/' + owner + '/' + repo + '/issues'
        except:
            return returnMessage("bad", 601), 200

        head = {
            'Authorization': 'Bearer ' + github_access_token
        }

        params = {
            'state': 'all'
        }
        data = requette.get(url, headers=head, params=params)
        if data.status_code is not 200:
            return returnMessage('Github API error', 601), 601
        JSON = {
            'name': repo,
            'issues': []
        }
        for each in data.json():
            tmp = {
                'url': each['html_url'],
                'author': each['user']['login'],
                'author_img': each['user']['avatar_url'],
                'author_url': each['user']['html_url'],
                'title': each['title'],
                'state': str(each['state']).capitalize(),
                'body': each['body'],
                'comments': each['comments'],
                'date': datetime.strptime(str(each['created_at']).split('T')[0], '%Y-%m-%d').strftime("%d %B %Y")
            }
            JSON['issues'].append(tmp)
        return jsonify(JSON), 200
    elif request.method == 'PUT':
        try:
            refresh_time = request.get_json()['time']
            repo_url = request.get_json()['repo_url']
            parsed = urllib.parse.urlparse(repo_url)
            path = str(parsed.path).split('/')
            owner = path[1]
            repo = path[2]
            widget_id = request.get_json()['widget_id']
            access_token = request.headers.get('Authorization')
        except:
            return returnMessage("Mauvaises informations envoyees", 601), 601

        current_user = findUserByToken(access_token)
        if current_user is None:
            return returnMessage("Mauvais access_token", 601), 601

        update = {
            "repo": repo,
            "repo_owner": owner,
            "repo_url": repo_url,
            "time": refresh_time
        }
        db.child('users').child(current_user.key()).child('user_widgets').child(str(widget_id)).child('params').update(update, user['idToken'])
        return db.child('users').child(current_user.key()).child('user_widgets').get(user['idToken']).val(), 200
