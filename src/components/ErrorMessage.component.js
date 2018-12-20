import styled from 'styled-components';

import { color, typography } from '../styles/theme';

const ErrorMessage = styled.div`
  display: block;
  color: ${color.error};
  font-size: ${typography.font.size.sm};
  line-height: ${typography.line.height.md}em;
  margin-top: 5px;
  span {
    margin: 0 5px;
    font-size: ${typography.font.size.sm}px;
  }
`;

export default ErrorMessage;