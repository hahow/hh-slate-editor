import { typography, component } from '../../styles/theme';

const buttonStyle = ({ backgroundColor, borderColor, color, boxShadow }) => `
  ${backgroundColor ? `background-color: ${backgroundColor};` : ''}
  ${borderColor ? `border-color: ${borderColor};` : ''}
  ${color ? `color: ${color};` : ''}
  ${boxShadow ? `box-shadow: ${boxShadow};` : ''}
`;

/**
 * Button variants
 *
 * Easily pump out default styles, as well as :hover, :focus, :active,
 * and disabled options for all buttons
 */
export const buttonVariant = ({ normal, hover, active, disabled }) => `
  ${normal && buttonStyle(normal)}

  ${hover &&
    `
    &:hover {
      ${buttonStyle(hover)}
    }
  `}
  ${active &&
    `
    &:active {
      ${buttonStyle(active)}
    }
  `}
  ${disabled &&
    `
    &[disabled] {
      ${buttonStyle(disabled)}
    }
  `}
`;

/**
 * Button sizes
 */
export const buttonSize = (
  paddingVertical = component.padding.md.vertical,
  paddingHorizontal = component.padding.md.horizontal,
  fontSize = typography.font.size.base,
  borderRadius = component.border.radius.md,
  minWidth = '260px',
  lineHeight = typography.line.height.md,
) => `
  padding: ${paddingVertical} ${paddingHorizontal};
  font-size: ${fontSize};
  border-radius: ${borderRadius};
  min-width: ${minWidth};
  line-height: ${lineHeight}em;
`;

export const tabFocus = () => `
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
`;