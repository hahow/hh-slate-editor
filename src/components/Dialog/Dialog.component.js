import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import get from 'lodash/get';
import noop from 'lodash/noop';
import { StyledTitle, StyledContent, StyledCloseButton, StyledCloseIcon, getModalStyles } from './Dialog.style';
import GlobalStyleDiv from '../../styles/global.style';
import { injectGlobal } from 'styled-components';

injectGlobal`
  .rrm-close-button {
    cursor: pointer;
  }
`;
class Dialog extends Component {
  static propTypes = {
    /** 控制 dialog 顯示與否。使用者關閉 dialog 時應在 onClose 中將此值改回 false。 */
    open: PropTypes.bool.isRequired,
    /** dialog 的內容，預設會填滿整個 dialog。（若無提供 padding ） */
    children: PropTypes.node.isRequired,
    closeOnOverlayClick: PropTypes.bool,
    /** 使用者關閉 dialog（點擊叉叉、外圍 Modal 或按 Esc 鍵）時的 callback function。 */
    onClose: PropTypes.func,
    /**
     * 關閉按鈕提供 3 種樣式：
     * 1. 預設 `null` 視窗右上角內部的叉叉
     * 2. 若提供任意字串，則與叉叉一併顯示於視窗右上角外部，例如：`'關閉視窗'`
     * 3. 若提供空字串 `''` 則兩種都不 render
     */
    closeButtonText: PropTypes.oneOfType([PropTypes.oneOf([null, '']), PropTypes.string]),
    /** 含分隔線的預設樣式的標題（若無提供不render） */
    title: PropTypes.node,
    /** react-responsive-modal 的 modal.width。若無提供則根據內容縮放，不會超出可視範圍。 */
    width: PropTypes.string,
    /** 用於產生 Dialog 的 padding，單位為 px */
    padding: PropTypes.number,
    /** 覆寫 react-responsive-modal 的預設 styles（https://github.com/pradel/react-responsive-modal/blob/master/src/styles.css） */
    styles: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string])),
    /** 塞給 title 的 inline style */
    titleStyles: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string])),
    /** styles 中 closeIcon.fill 的 alias */
    closeIconFilledColor: PropTypes.string,
    overflow: PropTypes.string,
    /** 是否為透明的 dialog（只有背景變暗、顯示內容與關閉按鈕） */
    transparent: PropTypes.bool,
    /**
     * 用於將 Dialog 顯示於指定 container 中。某個 element 的 reference 例：this.myRef.current
     *
     * 實際使用方法請參考 Storybook 範例：
     * https://hahow.github.io/hh-frontend-react/?selectedKind=Dialog&selectedStory=%E5%AE%9A%E4%BD%8D%E6%96%BC%E7%89%B9%E5%AE%9A%E5%8D%80%E5%9F%9F
     *
     * 以及範例之原始碼：
     * /stories/dialog.jsx:148 的 DemoDialogInContainer
     *
     */
    container: PropTypes.object,
  };

  static defaultProps = {
    onClose: noop,
    closeOnOverlayClick: true,
    closeButtonText: null,
    title: null,
    width: 'auto',
    padding: 0,
    styles: {},
    titleStyles: {},
    closeIconFilledColor: null,
    overflow: 'hidden',
    transparent: false,
    container: undefined,
  };

  render() {
    const {
      onClose,
      closeButtonText,
      title,
      children,
      titleStyles,
      closeOnOverlayClick,
      container,
    } = this.props;
    const isTextCloseButton = closeButtonText && closeButtonText !== '';

    // 若以 container 定位 dialog，則不鎖定捲動（https://github.com/pradel/react-responsive-modal/pull/197）
    const shouldBlockScroll = container === undefined;

    return (
      <Modal
        {...this.props} // pass on props listed in https://react-responsive-modal.leopradel.com/
        styles={getModalStyles(this.props, isTextCloseButton)}
        showCloseIcon={closeButtonText === null}
        closeIconSize={25}
        closeOnOverlayClick={closeOnOverlayClick}
        classNames={{
          overlay: 'lecture-editor-no-clickoutside',
          closeButton: 'rrm-close-button'
        }}
        container={container}
        blockScroll={shouldBlockScroll}
        onEntered={() => {
          // A workaround solution for fixing dialog with long content can not be scrolled problem
          setTimeout(() => {
            const doc = document.documentElement;
            doc.style.overflow = 'auto';
          }, 500);
        }}
      >
        <GlobalStyleDiv>
        {title &&
          <StyledTitle
            style={{
              ...titleStyles,
              paddingTop: '15px',
              paddingBottom: '15px',
            }}
            className={`${(!isTextCloseButton) && 'text-center'}`}
          >
            {title}
          </StyledTitle>
          }
          {isTextCloseButton && (
            <div onClick={onClose}>
              <StyledCloseButton style={{
                ...get(this.props.styles, 'closeButton'),
                position: 'absolute',
              }}>
                {closeButtonText}
                <StyledCloseIcon className="close-icon" style={{
                  ...get(this.props.styles, 'closeIcon'),
                  marginLeft: '5px',
                }} />
              </StyledCloseButton>
            </div>
          )}
          <StyledContent overflow={this.props.overflow}>
            {children}
          </StyledContent>
        </GlobalStyleDiv>
      </Modal>
    );
  }
}

export default Dialog;
