import styled from 'styled-components';

import { typography, color, scaffolding, opacity } from './theme';

// 因為不想直接影響 global style，這邊把 global 共用的 style 集中
const GlobalStyleDiv = styled.div`
  font-family: ${typography.font.family.base};
  font-size: ${typography.font.size.base};
  line-height: ${typography.line.height.md}em;
  color: ${scaffolding.text.color};
  -webkit-font-smoothing: antialiased;

  h4 {
    font-size: ${typography.font.size.h4};
    color: rgba(0, 0, 0, ${opacity.high});
    font-weight: ${typography.weight.bold};
    line-height: ${typography.headings.line.height};
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  p {
    margin: 0 0 1em;
    line-height: ${typography.line.height.md}em;
  }

  pre {
    font-family: ${typography.font.family.base};
  }

  img {
    width: 100%;
  }

  a {
    cursor: pointer;
    color: ${typography.font.color.base};
  }

  a:hover,
  a:active,
  a:focus,
  a:visited {
    color: ${typography.font.color.base};
  }

  a,
  a:visited,
  a:hover,
  a:active,
  a:focus,
  input,
  select,
  textarea {
    outline: none;
    text-decoration: none;
  }

  /* alignment */
  ::selection {
    background: ${color.brand.primary.base};
    color: white;
  }

  /* Form */
  textarea {
    display: block;
    border: 1px solid rgba(0, 0, 0, ${opacity.lower});
    border-radius: 3px;
    padding: 8px 10px;
    width: 100%;
    resize: none;
  }

  textarea::-webkit-input-placeholder {
    color: ${color.gray.light};
  }

  textarea:focus {
    border: 1px solid rgba(0, 0, 0, ${opacity.medium});
  }

  button {
    font-size: ${typography.font.size.base};
    font-family: ${typography.font.family.base};
    line-height: ${typography.line.height.lg};
    cursor: pointer;
  }

  input {
    font-size: ${typography.font.size.base};
    box-sizing: border-box;
  }

  label {
    font-weight: 700;
  }

  .btn-default {
    background: transparent;
  }
`;

export default GlobalStyleDiv;
