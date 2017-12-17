import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Button, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import { ThreeCircleLoader } from '../common/Loader.jsx';
import { recognize } from '../../utils/imageHandler';
import { getAppointment, patchAppointment } from '../../utils/api';

export default class DoctorPage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.intervalId = null;
    this.setRef = this.setRef.bind(this);
    this.capture = this.capture.bind(this);
    this.finish = this.finish.bind(this);
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

  capture() {
    // pool and recognize
    console.log('polling...');
    const image = this.webcam.getScreenshot();
    recognize({
      image
    })
      .then((res) => {
        if ('Errors' in res.data) {
          console.log(res.data);
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

              // if (!appointmentRes.data.checkin_time) {
              this.setState({
                appointmentData: appointmentRes.data
              });
              // }
              return appointmentId;
            })
            .then((appointmentIdToPatch) => {
              const datetime = moment().format('YYYY-MM-DD HH:MM');
              return patchAppointment({
                patchData: { consultation_start: datetime },
                appointmentId: appointmentIdToPatch
              });
            })
            .catch((err) => console.log(err));
          console.log('found a familiar face');
        } else {
          console.log(' dont know this person');
        }
      });
  }

  finish() {
    const datetime = moment().format('YYYY-MM-DD HH:MM');
    return patchAppointment({
      patchData: { consultation_end: datetime },
      appointmentId: this.state.appointmentData.id
    });
  }

  render() {
    console.log(this.state.polling);
    console.log(this.state.appointmentData);
    return (
      <div>
        <Webcam
          style={{
            // position: 'fixed',
            left: '-10000px'
          }}
          audio={false}
          height={320}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={400}
        />
        <Button style={{ marginTop: '20px' }} onClick={this.capture}>Capture</Button>
        {this.state.appointmentData !== null &&
        <div>
          <div>Details of Patients:</div>
          <div>{this.state.appointmentData.name}</div>
          <div>{this.state.appointmentData.contact}</div>
          <Button style={{ marginTop: '20px' }} onClick={this.finish}>Consultation Complete</Button>
      </div>}
      </div>
    );
  }
}
