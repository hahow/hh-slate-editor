import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { color, typography, component, form, opacity } from '../../styles/theme';
import { buttonVariant, buttonSize, tabFocus } from './Button.style';

/**
 * Button
 *
 * 關於按鈕高度：
 *   公式：height = (font-size * line-height) + (border-width * 2) + padding-top + padding-bottom
 *
 *   lg: 48px = (20px * 1.8) + (1 * 2) + 5px + 5px
 *   md: 40px = (16px * 1.75) + (1 * 2) + 5px + 5px
 *   sm: 40px = (16px * 1.375) + (1 * 2) + (16px * 0.5) + (16px * 0.5)
 */
const button = {
  padding: {
    vertical: {
      lg: '5px',
      md: '5px',
      sm: '0.5em',
    },
    horizontal: {
      lg: '40px',
      md: '32px',
      sm: '1.5em',
    },
  },
  lineHeight: {
    lg: typography.line.height.lg,
    md: typography.line.height.md,
    sm: typography.line.height.sm,
  },
  font: {
    size: {
      lg: typography.font.size.h5,
      md: typography.font.size.base,
      sm: typography.font.size.base,
    },
  },
  primary: {
    base: {
      normal: {
        backgroundColor: color.brand.primary.base,
        borderColor: color.brand.primary.base,
        color: 'white',
      },
      hover: {
        backgroundColor: color.brand.primary.dark,
        borderColor: color.brand.primary.dark,
        color: 'white',
      },
      active: {
        backgroundColor: color.brand.primary.light,
        borderColor: color.brand.primary.light,
        color: typography.font.color.base,
      },
      disabled: {
        backgroundColor: color.gray.light,
        borderColor: color.gray.light,
        color: 'white',
      },
    },
    default: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.43)',
        color: typography.font.color.base,
      },
      hover: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.43)',
        color: color.brand.primary.base,
      },
      active: {
        backgroundColor: 'transparent',
        borderColor: color.brand.primary.base,
        color: color.brand.primary.base,
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: color.gray.light,
        color: color.gray.light,
      },
    },
    inverse: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        color: 'white',
      },
      hover: {
        backgroundColor: 'transparent',
        borderColor: color.brand.primary.base,
        color: color.brand.primary.basemd,
      },
      active: {
        backgroundColor: color.brand.primary.base,
        borderColor: color.brand.primary.base,
        color: 'white',
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: color.gray.light,
        color: color.gray.light,
      },
    },
    white: {
      normal: {
        backgroundColor: 'white',
        color: color.brand.primary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      hover: {
        backgroundColor: 'white',
        color: color.brand.primary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      active: {
        backgroundColor: color.brand.primary.base,
        color: 'white',
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      disabled: {
        backgroundColor: 'white',
        color: color.brand.primary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
    },
  },
  secondary: {
    base: {
      normal: {
        backgroundColor: color.brand.secondary.base,
        borderColor: color.brand.secondary.base,
        color: 'white',
      },
      hover: {
        backgroundColor: color.brand.secondary.dark,
        borderColor: color.brand.secondary.dark,
        color: 'white',
      },
      active: {
        backgroundColor: color.brand.secondary.light,
        borderColor: color.brand.secondary.light,
        color: typography.font.color.base,
      },
      disabled: {
        backgroundColor: color.gray.light,
        borderColor: color.gray.light,
        color: 'white',
      },
    },
    default: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.43)',
        color: typography.font.color.base,
      },
      hover: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.43)',
        color: color.brand.secondary.base,
      },
      active: {
        backgroundColor: 'transparent',
        borderColor: color.brand.secondary.base,
        color: color.brand.secondary.base,
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: color.gray.light,
        color: color.gray.light,
      },
    },
    inverse: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: 'white',
        color: 'white',
      },
      hover: {
        backgroundColor: 'transparent',
        borderColor: color.brand.secondary.base,
        color: color.brand.secondary.base,
      },
      active: {
        backgroundColor: color.brand.secondary.base,
        borderColor: color.brand.secondary.base,
        color: 'white',
      },
      disabled: {
        backgroundColor: 'transparent',
        borderColor: color.gray.light,
        color: color.gray.light,
      },
    },
    white: {
      normal: {
        backgroundColor: 'white',
        color: color.brand.secondary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      hover: {
        backgroundColor: 'white',
        color: color.brand.secondary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      active: {
        backgroundColor: color.brand.secondary.base,
        color: 'white',
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
      disabled: {
        backgroundColor: 'white',
        color: color.brand.secondary.base,
        boxShadow: `0 6px 12px 0 rgba(0, 0, 0, ${opacity.low})`,
      },
    },
  },
  hollow: {
    base: {
      normal: {
        backgroundColor: 'transparent',
        borderColor: `rgba(0, 0, 0, ${opacity.low})`,
        color: `rgba(0, 0, 0, ${opacity.high})`,
      },
      hover: {
        backgroundColor: 'transparent',
        borderColor: `rgba(0, 0, 0, ${opacity.low})`,
        color: color.brand.primary.base,
      },
    },
  },
  default: {
    white: {
      normal: {
        backgroundColor: 'white',
        borderColor: `rgba(0, 0, 0, ${opacity.lower})`,
        color: `rgba(0, 0, 0, ${opacity.high})`,
      },
      hover: {
        backgroundColor: 'white',
        borderColor: `rgba(0, 0, 0, ${opacity.medium})`,
        color: `rgba(0, 0, 0, ${opacity.higher})`,
      },
      active: {
        backgroundColor: color.brand.primary.base,
        borderColor: color.brand.primary.base,
        color: 'white',
      },
      disabled: {
        backgroundColor: 'white',
        borderColor: color.gray.light,
        color: `rgba(204, 204, 204, ${opacity.high})`,
      },
    },
  },
  border: {
    radius: {
      // Allows for customizing button radius independently from global border radius
      md: component.border.radius.md,
      lg: component.border.radius.md,
    },
  },
  size: {
    minWidth: {
      md: '128px',
      lg: '260px',
      sm: '',
    },
  },
};

const StyledButton = styled.button`
  /** Base styles */

  display: inline-block;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none; /* Reset unusual Firefox-on-Android default style; see https://github.com/necolas/normalize.css/issues/214 */
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
  font-weight: ${typography.weight.base};

  &,
  &:active {
    &:focus {
      ${tabFocus()};
    }
  }

  &:hover,
  &:focus {
    text-decoration: none;
  }

  &:active {
    outline: 0;
    background-image: none;
  }

  &[disabled] {
    cursor: ${form.cursor.disabled};
    opacity: 0.65;
    box-shadow: none;
  }

  ${props => `
    /** Alternate buttons */

    ${buttonVariant(button[props.brand][props.status])};

    /** Button Sizes */

    /* line-height: ensure even-numbered height of button next to large input */
    ${buttonSize(
    button.padding.vertical[props.size],
    button.padding.horizontal[props.size],
    button.font.size[props.size],
    button.border.radius[props.size],
    props.shrink ? 'unset' : button.size.minWidth[props.size],
    button.lineHeight[props.size],
  )};

    /** Block button */

    ${props.block &&
    `
      display: block;
      width: 100%;
    `};
  `};
`;

const Button = props => <StyledButton {...props} />;

Button.propTypes = {
  /** 按鈕色調（primary 為品牌橘色，secondary 為品牌綠色， default 為一般黑字） */
  brand: PropTypes.oneOf(['primary', 'secondary', 'hollow', 'default']),
  /** 按鈕配色（base 是背景為 brand 的按鈕、default 為鏤空按鈕、inverse 為深色背景按鈕、white 為白色背景按鈕 */
  status: PropTypes.oneOf(['base', 'default', 'inverse', 'white']),
  /** 影響按鈕的 padding、min-width、字體大小、圓角等等 */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** 展開填滿可用寬度 */
  block: PropTypes.bool,
  /** 取消設置 min-width */
  shrink: PropTypes.bool,
};

Button.defaultProps = {
  brand: 'primary',
  status: 'base',
  size: 'md',
  block: false,
  shrink: false,
};

export default Button;
