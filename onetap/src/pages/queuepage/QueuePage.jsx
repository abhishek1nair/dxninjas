import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CurrentToken from './CurrentToken.jsx';
import NextToken from './NextToken.jsx';
import RemainingToken from './RemainingToken.jsx';
import { getQueueAppointments } from '../../utils/api';


import '../../QueuePage.css';

export default class QueuePage extends Component {
  constructor() {
    super();
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
    this.state = {
      count: 0,
      response: null
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
    this.asyncInterval(5 * 1000);
  }

  stopPolling() {
    this.keepPolling = false;
    if (this.interval) clearTimeout(this.interval);
  }

  asyncInterval(intervalD) {
    const asyncTimeout = () => setTimeout(() => {
      this.asyncInterval(intervalD);
    }, intervalD);
    const assignNextInterval = () => {
      if (!this.keepPolling) {
        this.stopPolling();
        return;
      }
      this.interval = asyncTimeout();
    };
    getQueueAppointments().then((response) => {
      this.setState({ response: response.data });
      assignNextInterval();
    }).catch(() => {
      assignNextInterval();
    });
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
                      <CurrentToken
                        count={this.state.count}
                        currentUser={this.state.response
                          && this.state.response.appointments.length > 0
                            ? this.state.response.appointments[0]
                            : null
                          }
                      />
                      <NextToken
                        count={this.state.count}
                        nextUser={this.state.response
                          && this.state.response.appointments.length > 1
                            ? this.state.response.appointments[1]
                            : null
                          }
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <RemainingToken
                      moreUsers={this.state.response
                          && this.state.response.appointments.length > 2
                            ? this.state.response.appointments.slice(2)
                            : null
                          }
                    />
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
