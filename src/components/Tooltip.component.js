import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'rc-tooltip';
import { injectGlobal } from 'styled-components';

import 'rc-tooltip/assets/bootstrap.css';

injectGlobal`
  .rc-tooltip-inner {
    padding: 8px 20px;
    background-color: #222;
    border-radius: 3px;
    box-shadow: none;
    font-size: 13px;
    min-height: initial;
  }
`;

export default function Tooltip({
  overlay, overlayClassName, placement, children, ...restProps
}) {
  return (
    <ReactTooltip
      placement={placement}
      overlay={overlay}
      overlayClassName={overlayClassName}
      mouseLeaveDelay={0}
      {...restProps}
    >{children}
    </ReactTooltip>
  );
}

Tooltip.propTypes = {
  overlay: PropTypes.element,
  overlayClassName: PropTypes.string,
  placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']),
  children: PropTypes.node,
};

Tooltip.defaultProps = {
  overlay: null,
  overlayClassName: '',
  placement: 'top',
  children: null,
};
