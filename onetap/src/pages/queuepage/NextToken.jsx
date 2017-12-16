import React, { Component } from 'react';

export default class NextToken extends Component {
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
            <div className='c-next-token__name'>
              Abhinav Lal
            </div>
            <div className='c-next-token__phone'>
              *******212
            </div>
          </div>
        </div>
      </div>
    );
  }
}
