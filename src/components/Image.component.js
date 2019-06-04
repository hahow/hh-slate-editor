import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Input } from '../components/Input';

import { ZINDEX, opacity, color, component } from '../styles/theme';

const StyledInputEditDialog = styled.div`
  display: none;
  position: absolute;
  top: 30px;
  margin-left: 15px;
  margin-top: 8px;
  z-index: ${ZINDEX.slate_hovering_menu};

  .arrow-top {
    position: absolute;
    bottom: calc(100% - 1px);
    left: 25px;
    margin-left: -5px;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, ${opacity.low}) transparent;
  }

  .arrow-top::after {
    content: "";
    position: absolute;
    left: -4px;
    bottom: -6px;
    border-width: 4px;
    border-style: solid;
    border-color: transparent transparent white;
  }

  * {
    display: inline-block;
  }

  .menu-button {
    color: ${color.gray.dark};
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, ${opacity.low});
    border-radius: 3px;
    margin-left: 10px;
    &:hover {
      background-color: ${color.gray.lighter};
    }
    &:not(:first-child) {
      border-left: none;
    }
  }

  .menu-container {
    padding: 6px 8px 5px;
    color: rgba(0, 0, 0, ${opacity.high});
    background-color: #fff;
    border-radius: ${component.border.radius.lg};
    border: 1px solid rgba(0, 0, 0, ${opacity.low});
    transition: opacity 0.75s;

    a {
      color: ${color.gray.dark};
      border-bottom: none;
    }
  }
`;

const StyledImage = styled.div`
  position: relative;
`;

class InputEditDialog extends React.Component {
  static propTypes = {
    menuRef: PropTypes.func.isRequired,
    value: PropTypes.string,
    onOpenEditDialog: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value })
    }
  }

  render() {
    const { menuRef, onOpenEditDialog } = this.props;
    const { value } = this.state;
    return (
      <StyledInputEditDialog innerRef={menuRef} contentEditable={false}>
        <div className="menu-container">
          <div className="arrow-top" />
          <div>
            圖片描述：{value}
            <button
              onMouseDown={onOpenEditDialog}
              className="menu-button"
            >修改</button>
          </div>
        </div>
      </StyledInputEditDialog>
    );
  }
}

class Image extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onChangeImgAlt: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.imgRef = null;
    this.menuRef = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSelected !== this.props.isSelected) {
      this.updateMenu();
    }
  }

  saveMenuRef = (menuRef) => {
    this.menuRef = menuRef;
  }

  updateMenu = () => {
    const menuRef = this.menuRef;
    if (!menuRef) return;

    const selection = window.getSelection();
    if (this.props.isSelected && selection.isCollapsed) {
      if (!this.imgRef) return;
      menuRef.style.display = 'block';
    } else {
      menuRef.style.display = 'none';
    }
  }

  closeMenu = () => {
    this.menuRef.style.display = 'none';
  }

  render() {
    const { node, attributes, onOpenEditDialog } = this.props;
    const src = node.data.get('src');
    const alt = node.data.get('alt');
    return (
      <StyledImage>
        <img
          ref={(c) => { this.imgRef = c; }}
          {...attributes}
          src={src}
          alt={alt}
        />
        <InputEditDialog
          menuRef={this.saveMenuRef}
          value={alt}
          onOpenEditDialog={() => {
            if (onOpenEditDialog && node.key) {
              this.closeMenu();
              /*
                This is a workaround !
                It seems closeMenu may have async behavior, while current activeElement
                was not displayed anymore, it will automatically focus on parenet element.
                So here, we make onOpenEditDialog async, so that the focus can work properly.
              */
              setTimeout(() => {
                onOpenEditDialog(node.key);
              });
            }
          }}
        />
      </StyledImage>
    );
  }
}

export default Image;
