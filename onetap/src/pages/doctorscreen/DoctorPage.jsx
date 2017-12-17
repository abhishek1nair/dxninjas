import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Button, Row, Col, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import { recognize } from '../../utils/imageHandler';
import { getAppointment, patchAppointment } from '../../utils/api';
import { ThreeCircleLoader } from '../common/Loader.jsx';

const { TextArea } = Input;

export default class DoctorPage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.intervalId = null;
    this.setRef = this.setRef.bind(this);
    this.capture = this.capture.bind(this);
    this.finish = this.finish.bind(this);
    this.startPolling = this.startPolling.bind(this);
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

  componentDidMount() {
    this.startPolling();
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  startPolling() {
    this.capture();
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
          setTimeout(this.capture, 6 * 1000);
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
      setTimeout(() => {
        window.location.reload();
      }, 2 * 1000);
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

        <div>
          <div style={{ textAlign: 'center' }}>
            <Webcam
              audio={false}
              height={240}
              ref={this.setRef}
              screenshotFormat="image/jpeg"
              width={300}
            />
          </div>
          <div
            style={{ textAlign: 'center', margin: '20px 0' }}>
            {/*
            <Button style={{ marginTop: '20px' }} onClick={this.startPolling} loading={loadingUserData}>
              {loadingUserData ? 'Loading Patient Details' : 'Get Patient Details'}
            </Button>
            */}
            {this.state.loadingUserData &&
              <div style={{ textAlign: 'center', margin: '50px', fontSize: '18px' }}>
                <ThreeCircleLoader />
                <div style={{ height: '20px' }}></div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  Searching for patient details....
                </div>
              </div>
            }
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
              <Col span={9}></Col>
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
              <Col span={7}></Col>
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
                  {submitingUserData ? 'Submitting Patient data' : 'Complete Consultation'}
                </Button>
              </div>
            </Row>
          </div>}
        </div>
      </div>
    );
  }
}
