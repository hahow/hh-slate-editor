import { css } from 'styled-components';
// TODO what is Scaffolding
import { color, opacity } from './theme';

export const Form = css`
  textarea {
    display: block;
    border: 1px solid rgba(0, 0, 0, ${opacity.lower});
    border-radius: 3px;
    padding: 8px 10px;
    width: 100%;
    resize: none;
    &::-webkit-input-placeholder {
      color: ${color.gray.light};
    }
    &:focus {
      border: 1px solid rgba(0, 0, 0, ${opacity.medium});
    }
  }
`;
