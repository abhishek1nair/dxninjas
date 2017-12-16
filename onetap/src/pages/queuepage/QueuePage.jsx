import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CurrentToken from './CurrentToken.jsx';
import NextToken from './NextToken.jsx';
import RemainingToken from './RemainingToken.jsx';

import '../../QueuePage.css';

export default class QueuePage extends Component {
  render() {
    return (
      <div className='c-appointment__wrapper'>
        <Row>
          <Col span={2}/>
          <Col span={22}>
            <Row>
              <Col span={22}>
                <div className='c-appointment__title'>
                  Pranjal's Clinic
                </div>
                <div className='clearfix'>
                  <Col span={12}>
                    <CurrentToken/>
                  </Col>
                  <Col span={12}>
                    <NextToken/>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <RemainingToken/>
              </Col>
            </Row>
          </Col>
          <Col span={2}/>
        </Row>
      </div>
    );
  }
}
