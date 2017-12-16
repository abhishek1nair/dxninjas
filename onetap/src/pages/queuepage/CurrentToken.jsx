import React, { Component } from 'react';

export default class CurrentToken extends Component {
  render() {
    return (
      <div className='c-current-token__wrapper'>
        <div className=' clearfix c-current-token__title'>
          <div style={{ display: 'inline-block', float: 'left' }}>
            In progress
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            10
          </div>
        </div>
        <div className='c-current-token__body'>
          <div className='c-current-token__inner-body'>
            <div className='c-current-token__name'>
              Amit Chhajer
            </div>
            <div className='c-current-token__phone'>
              ********90
            </div>
          </div>
        </div>
      </div>
    );
  }
}
