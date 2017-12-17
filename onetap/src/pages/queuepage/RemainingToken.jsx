import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RemainingToken extends Component {
  constructor() {
    super();
    this.state = {
      colorsArray: [
        '#ffd2ac',
        '#ffebb3'
      ]
    };
  }
  render() {
    return (
      <div className='clearfix c-remaining-token__full-wrapper'>
        <div className='c-remaining-token__title'>
          Waiting List
        </div>
        {
          this.props.moreUsers !== null
          ? this.props.moreUsers.map((data, index) => {
            return (
              <div key={`c-remaining-token__wrapper-${index}`} className='clearfix c-remaining-token__wrapper' style={{ background: this.state.colorsArray[index % 2] }}>
                <div style={{ display: 'inline-block', float: 'left' }}>
                  { data.id }&nbsp;&nbsp;{ data.name }
                </div>
                <div style={{ display: 'inline-block', float: 'right' }}>
                  { `*******${data.contact.slice(-3)}` }
                </div>
              </div>
            );
          })
          : <div
            className='clearfix c-remaining-token__wrapper'
            style={{ background: this.state.colorsArray[0] }}
          />
        }
      </div>
    );
  }
}

RemainingToken.propTypes = {
  moreUsers: PropTypes.array
};
