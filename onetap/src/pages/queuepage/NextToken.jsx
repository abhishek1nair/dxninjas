import React, { Component } from 'react';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

export default class NextToken extends Component {
  constructor() {
    super();
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      setClass: false
    };
  }

  toggleClass(value) {
    this.setState({
      setClass: value
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.toggleClass(true);
    } else {
      this.toggleClass(false);
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
            {
              this.props.nextUser !== null
                ? this.props.nextUser.id
                : '--'
            }
          </div>
        </div>
        <div className='c-next-token__body'>
          {
            this.props.nextUser !== null
            ? <div className='c-next-token__inner-body'>
              <div className={cx('c-next-token__name', { 'bounce animated': this.state.setClass })}>
                { this.props.nextUser.name }
              </div>
              <div className={cx('c-next-token__phone', { 'bounce animated': this.state.setClass })}>
                { `*******${this.props.nextUser.contact.slice(-3)}` }
              </div>
            </div>
            : <div className='c-current-token__inner-body'>
              <div className='c-next-token__name'>
                --
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

NextToken.propTypes = {
  count: PropTypes.number.isRequired,
  nextUser: PropTypes.object
};
