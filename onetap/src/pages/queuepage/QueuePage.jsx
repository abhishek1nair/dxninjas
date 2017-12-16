import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CurrentToken from './CurrentToken.jsx';
import NextToken from './NextToken.jsx';
import RemainingToken from './RemainingToken.jsx';

import '../../QueuePage.css';

export default class QueuePage extends Component {
  constructor() {
    super();
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    this.startPolling();
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  startPolling() {
    if (this.interval) return;
    this.keepPolling = true;
    this.asyncInterval(2 * 1000, () => { this.setState({ count: this.state.count + 1 }); });
  }

  stopPolling() {
    this.keepPolling = false;
    if (this.interval) clearTimeout(this.interval);
  }

  asyncInterval(intervalD, fn) {
    const promise = fn();
    const asyncTimeout = () => setTimeout(() => {
      this.asyncInterval(intervalD, fn);
    }, intervalD);
    const assignNextInterval = () => {
      if (!this.keepPolling) {
        this.stopPolling();
        return;
      }
      this.interval = asyncTimeout();
    };

    Promise.resolve(promise)
    .then(assignNextInterval)
    .catch(assignNextInterval);
  }

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
