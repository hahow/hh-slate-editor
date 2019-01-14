import isMobile from 'ismobilejs';
import merge from 'lodash/merge';
import get from 'lodash/get';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { component, opacity, typography, ZINDEX } from '../../styles/theme';

export const StyledTitle = styled.h4`
  color: rgba(0, 0, 0, ${opacity.high});
  border-bottom: 2px solid rgba(0, 0, 0, ${opacity.lower});
`;

export const StyledContent = styled.div`
  border-radius: ${props => (props.isTextCloseButton && isMobile.any) ? 0 : component.border.radius.lg};
  overflow: ${props => props.overflow};
`;

// 用於 transparent=true 的預設樣式
export const transparentStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.8)',
  },
  modal: {
    background: 'transparent',
    boxShadow: 'initial',
  },
  closeButton: {
    backgroundColor: 'transparent',
  },
  closeIcon: {
    fill: 'white',
  },
};

export const getModalStyles = (props, isTextCloseButton) => {
  let position;
  let zIndex = ZINDEX.dialog_overlay;
  let padding = '50px 12px 15vh 12px';

  if (isTextCloseButton && isMobile.any) {
    // Adjust dialog position for accommodating intercom on mobile devices
    padding = '0px 0px 10vh 0px';
  }

  // 若有設定 container，則：
  // 1. 預設 position 為 absolute，自動定位進最近的 relative container
  // 2. 不使用蓋住整個畫面的 global dialog z-index。而是需要再指定 container props 同時由 styles props 傳另一個 z-index
  // 3. 移除預設 padding，避免定位於小 container 出現不必掉 overflow 及 scroll bar
  if (props.container) {
    position = 'absolute';
    zIndex = get(props, 'styles.overlay.zIndex') || 0;
    padding = '0';
  }

  const baseStyles = {
    overlay: {
      zIndex,
      alignItems: 'unset',
      padding,
      position,
    },
    modal: {
      zIndex: ZINDEX.dialog,
      margin: (isTextCloseButton && isMobile.any) ? '0 auto auto auto' : 'auto', // vertical centering
      padding: `${props.padding}px`,
      width: (isTextCloseButton && isMobile.any) ? '100%' : props.width,
      maxWidth: 'unset',
      borderRadius: (isTextCloseButton && isMobile.any) ? 0 : component.border.radius.lg,
      background: props.styles.backgroundColor || 'white',
    },
    closeIcon: {
      // Hide default close button if custom close button text is provided
      display: props.closeButtonText ? 'none' : undefined,
      top: '9px',
      right: '9px',
      fill: props.closeIconFilledColor || `rgba(0, 0, 0, ${opacity.high})`,
      zIndex: 2,
    },
  };

  return props.transparent ?
    merge(baseStyles, transparentStyles, props.styles) : merge(baseStyles, props.styles);
};

// 公布欄 dialog 的右上角「關閉視窗」按鈕
export const StyledCloseButton = styled.div`
  cursor: pointer;
  font-size: ${isMobile.any ? '1em' : typography.font.size.h5};
  font-weight: ${typography.weight.base};
  right: 0;
  color: white;
  top: ${isMobile.any ? '-1px' : '-35px'};
  display: flex;
  align-items: center;
  ${isMobile.any && `
    padding: 10px 15px;
    .close-icon {
      font-size: 1em;
    }
  `}
`;

// 一般 dialog 的右上角叉叉
export const StyledCloseIcon = styled(FontAwesome).attrs({
  name: 'times-circle',
}) `
  font-size: ${typography.font.size.h3};
  cursor: pointer;
`;
