import { injectGlobal } from 'styled-components';
import { Typography } from './typography.style';
import { Form } from './form.style';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  ${Typography}
  ${Form}
`;
