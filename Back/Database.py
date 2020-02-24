from flask import *
import pyrebase


config = {
  "apiKey": "AIzaSyAdf9iToVHMSjhFQPkkhkL8zeqc6iixgN4",
  "authDomain": "https://dashboard-tek3.firebaseapp.com",
  "databaseURL": "https://dashboard-tek3.firebaseio.com",
  "storageBucket": "dashboard-tek3.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()
auth = firebase.auth()
user = auth.sign_in_with_email_and_password("pierreti78@gmail.com", "dashboardtek3")
