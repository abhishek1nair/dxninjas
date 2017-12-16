import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import Webcam from 'react-webcam';
import WrappedRegistrationForm from './WrappedRegistrationForm.jsx';

import '../../AppointmentPage.css';

export default class AppointmentPage extends Component {

  constructor() {
    super();
    this.capture = this.capture.bind(this);
    this.state = {
      screenshot: null
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
          <Col span={2}/>
          <Col span={20}>
            <div className='c-appointment__title'>
              Book Appointment
            </div>
            <div>
              <Col span={10}>
                <Webcam
                  audio={false}
                  height={320}
                  ref={(f) => { this.iWebcam = f; } }
                  screenshotFormat="image/jpeg"
                  width={400}
                />
                <Button style={{ marginBottom: '20px' }} onClick={this.capture} type="primary">Capture</Button>
                {this.state.screenshot ? <img alt='captured' src={this.state.screenshot} /> : null}
              </Col>
              <Col span={10}>
                <WrappedRegistrationForm/>
              </Col>
            </div>
          </Col>
          <Col span={2}/>
        </Row>
      </div>
    );
  }
}
