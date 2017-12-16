import React, { Component } from 'react';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';

export default class CurrentToken extends Component {
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
      <div className='c-current-token__wrapper'>
        <div className=' clearfix c-current-token__title'>
          <div style={{ display: 'inline-block', float: 'left' }}>
            Current Patient
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            10
          </div>
        </div>
        <div className='c-current-token__body'>
          <div className='c-current-token__inner-body'>
            <div className={cx('c-current-token__name', { 'bounce animated': this.state.setClass })}>
              Amit Chhajer
            </div>
            <div className={cx('c-current-token__phone', { 'bounce animated': this.state.setClass })}>
              *******190
            </div>
          </div>
        </div>
      </div>
    );
  }
}
