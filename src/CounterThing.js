import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-firebase';

const Counter = ({ value, setValue }) => (
  <div>
    <button onClick={() => setValue(value - 1)}>-</button>
    <span>{value}</span>
    <button onClick={() => setValue(value + 1)}>+</button>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
};

Counter.defaultProps = {
  value: 0,
};

export default connect((props, ref) => ({
  value: 'counterValue',
  setValue: value => ref('counterValue').set(value),
}))(Counter);
