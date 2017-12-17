import React, { Component } from 'react';
import { Row, Col } from 'antd';
import './Header.css';

export default class Header extends Component {
  render() {
    return (
      <div className='clearfix c-header__wrapper'>
        <Row>
          <Col span={2}/>
          <Col span={22}>
            <Row>
              <Col span={22}>
                <div className='c-header__clinic__title'>
                  Dalmia Clinic
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
