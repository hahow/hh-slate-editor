import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

// import Tooltip from '../Tooltip';
import { shortenHref } from '../utils/format';

import { ZINDEX, opacity, color, component } from '../styles/theme';

const StyledLinkMenu = styled.div`
  display: none;
  position: absolute;
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

  .href {
    color: ${color.gray.dark};
    border-bottom: none;
  }

  .menu-button {
    color: ${color.gray.dark};
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, ${opacity.low});
    border-radius: 3px;
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

const LinkMenu = ({ menuRef, href, id, onOpenEditDialog, onRemoveLink }) => (
  <StyledLinkMenu innerRef={menuRef} contentEditable={false}>
    <div className="menu-container">
      <div className="arrow-top" />
      <a
        style={{ marginRight: '10px', marginLeft: '5px' }}
        spellCheck="false"
        href={href}
        target="_blank"
      >{shortenHref(href)}</a>
      <div>
        <button
          type="button"
          className="menu-button"
          onMouseDown={onOpenEditDialog}
          data-for={`edit-link-btn-${id}`}
          data-tip
        >
          <FontAwesome name="link" />
        </button>
        {/*<Tooltip id={`edit-link-btn-${id}`} position="bottom">編輯連結</Tooltip>*/}
        <button
          type="button"
          className="menu-button"
          onMouseDown={onRemoveLink}
          data-for={`remove-link-btn-${id}`}
          data-tip
        >
          <FontAwesome name="unlink" />
        </button>
        {/*<Tooltip id={`remove-link-btn-${id}`} position="bottom">移除連結</Tooltip>*/}
      </div>
    </div>
  </StyledLinkMenu>
);

LinkMenu.propTypes = {
  menuRef: PropTypes.func.isRequired,
  href: PropTypes.string,
  id: PropTypes.string.isRequired,
  onOpenEditDialog: PropTypes.func.isRequired,
  onRemoveLink: PropTypes.func.isRequired,
};

LinkMenu.defaultProps = {
  href: '',
};

class Link extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onOpenEditDialog: PropTypes.func.isRequired,
    onRemoveLink: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.linkRef = null;
    this.menuRef = null;
    this.menuIsOpen = false;
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
      if (!this.linkRef) return;
      menuRef.style.display = 'block';
    } else {
      menuRef.style.display = 'none';
    }
  }

  closeMenu = () => {
    this.menuRef.style.display = 'none';
  }

  render() {
    const { node, attributes, children, onOpenEditDialog, onRemoveLink } = this.props;
    const href = node.data.get('href');
    const target = node.data.get('target');
    return (
      <span>
        <a
          ref={(c) => { this.linkRef = c; }}
          {...attributes}
          href={href}
          target={target}
        >
          {children}
        </a>
        <LinkMenu
          menuRef={this.saveMenuRef}
          href={href}
          id={node.key}
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
          onRemoveLink={onRemoveLink}
        />
      </span>
    );
  }
}

export default Link;
