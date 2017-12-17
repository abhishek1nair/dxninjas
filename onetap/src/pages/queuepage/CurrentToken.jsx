import React, { Component } from 'react';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

export default class CurrentToken extends Component {
  constructor() {
    super();
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      setClass: false
    };
  }

  toggleClass() {
    const { setClass } = this.state;
    this.setState({
      setClass: !setClass
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.toggleClass();
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
            {
              this.props.currentUser !== null
                ? this.props.currentUser.id
                : '--'
            }
          </div>
        </div>
        <div className='c-current-token__body'>
          {
            this.props.currentUser !== null
            ? <div className='c-current-token__inner-body'>
              <div className={cx('c-current-token__name', { 'bounce animated': this.state.setClass })}>
                { this.props.currentUser.name }
              </div>
              <div className={cx('c-current-token__phone', { 'bounce animated': this.state.setClass })}>
                { `*******${this.props.currentUser.contact.slice(-3)}` }
              </div>
            </div>
            : <div className='c-current-token__inner-body'>
              <div className='c-current-token__name'>
                --
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

CurrentToken.propTypes = {
  count: PropTypes.number.isRequired,
  currentUser: PropTypes.object
};
