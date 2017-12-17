import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Button, Row, Col, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import { recognize } from '../../utils/imageHandler';
import { getAppointment, patchAppointment } from '../../utils/api';

const { TextArea } = Input;

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
      loadingUserData: false,
      submitingUserData: false,
      submitted: false,
      appointmentData: null
    };
  }
  setRef(webcam) {
    this.webcam = webcam;
  }

  capture() {
    // pool and recognize
    console.log('polling...');
    this.setState({
      loadingUserData: true
    });
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
                appointmentData: appointmentRes.data,
                loadingUserData: false
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
            .catch((err) => {
              this.setState({
                loadingUserData: false
              });
              console.log(err);
            });
          console.log('found a familiar face');
        } else {
          this.setState({
            loadingUserData: false
          });
          console.log(' dont know this person');
        }
      });
  }

  finish() {
    const datetime = moment().format('YYYY-MM-DD HH:MM');
    this.setState({
      submitingUserData: true
    });
    return patchAppointment({
      patchData: { consultation_end: datetime },
      appointmentId: this.state.appointmentData.id
    })
    .then(() => {
      this.setState({
        appointmentData: null,
        submitingUserData: false,
        submitted: true
      });
    })
    .catch(() => {
      this.setState({
        submitingUserData: false
      });
    });
  }

  render() {
    console.log(this.state.appointmentData);
    const { appointmentData, loadingUserData, submitingUserData, submitted } = this.state;
    return (
      <div>
        <div
          className='c-appointment__title'
          style={{ textAlign: 'center', margin: '20px 0' }}>
          Patient Information Portal
        </div>
        <Webcam
          style={{
            position: 'fixed',
            left: '-10000px'
          }}
          audio={false}
          height={320}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={400}
        />
        <div
          style={{ textAlign: 'center', margin: '20px 0' }}>
          <Button style={{ marginTop: '20px' }} onClick={this.capture} loading={loadingUserData}>
            {loadingUserData ? 'Loading Patient Details' : 'Get Patient Details'}
          </Button>
        </div>
        {appointmentData === null && submitted &&
          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '16px' }}>
            Successfully submitted patient details.
          </div>
        }
        {appointmentData !== null &&
        <div>
          <div
            style={{ textAlign: 'center', margin: '20px 0', fontSize: '20px' }}>
            Patient Details
          </div>
          <Row>
            <Col span={8}></Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <div className="pd__title">Name</div>
                </Col>
                <Col span={12}>
                  {appointmentData.name}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className="pd__title">Contact</div>
                </Col>
                <Col span={12}>{appointmentData.contact}</Col>
              </Row>
              <Row>
                <Col span={12} className="pd__title">
                  <div className="pd__title">Self Diagnosis</div>
                </Col>
                <Col span={12}>{appointmentData.symptoms}</Col>
              </Row>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Row>
            <div
              style={{ textAlign: 'center', margin: '20px 0' }}>
              {!submitted && <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <TextArea
                    placeholder="Autosize height with minimum and maximum number of lines"
                    autosize={{ minRows: 2, maxRows: 6 }} />
                </Col>
                <Col span={8}></Col>
              </Row>}
              <Button
                style={{ marginTop: '20px' }}
                onClick={this.finish}
                loading={submitingUserData}>
                {submitingUserData ? 'Submitting Patient data' : 'Consultation Complete'}
              </Button>
            </div>
          </Row>
        </div>}
      </div>
    );
  }
}
