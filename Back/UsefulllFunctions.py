from Database import *
import pyrebase

def returnMessage(message, code):
    return {
        "message": message,
        "code": code
    }

def findUserByToken(access_token):
    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for each in all_users.each():
            if each.val()['access_token'] == access_token:
                return each
    return None


def findUserByGithubId(github_id):
    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for each in all_users.each():
            if 'github_id' in each.val():
                if each.val()['github_id'] == github_id:
                    return each
    return None


def findUserByFacebookId(fb_user_id):
    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for each in all_users.each():
            if 'fb_user_id' in each.val():
                if each.val()['fb_user_id'] == fb_user_id:
                    return each
    return None


def findUserByGoogleId(google_user_id):
    all_users = db.child("users").get(user['idToken'])
    if all_users.val() is not None:
        for each in all_users.each():
            if 'google_user_id' in each.val():
                if each.val()['google_user_id'] == google_user_id:
                    return each
    return None