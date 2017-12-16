import React from 'react';
import PropTypes from 'prop-types';

export const ThreeCircleLoader = ({ wrapperClass = '', circleClass = '' }) => {
  return (
    <div className={`${wrapperClass} c-loader--circle`}>
      <div className={`${circleClass} circle circle-one`} />
      <div className={`${circleClass} circle circle-two`} />
      <div className={`${circleClass} circle circle-three`} />
    </div>
  );
};

ThreeCircleLoader.propTypes = {
  wrapperClass: PropTypes.string,
  circleClass: PropTypes.string
};

export default {};
