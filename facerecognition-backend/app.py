from flask import Flask
from flask_mysqldb import MySQL
import MySQLdb as mdb
from flask import Response
import json
from flask import jsonify
from flask import request
from flask_cors import CORS

app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'face_recognition'
app.config['MYSQL_HOST'] = 'localhost'
mysql = MySQL(app)

# open cors for all
CORS(app)
# mysql.init_app(app)


@app.route('/')
def create_tables():
    cur = mysql.connection.cursor()
    query = "CREATE TABLE user_profiles (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(40), email_id VARCHAR(100), contact VARCHAR(15), UNIQUE KEY (email_id), UNIQUE KEY (contact));"
    cur.execute(query)
    query = "CREATE TABLE user_face_id (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id INT, face_id VARCHAR(100), CONSTRAINT fk_user_face FOREIGN KEY (user_id) references user_profiles(id));"
    cur.execute(query)
    query = "CREATE TABLE appointments (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id INT, appointment_time DATETIME, problem TEXT, CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) references user_profiles(id))"
    cur.execute(query)
    cur.close()

    return "Hello World!"


@app.route('/user/<int:face_id>', methods=['GET'])
def get_user_details(face_id):
    cur = mysql.connection.cursor()
    # query = "SELECT * FROM user_profiles where id in (select user_id from user_face_id where face_id=%s)"
    # params = (face_id)
    cur.execute("SELECT * FROM user_profiles where id in (select user_id from user_face_id where face_id=%s);", (face_id,))
    data = dictfetchall(cur)

    return jsonify(data[0])

    return resp


@app.route('/user', methods=['POST'])
def create_user():
    payload = request.get_json()
    name = payload.get('name')
    contact = payload.get('contact')
    email_id = payload.get('email_id')
    face_id = payload.get('face_id')
    db = mysql.connection
    cur = db.cursor()
    query = "INSERT into user_profiles (name,contact,email_id) VALUES(%s,%s,%s)"
    params = (name, contact, email_id)
    cur.execute(query, params)
    db.commit()
    query = "INSERT into user_face_id (user_id,face_id) VALUES(%s,%s)"
    params = (cur.lastrowid, face_id)
    cur.execute(query, params)
    db.commit()

    return 'Done'


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

if __name__ == '__main__':
    app.run(host='10.0.1.2', debug=True)
