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
    query = "CREATE TABLE appointments (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id INT, appointment_time DATETIME, symptoms TEXT, checkin_time DATETIME, consultation_start DATETIME, consultation_end DATETIME, CONSTRAINT fk_appointment_user FOREIGN KEY (user_id) references user_profiles(id))"
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


@app.route('/appointment/<int:appointment_id>', methods=['PATCH'])
def update_appointment(appointment_id):
    db = mysql.connection
    cur = db.cursor()
    payload = request.get_json()
    appointment_id = payload.get('appointment_id')
    query = ""
    params = None
    print payload
    print hasattr(payload, 'checkin_time')
    if 'checkin_time' in payload:
        query += "checkin_time=%s"
        params = (payload.get('checkin_time'),)
    if 'consultation_start' in payload:
        if query:
            query += query + ", "
        query += "consultation_start=%s"
        params = (params + (payload.get('consultation_start'),)) if params else (payload.get('consultation_start'),)
    if 'consultation_end' in payload:
        if query:
            query += query + ", "
        query = "consultation_end=%s"
        params = (params + (payload.get('consultation_end'),)) if params else (payload.get('consultation_end'),)
    query = "UPDATE appointments SET " + query + " where id=%s"
    cur.execute(query, params + (appointment_id,))
    db.commit()
    return 'Done'


@app.route('/appointment', methods=['POST', 'GET'])
def create_appointment():
    db = mysql.connection
    cur = db.cursor()
    if request.method == 'POST':
        payload = request.get_json()
        appointment_time = payload.get('appointment_time')
        contact = payload.get('contact')
        symptoms = payload.get('symptoms')
        user = get_user_by_contact(contact)
        print user
        query = "INSERT into appointments (user_id, appointment_time, symptoms) VALUES(%s,%s,%s)"
        params = (user[0], appointment_time, symptoms)

        cur.execute(query, params)
        db.commit()

        return 'Done'
    elif request.method == 'GET':
        print request.args
        face_ids = request.args.getlist('face_ids')
        users = get_user_by_face(face_ids)
        ids_string = ''.join(str(x.get('id')) for x in users)
        query = "SELECT * from appointments where user_id in (%s) order by appointment_time"
        cur.execute(query, (ids_string,))
        data = dictfetchall(cur)

        return jsonify(data[0])


def get_user_by_contact(contact):
    db = mysql.connection
    cur = db.cursor()
    query = "SELECT * from user_profiles where contact=%s"
    cur.execute(query, (contact,))

    user = cur.fetchone()

    return user


def get_user_by_face(face_ids):
    db = mysql.connection
    cur = db.cursor()
    query = "SELECT * from user_profiles as u join user_face_id as uf on u.id=uf.user_id where face_id in (%s)"
    face_param = ''.join(str(x) for x in face_ids)
    params = (face_param,)
    cur.execute(query, params)

    return dictfetchall(cur)


def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

if __name__ == '__main__':
    app.run(host='10.0.1.2', debug=True)
