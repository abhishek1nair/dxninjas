from flask import Flask
from flask_mysqldb import MySQL
import MySQLdb as mdb
from flask import Response
import json
from flask import jsonify
from flask import request
from flask_cors import CORS
import datetime
from datetime import timedelta

app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'face_recognition'
app.config['MYSQL_HOST'] = 'localhost'
mysql = MySQL(app)

# open cors for all
CORS(app)
# mysql.init_app(app)


@app.route('/dxhack/api/')
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


@app.route('/dxhack/api/user/<int:face_id>', methods=['GET'])
def get_user_details(face_id):
    cur = mysql.connection.cursor()
    # query = "SELECT * FROM user_profiles where id in (select user_id from user_face_id where face_id=%s)"
    # params = (face_id)
    cur.execute("SELECT * FROM user_profiles where id in (select user_id from user_face_id where face_id=%s);", (face_id,))
    data = dictfetchall(cur)

    return jsonify(data[0])


@app.route('/dxhack/api/user', methods=['POST'])
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


@app.route('/dxhack/api/appointment/<int:appointment_id>', methods=['PATCH'])
def update_appointment(appointment_id):
    db = mysql.connection
    cur = db.cursor()
    payload = request.get_json()
    query = ""
    params = None

    if 'checkin_time' in payload:
        query = "checkin_time=%s where checkin_time is null"
        params = (datetime.datetime.strptime(payload.get('checkin_time'), '%Y-%m-%d %H:%M'),)
    if 'consultation_start' in payload:
        query = "consultation_start=%s where consultation_start is null"
        params = (datetime.datetime.strptime(payload.get('consultation_start'), '%Y-%m-%d %H:%M'),)
    if 'consultation_end' in payload:
        query = "consultation_end=%s where consultation_end is null"
        params = (datetime.datetime.strptime(payload.get('consultation_end'), '%Y-%m-%d %H:%M'),)
    query = "UPDATE appointments SET " + query + " and id=%s"
    cur.execute(query, params + (appointment_id,))
    # print cur._last_executed
    db.commit()
    return 'Done'


@app.route('/dxhack/api/appointment', methods=['POST', 'GET'])
def create_appointment():
    db = mysql.connection
    cur = db.cursor()
    if request.method == 'POST':
        payload = request.get_json()
        appointment_time = payload.get('appointment_time')
        contact = payload.get('contact')
        symptoms = payload.get('symptoms')
        user = get_user_by_contact(contact)

        query = "INSERT into appointments (user_id, appointment_time, symptoms) VALUES(%s,%s,%s)"
        params = (user[0], appointment_time, symptoms)

        cur.execute(query, params)
        db.commit()

        return 'Done'
    elif request.method == 'GET':
        face_ids = request.args.getlist('face_ids')
        users = get_user_by_face(face_ids)
        now = datetime.datetime.now() + timedelta(minutes=330)
        ids_string = ','.join(("'" + str(x.get('id')) + "'") for x in users)
        query = "SELECT ap.appointment_time, ap.checkin_time, ap.id, ap.symptoms, u.name, u.contact from appointments as ap join user_profiles as u on ap.user_id=u.id where ap.consultation_end is null and user_id in ({user_ids}) and DATE(ap.appointment_time) = %s order by appointment_time".format(
            user_ids=ids_string)
        cur.execute(query, (now.strftime("%Y-%m-%d"),))
        # print cur._last_executed
        data = dictfetchall(cur)
        if data:
            result = data[0]
            result['appointment_time'] = result['appointment_time'].strftime("%Y-%d-%m %H:%M")
            result['checkin_time'] = result['checkin_time'].strftime(
                "%Y-%d-%m %H:%M") if result['checkin_time'] else None
            return jsonify(data[0])
        else:
            return Response(status=404)


@app.route('/dxhack/api/appointments', methods=['GET'])
def get_appointments():
    db = mysql.connection
    cur = db.cursor()
    now = datetime.datetime.now()
    results = {}
    params = (now.strftime("%Y-%m-%d"),)
    query = "SELECT AVG(TIMESTAMPDIFF(SECOND, consultation_start, consultation_end)) as diff from appointments where DATE(appointment_time)=%s and consultation_start is not null and consultation_end is not null"
    cur.execute(query, params)
    data = cur.fetchone()
    results['avg_consultation_time'] = int(data[0] / 60) if data[0] else 0
    query = "SELECT AVG(diff) from (SELECT TIMESTAMPDIFF(SECOND, appointment_time,checkin_time) as diff from appointments where DATE(appointment_time)=%s and checkin_time is not null) a where diff >0"
    cur.execute(query, params)
    data = cur.fetchone()
    results['avg_wait_time'] = int(data[0] / 60) if data[0] else 0
    query = "SELECT ap.appointment_time, ap.consultation_start, ap.id, u.name, u.contact from appointments as ap join user_profiles as u on ap.user_id=u.id where checkin_time is  not null and consultation_end is null and DATE(appointment_time)=%s order by appointment_time"
    cur.execute(query, params)

    data = dictfetchall(cur)
    json_data = []
    for x in data:
        obj = {}
        obj['id'] = x.get('id')
        obj['appointment_time'] = x.get('appointment_time').strftime("%Y-%m-%d %H:%M")
        obj['consultation_start'] = x.get('consultation_start').strftime(
            "%Y-%m-%d %H:%M") if x.get('consultation_start') else None
        obj['name'] = x.get('name')
        obj['contact'] = x.get('contact')
        json_data.append(obj)

    results['appointments'] = json_data

    return jsonify(results)


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
    face_param = ','.join(("'" + str(x) + "'") for x in face_ids)
    query = "SELECT * from user_profiles as u join user_face_id as uf on u.id=uf.user_id where face_id in ({face_param})".format(
        face_param=face_param)
    cur.execute(query)

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
