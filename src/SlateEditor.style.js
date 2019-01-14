import { StyledRichTextView } from './styles/RichTextView.style';

import { ZINDEX, color } from './styles/theme';

const StyledSlateEditor = StyledRichTextView.extend`
  background-color: white;
  border: 1px solid ${(props) => {
    if (props.error) {
      return color.error;
    }
    return '#a9a9a9';
  }};
  border-radius: 3px;

  /*
    這邊必須要把 p::after 的 content 移除掉，要不然 slate editor
    碰到多個空的 paragraph 的時候，鍵盤向下的按鈕會失效
  */
  p::after {
    content: none;
  }

  .slate-full-screen-mode {
    background-color: white;
    position: fixed;
    left: 0;
    top: 55px;
    width: 100%;
    height: 100%;
    z-index: ${ZINDEX.slate_full_screen};
  }

  .toolbar-menu {
    padding: 5px 24px 0;
    margin: 0;
    background-color: #f5f5f5;
    border-color: #ddd;
    position: relative;
    border-bottom: 1px solid #ddd;
  }

  .toolbar-menu .button {
    border-radius: 3px !important;
    border: none;
    margin-left: 3px;

    &:first-child {
      margin-left: 0;
    }
    &[data-active="true"] {
      background-color: #fa8b00;
    }
    &:focus {
      outline: 0;
    }
    .fa {
      font-size: 14px;
    }
    img {
      margin-top: 9px;
      width: 16px;
      height: auto;
    }
  }

  .toolbar-menu {
    .button-group {
      display: inline-block;
      margin-bottom: 5px;
      &:first-child {
        margin-right: 12px;
      }
    }
    .button-group + .button-group {
      margin-right: 12px;
    }
  }

  .toolbar-menu .full-screen-btn {
    position: absolute;
    right: 24px;
    top: 5px;
  }

  .toolbar-menu .button .click-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toolbar-menu .button .fa-giphy {
    width: 18px;
    height: 20px;
    background-size: 18px 20px;
    margin-left: -2px;
    margin-top: 7px;
  }

  .toolbar-menu .button .fa-mixcloud {
    width: 14px;
    margin-left: -2px;
  }

  .no-style-container {
    padding: 0;
    margin: 0;
    border: 0;
    display: inline-block;
    &:focus {
      outline: 0;
    }
  }

  .editing-area {
    padding: 0 24px 5px;
    resize: vertical;
    overflow: auto;
    height: ${props => (props.height ? `${props.height}px` : '350px')};
    /* walkaround for resolving blinking problem of youtube iframe in editor */
    transform: translate3d(0, 0, 0);

    .slate-editor {
      height: 100%;

      img:hover {
        opacity: 0.8;
        outline: 3px solid blue;
      }

      img.active {
        opacity: 1;
        outline: 3px solid blue;
      }
    }
  }

  .slate-full-screen-mode .editing-area {
    height: 100%;
  }

  .flex {
    display: flex;
  }
`;

export default StyledSlateEditor;
