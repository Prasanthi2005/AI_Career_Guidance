import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="prasanthi",
    database="ai_career_platform"
)

cursor = db.cursor()