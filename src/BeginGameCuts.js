import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

export default function BeginGameCuts({ cuts }) {
  const style = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'larger',
    padding: '0 5vw',
  };
  return (
    <div style={style}>
      First Cut: {cuts[0]
        ? <Card card={cuts[0]} />
        : 'Waiting ... '
      }
      Second Cut: {cuts[1]
        ? <Card card={cuts[1]} />
        : 'Waiting ... '
      }
    </div>
  );
}
BeginGameCuts.propTypes = {
  cuts: PropTypes.arrayOf(PropTypes.string),
};
BeginGameCuts.defaultProps = {
  cuts: [],
};
