import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

// TODO: use styled(TippyTooltip) to overrite
export default function Tooltip({ position, children, effect, ...others }) {
  return (
    <ReactTooltip place={position} effect={effect} {...others}>
      {children}
    </ReactTooltip>
  );
}

Tooltip.propTypes = {
  effect: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

Tooltip.defaultProps = {
  effect: 'solid',
  position: 'top',
  children: null,
};
