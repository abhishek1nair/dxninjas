import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CurrentToken from './CurrentToken.jsx';
import NextToken from './NextToken.jsx';
import RemainingToken from './RemainingToken.jsx';

import '../../QueuePage.css';

export default class QueuePage extends Component {
  render() {
    return (
      <div className='c-queue__wrapper'>
        <Row>
          <Col span={2}/>
          <Col span={22}>
            <Row>
              <Col span={22}>
                <div className='c-queue__title'>
                  Dr. Pranjal Kumar
                </div>
                <div className='clearfix c-appointment__token__wrappers'>
                  <Col span={12}>
                    <div className='clearfix c-appointment__big-token__wrappers'>
                      <CurrentToken/>
                      <NextToken/>
                    </div>
                  </Col>
                  <Col span={12}>
                    <RemainingToken/>
                  </Col>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={2}/>
        </Row>
      </div>
    );
  }
}
