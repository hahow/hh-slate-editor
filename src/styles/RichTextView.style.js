import styled from 'styled-components';
import { opacity, color, typography } from './theme';
import gif from '../assets/gif.png';

export const StyledRichTextView = styled.div`
  display: block;
  user-select: text;
  word-break: break-all;

  p,
  h4,
  li,
  a,
  pre {
    word-break: break-word;
    word-wrap: normal;
    white-space: pre-wrap;
  }

  p {
    margin: 16px 0;
    padding: 0;
  }

  /*
    這個 style 主要是解決在把 rich text 塞到 DOM 裡面顯示的時候，
    連續空白的 <p></p> 不會換行的問題。
    ref: https://github.com/hahow/hh-frontend-react/pull/2069

    但這個 style 在 slate editor 的編輯模式的時候，必須移除。
    否則碰到多個空的 paragraph 的時候，鍵盤向下的按鈕會失效。
  */
  p::after {
    content: ' ';
  }

  pre {
    font-size: ${typography.font.size.sm};
    line-height: 1.8em;
    margin: 24px 0;
    padding: 8px 16px;
    border-radius: 0;
    border: 0;
    background-color: ${color.gray.lighter};
  }

  /*
    為了讓兩個相鄰的 pre 中間的距離是 8px
  */
  pre + pre {
    margin-top: -16px;
  }

  a {
    color: ${color.brand.primary.base};
    border-bottom: 1px solid ${color.brand.primary.base};

    &:visited,
    &:focus {
      color: ${color.brand.primary.base};
      border-bottom: 1px solid ${color.brand.primary.base};
    }
    &:hover {
      color: ${color.brand.primary.dark};
      border-bottom: 1px solid transparent;
    }
    &:active {
      color: ${color.brand.primary.light};
      border-bottom: 1px solid ${color.brand.primary.base};
    }
  }

  ol,
  ul {
    padding-left: 20px;
    margin: 24px 0;
  }

  ol > li {
    list-style: decimal;
  }

  ul > li {
    list-style: disc;
  }

  img,
  iframe {
    width: 100%;
  }

  h4 {
    text-align: left;
    margin-bottom: 16px;
    margin-top: 40px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, ${opacity.lower});
  }

  img {
    margin: 24px 0;
  }

  blockquote {
    color: ${typography.font.color.dark};
    font-size: 18px;
    letter-spacing: 0.1em;
    margin: 24px 0;
    padding: 2px 0 2px 16px;
    border-left: 5px solid ${color.brand.primary.base};
  }

  .video-container {
    margin: 24px 0;
  }

  /* override dropdown menu */
  .dropdown-menu {
    padding: 0;
    width: 350px;
    a {
      border-bottom: none;
      padding: 20px;
      > :not(pre):not(h4) {
        margin: 0;
        padding: 0;
      }
    }
    li {
      list-style: none;
    }
    h4 {
      margin-bottom: 12px;
      padding-bottom: 12px;
      padding-top: 30px;
      border-bottom: 1px solid rgba(0, 0, 0, ${opacity.lower});
    }
    blockquote {
      padding-left: 50px;
    }
  }

  /* override dropdown end */
  form.ng-invalid.ng-touched .note-editor {
    border-color: ${color.error};
  }

  .note-popover .popover .popover-content {
    padding: 10px;
  }

  .note-popover .popover .popover-content > .btn-group {
    margin: 0;
  }

  .note-editor {
    color: ${typography.font.color.base} !important;
    min-height: 400px;
    img {
      width: 100% !important;
      padding: 20px 0;
    }
    &.fullscreen {
      .note-icon-arrows-alt::before {
        content: "";
        font-family: FontAwesome;
      }
    }
    .note-editing-area .note-editable[contenteditable=true]:empty:not(:focus)::before {
      color: ${typography.font.color.lightest} !important;
    }
  }

  .note-image-popover {
    top: 0 !important;
    right: 10px;
    left: auto !important;
    background: transparent;
    border: none;
    br {
      display: none;
    }

    .arrow {
      display: none;
    }

    .popover-content > .btn-group {
      display: none;
    }

    .popover-content > .btn-group:last-child {
      display: block;
    }
  }

  .note-image-dialog .form-group:not(.note-group-select-from-files) {
    display: none;
  }

  .note-control-selection-info {
    display: none;
  }

  .note-control-se {
    border-top: none !important;
    border-left: none !important;
    background: none !important;
  }
  .btn {
    background-color: #2e3138;
    color: white;
    &:hover {
      background-color: ${color.brand.primary.base};
      color: white;
    }
  }
  .note-editor.note-frame .note-editing-area .note-editable {
    color: ${typography.font.color.base};
  }

  .invalidation {
    color: ${color.error};
    display: none;
  }

  .btn {
    height: 36px;
    min-width: 36px;
  }
  .fa-giphy {
    background-image: url(${gif});
    width: 22px;
    height: 24px;
    background-size: 22px 24px;
    margin-left: -2px;
    margin-top: 1px;
  }

  .video-container {
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    padding-top: 56.2%;

    iframe,
    video {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      border: none;
    }
  }
`;
