import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import Webcam from 'react-webcam';
import WrappedRegistrationForm from './WrappedRegistrationForm.jsx';
import { recognize } from '../../utils/imageHandler';
import '../../AppointmentPage.css';

export default class AppointmentPage extends Component {

  constructor() {
    super();
    this.capture = this.capture.bind(this);
    this.state = {
      screenshot: null,
      name: null,
      contact: null,
      email: null
    };
  }

  capture() {
    const screenshot = this.iWebcam.getScreenshot();
    this.setState({ screenshot });
  }

  render() {
    return (
      <div className='c-appointment__wrapper'>
        <Row>
          <Col span={6} />
          <Col span={12}>
            <div className='c-appointment__title' style={{ textAlign: 'center' }}>
              Book Appointment
            </div>
            <WrappedRegistrationForm/>
          </Col>
          <Col span={6} />
        </Row>
      </div>
    );
  }
}
