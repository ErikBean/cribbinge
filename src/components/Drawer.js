import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';

function MuiDrawer({
  open, toggleDrawer, children,
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer}
    >
      {children}
    </Drawer>
  );
}

MuiDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default MuiDrawer;
