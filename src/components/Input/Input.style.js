import styled from 'styled-components';
import { color, typography, scaffolding, component, opacity } from '../../styles/theme';

export const PrefixConnector = styled.div`
  float: left;
  display: inline-block;
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  font-weight: ${typography.weight.bold};
  overflow: hidden;
  color: ${typography.font.color.light};

  input {
    padding: 6px 0 6px 167px;
    color: inherit;
  }
`;

export const UrlPrefix = styled.div`
  position: absolute;
  top: 7px;
  left: 12px;
`;

export const ErrorMessage = styled.div`
  display: block;
  color: ${color.error};
  font-size: ${typography.font.size.sm};
  font-weight: ${typography.weight.base};
  margin-top: 5px;
  span {
    margin: 0 5px;
    font-size: 14px;
  }
`;

export const Input = styled.input`
  width: 100%;
  background-color: transparent;
  display: block;
  padding: 5px 10px;
  border: 1px solid ${(props) => {
    if (props.error) {
      return color.error;
    }
    return 'rgba(0, 0, 0, 0.12)';
  }};
  border-radius: ${component.border.radius.md};
  color: ${scaffolding.text.color};
  line-height: 1.75;
  font-size: ${typography.font.size.base};
  font-weight: ${typography.weight.base};
  font-family: inherit;
  transition: 0.2s;

  &::placeholder {
    color: ${color.gray.light};
    font-weight: ${typography.weight.base};
    opacity: 1;
  }

  &:focus {
    border: 1px solid rgba(0, 0, 0, ${opacity.high});
    outline: none;
  }
`;

export const RelativeDiv = styled.div`
  position: relative;
`;
