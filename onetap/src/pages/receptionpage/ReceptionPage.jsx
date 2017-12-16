import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Button, Modal } from 'antd';
import { ThreeCircleLoader } from '../common/Loader.jsx';
import { recognize } from '../../utils/imageHandler';
import { createUser } from '../../utils/api';

export default class ReceptionPage extends Component {
  constructor() {
    super();
    this.webcam = null;
    this.intervalId = null;
    this.setRef = this.setRef.bind(this);
    this.capture = this.capture.bind(this);
    this.startPolling = this.startPolling.bind(this);
    this.state = {
      screenshot: null,
      start: true,
      faceIds: [],
      polling: false
    };
  }
  setRef(webcam) {
    this.webcam = webcam;
  }

  startPolling() {
    this.setState({
      polling: true
    });
    setTimeout(this.capture, 10 * 1000);
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
        setTimeout(this.capture, 10 * 1000);
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
        this.setState({
          faceIds: results,
          polling: false
        });
        console.log('found a familiar face');
      } else {
        console.log(' dont know this person');
        setTimeout(this.capture, 10 * 1000);
      }
    });
  }

  render() {
    console.log(this.state.polling);
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
        <Button style={{ marginTop: '20px' }} onClick={this.startPolling}>Capture</Button>
        <Modal
          visible={this.state.polling}
          footer={null}
          closable={false}
        >
          <div style={{ textAlign: 'center', margin: '100px' }}>
            <ThreeCircleLoader />
          </div>
          Searching for next Appointment....
        </Modal>
      </div>
    );
  }
}
