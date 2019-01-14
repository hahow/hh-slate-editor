import { injectGlobal } from 'styled-components';
import { Typography } from './typography.style';
import { Form } from './form.style';
import {
  scaffolding,
  typography,
  color,
  ZINDEX,
  FONT_SIZE_XXS,
  FONT_SIZE_S,
  FONT_SIZE_M,
  FONT_SIZE_L,
  FONT_SIZE_XL,
  FONT_SIZE_XXL,
  media,
} from './theme';

/* shadow */
const depth1Shadow = '0 1px 2px';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  ${Typography}
  ${Form}

  /** Body reset */

  html {
    font-size: 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  body {
    font-family: ${typography.font.family.base};
    font-size: ${typography.font.size.base};
    color: ${scaffolding.text.color};
    background-color: ${scaffolding.body.bg};
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  pre {
    font-family: ${typography.font.family.base};
  }

  input.note-image-input {
    height: auto;
  }

  img {
    width: 100%;
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

  #root {
    height: 100%;
    > div {
      height: 100%;
    }
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

  a.txt-link-green {
    color: ${color.brand.secondary.base};
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${color.brand.secondary.dark};
      text-decoration: none;
    }

    &:active {
      color: ${color.brand.secondary.light};
      text-decoration: none;
    }
  }

  a.txt-link-orange {
    color: ${color.brand.primary.base};
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: ${color.brand.primary.dark};
      text-decoration: none;
    }

    &:active {
      color: ${color.brand.primary.light};
      text-decoration: none;
    }
  }

  .block {
    display: block;
  }

  .inline {
    display: inline;
  }

  .inline-block {
    display: inline-block;
  }

  .flex {
    display: flex;
  }

  .table {
    display: table;
  }

  .align-items-center {
    align-items: center;
  }

  .justify-space-between {
    justify-content: space-between;
  }

  .justify-center {
    justify-content: center;
  }

  .vertical-horizontal-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pseudo-btn {
    cursor: pointer;
  }

  .flex-1 {
    flex: 1;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-3 {
    flex: 3;
  }

  .flex-4 {
    flex: 4;
  }

  .flex-5 {
    flex: 5;
  }

  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
  }

  .fixed {
    position: fixed;
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .v-align-baseline {
    vertical-align: baseline;
  }

  .hidden-xxs {
    @media (max-width: ${media.breakpoint.xs}) {
      display: none;
    }
  }

  .caret {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }

  /* override bootstrap input button font size */
  input,
  button,
  .dropdown-menu {
    font-size: ${typography.font.size.base};
  }
  *.open {
    .dropdown-toggle.btn-default,
    .dropdown-toggle,
    .btn-default {
      background: transparent !important;
      box-shadow: none !important;
      &:hover,
      &:active,
      &:focus,
      &:visited {
        background: transparent !important;
        box-shadow: none !important;
      }
    }
  }
  .navbar-inverse .navbar-nav > li > a {
    &:hover,
    &:focus,
    &:active,
    &:visited {
      color: inherit;
    }
  }
  .btn-default {
    background: transparent;
  }

  /* Overwrite toaster z-index, use our theme to replace original value, 9998 */
  .notifications-tc {
    z-index: ${ZINDEX.toaster} !important;
  }

  /*
   * wrap
   */
  .white-wrap {
    background: white;
    box-shadow: ${depth1Shadow};
    border-radius: 3px;
    overflow: hidden;
    &.no-shadow {
      box-shadow: none;
    }
  }

  /*
   * typesetting
   */
  .txt-center {
    text-align: center;
  }

  .txt-small {
    font-size: ${FONT_SIZE_XXS};
  }

  .txt-right {
    text-align: right;
  }

  /* display mode */
  .tab-block {
    display: table;
    width: 100%;

    .tab-cell {
      display: table-cell;
    }
  }

  /* alignment */
  .vert-mid {
    display: table-cell;
    vertical-align: middle;
  }

  .align-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ::selection {
    background: ${color.brand.primary.base};
    color: white;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spinging {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  /* stylelint-disable-next-line declaration-block-no-duplicate-properties */
  .ReactVirtualized__Masonry {
    &:focus {
      outline: none;
    }
  }

  #intercom-container,
  #intercom-container > .intercom-app > iframe.intercom-launcher-discovery-frame,
  #intercom-container > .intercom-app > iframe.intercom-launcher-frame,
  #intercom-container > .intercom-app > iframe.intercom-launcher-badge-frame,
  #intercom-container .intercom-app .intercom-launcher-discovery-frame,
  #intercom-container .intercom-app iframe.intercom-launcher-frame,
  #intercom-container .intercom-app iframe.intercom-launcher-badge-frame {
    z-index: ${ZINDEX.intercom} !important;
  }

  .short-border-secondary {
    padding-bottom: 25px;
    position: relative;

    &::after {
      content: '';
      width: 60px;
      height: 4px;
      left: 50%;
      position: absolute;
      bottom: 0;
      margin-left: -30px;
      background-color: ${color.brand.secondary.base};
    }
  }

  .short-border-primary {
    padding-bottom: 25px;
    position: relative;

    &::after {
      content: '';
      width: 60px;
      height: 4px;
      left: 50%;
      position: absolute;
      bottom: 0;
      margin-left: -30px;
      background-color: ${color.brand.primary.base};
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    &.placeholder {
      color: transparent;
      background-color: ${color.gray.lighter};
      padding: 0;
    }
  }

  h1.placeholder {
    min-height: ${FONT_SIZE_XXL};
  }

  h2.placeholder {
    min-height: ${FONT_SIZE_XL};
  }

  h3.placeholder {
    min-height: ${FONT_SIZE_L};
  }

  h4.placeholder {
    min-height: ${FONT_SIZE_M};
  }

  h5.placeholder {
    min-height: ${FONT_SIZE_S};
  }

  html.noscroll,
  body.noscroll {
    overflow: hidden;
    position: relative;
    height: 100vh;
  }
`;
