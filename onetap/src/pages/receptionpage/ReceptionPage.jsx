import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Button, Modal, Alert } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import { ThreeCircleLoader } from '../common/Loader.jsx';
import { recognize } from '../../utils/imageHandler';
import { getAppointment, patchAppointment } from '../../utils/api';

export default class ReceptionPage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.currentScreenshot = null;
    this.intervalId = null;
    this.setRef = this.setRef.bind(this);
    this.capture = this.capture.bind(this);
    this.startPolling = this.startPolling.bind(this);
    this.state = {
      screenshot: null,
      start: true,
      faceIds: [],
      polling: false,
      appointmentData: null
    };
  }
  setRef(webcam) {
    this.webcam = webcam;
  }

  startPolling() {
    this.setState({
      polling: true
    });
    this.capture();
  }

  capture() {
    // pool and recognize
    console.log('polling...');

    const image = this.webcam.getScreenshot();
    this.setState({
      screenshot: image
    });
    recognize({
      image
    })
    .then((res) => {
      if ('Errors' in res.data) {
        console.log(res.data);
        setTimeout(this.capture, 6 * 1000);
        return Promise.resolve();
      }
      const candidatesList = res.data.images.map(img => img.candidates);
      const flattenedList = [].concat(...candidatesList);
      const results = flattenedList.sort((x, y) => {
        return y.confidence - x.confidence;
      }).map(img => (img || { face_id: 0 }).face_id);
      console.log(flattenedList);

      const found = res.data.images.every(i => i.transaction.status === 'success');

      if (found) {
        // get appointment for faceIds
        getAppointment({ faceIds: results })
        .then((appointmentRes) => {
          const appointmentId = appointmentRes.data.id;

          if (!appointmentRes.data.checkin_time) {
            this.setState({
              appointmentData: appointmentRes.data
            });
          }
          return appointmentId;
        })
        .then((appointmentIdToPatch) => {
          const datetime = moment().format('YYYY-MM-DD HH:MM');
          return patchAppointment({
            patchData: { checkin_time: datetime },
            appointmentId: appointmentIdToPatch
          });
        })
        .then(() => {
          setTimeout(() => {
            this.setState({
              appointmentData: null
            });
          }, 20 * 1000);
        })
        .catch((err) => console.log(err));
        console.log('found a familiar face');
        setTimeout(this.capture, 6 * 1000);
      } else {
        console.log(' dont know this person');
        setTimeout(this.capture, 6 * 1000);
      }
    });
  }

  render() {
    console.log(this.state.polling);
    console.log(this.state.appointmentData);
    return (
      <div>
        <div
          className='c-appointment__title'
          style={{ textAlign: 'center', margin: '20px 0' }}>
          Book Appointment
        </div>
        <div style={{ textAlign: 'center' }}>
          <Webcam
            style={{
            }}
            audio={false}
            height={240}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={300}
          />
          <div>
            <Button
              style={{ marginTop: '20px' }}
              onClick={this.startPolling}>
                Start Reception Desk
            </Button>
          </div>
        </div>
        {this.state.polling && <div>
          <div style={{
            textAlign: 'center' }}>
          </div>
          {this.state.appointmentData === null &&
            <div style={{ textAlign: 'center', margin: '50px', fontSize: '18px' }}>
             <ThreeCircleLoader />
              <div style={{ height: '20px' }}></div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                Searching for next Appointment....
              </div>
            </div>
            }
            <div style={{ textAlign: 'center' }}>
              <span>
              {this.state.appointmentData !== null
                  ? <div style={{ margin: '40px 30%', textAlign: 'center' }}>
                    <Alert
                    message={`Hey ${this.state.appointmentData.name}, you can meet the doctor shortly, please wait for your turn.`}
                    type="success" showIcon /></div> :
                  <span style={{ fontSize: '16px' }}>Accepting next appointment, please look into the camera to continue.</span>}
              </span>
            </div>
          </div>}
      </div>
    );
  }
}
