import React, { Component } from 'react';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';

export default class NextToken extends Component {
  constructor() {
    super();
    this.state = {
      setClass: false
    };
  }
  componentDidMount() {
    this.setState({
      setClass: true
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      console.log('triggered');
    }
  }
  render() {
    return (
      <div className='c-next-token__wrapper'>
        <div className='clearfix c-next-token__title'>
          <div style={{ display: 'inline-block', float: 'left' }}>
            Next Patient
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            11
          </div>
        </div>
        <div className='c-next-token__body'>
          <div className='c-next-token__inner-body'>
            <div className={cx('c-next-token__name', { 'bounce animated': this.state.setClass })}>
              Abhinav Lal
            </div>
            <div className={cx('c-next-token__phone', { 'bounce animated': this.state.setClass })}>
              *******212
            </div>
          </div>
        </div>
      </div>
    );
  }
}
