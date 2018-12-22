import { css } from 'styled-components';
// TODO what is Scaffolding
import { color, type, opacity, typography, scaffolding } from './theme';

export const Typography = css`

  html {
    font-size: 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  body {
    font-family: ${typography.font.family.base};
    font-size: ${typography.font.size.base};
    line-height: ${typography.line.height.md}em;
    color: ${scaffolding.text.color};
    background-color: ${scaffolding.body.bg};
    -webkit-font-smoothing: antialiased;
    margin: 0;
    padding: 0;
  }

  /** Typography */
  .heading {
    margin-bottom: 12px;
    padding-bottom: 12px;
    padding-top: 30px;
    border-bottom: 1px solid ${color.gray.light};
  }

  /** Headings */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${typography.headings.font.weight};
    line-height: ${typography.headings.line.height};
    color: ${typography.headings.color};
    text-align: left;
    small {
      font-weight: ${typography.weight.base};
      line-height: 1;
      color: ${type.headings.small.color};
    }
  }

  h1,
  h2,
  h3,
  h4 {
    /** TODO check why to overwrite font-weight */
    font-weight: ${typography.weight.bold};
  }

  h1,
  h2,
  h3 {
    /** TODO check why setup margin top, margin bottom */
    margin-top: ${typography.line.height.computed}px;
    margin-bottom: ${typography.line.height.computed / 2}px;
    small {
      font-size: 65%;
    }
  }

  h4,
  h5,
  h6 {
    margin-top: ${typography.line.height.computed / 2}px;
    margin-bottom: ${typography.line.height.computed / 2}px;
    small {
      font-size: 75%;
    }
  }

  h1 {
    font-size: ${typography.font.size.h1};
    color: rgba(0, 0, 0, ${opacity.higher});
  }
  h2 {
    font-size: ${typography.font.size.h2};
    color: rgba(0, 0, 0, ${opacity.higher});
  }
  h3 {
    font-size: ${typography.font.size.h3};
    color: rgba(0, 0, 0, ${opacity.high});
  }
  h4 {
    font-size: ${typography.font.size.h4};
    color: rgba(0, 0, 0, ${opacity.high});
  }
  h5 {
    font-size: ${typography.font.size.h5};
    color: rgba(0, 0, 0, ${opacity.high});
  }
  h6 {
    font-size: ${typography.font.size.base};
    color: rgba(0, 0, 0, ${opacity.high});
  }

  .text-main {
    font-size: ${typography.font.size.base};
    color: rgba(0, 0, 0, ${opacity.high});
  }

  .text-strong {
    font-size: ${typography.font.size.base};
    font-weight: ${typography.weight.bold};
    color: rgba(0, 0, 0, ${opacity.higher});
  }

  .text-sub {
    font-size: ${typography.font.size.base};
    color: rgba(0, 0, 0, ${opacity.medium});
  }

  .text-note {
    font-size: ${typography.font.size.sm};
    color: rgba(0, 0, 0, ${opacity.medium});
  }

  p {
    margin: 0 0 1em;
    line-height: ${typography.line.height.md}em;
  }

  pre.undecorated {
    background-color: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    color: rgba(0, 0, 0, ${opacity.high}) !important;
    line-height: ${typography.line.height.md}em !important;
    font-size: ${typography.font.size.base} !important;
    white-space: pre-line !important;
    padding: 0 0 10px !important;
    margin: 0 !important;
    /** overwrite bootstrap style */
    font-family: ${typography.font.family.base} !important;
  }

  .strongfont {
    color: rgba(0, 0, 0, ${opacity.higher});
    font-size: ${typography.font.size.base};
    font-weight: bolder;
  }

  .text-sm {
    font-size: ${typography.font.size.sm};
  }

  .text-xs {
    font-size: ${typography.font.size.xs};
  }

  .text-bold {
    font-weight: ${typography.weight.bold};
  }

  .text-primary {
    color: ${color.brand.primary.base};
  }
  .text-secondary {
    color: ${color.brand.secondary.base};
  }

  .link-gray {
    cursor: pointer;
    color: ${color.gray.dark};
    &:visited {
      color: ${color.gray.dark};
    }
    &:hover,
    &:active,
    &:focus {
      color: ${color.gray.darker};
    }
  }

  .link-primary {
    cursor: pointer;
    color: ${color.brand.primary.base};
    &:visited {
      color: ${color.brand.primary.base};
    }
    &:hover,
    &:active,
    &:focus {
      color: ${color.brand.primary.dark};
    }
  }

  .text-error {
    color: ${color.error};
  }

  .text-underline {
    text-decoration: underline;
  }

  .text-secondary {
    color: ${color.brand.secondary.base};
  }

  .text-line-through {
    text-decoration: line-through;
  }

  a {
    cursor: pointer;
    color: ${typography.font.color.base};

    &:hover,
    &:active,
    &:focus,
    &:visited {
      color: ${typography.font.color.base};
    }
  }

  .link {
    cursor: pointer;
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
      border-bottom: 1px solid ${color.brand.primary.light};
    }
  }

  a.link-grn {
    cursor: pointer;
    color: ${color.brand.secondary.base};
    border-bottom: 1px solid ${color.brand.secondary.base};

    &:hover,
    &:active {
      color: ${color.brand.secondary.dark};
      border-bottom: 0;
    }
  }

  a.link-org {
    cursor: pointer;
    color: ${color.brand.primary.base};
    border-bottom: 1px solid ${color.brand.primary.base};

    &:hover,
    &:active {
      color: ${color.brand.primary.dark};
      border-bottom: 0;
    }
  }

  .tag,
  .tag-coral,
  .tag-orange,
  .tag-gray {
    font-size: ${typography.font.size.xs};
    border-radius: 100px;
    color: white;
    padding: 4px 10px;
    white-space: nowrap;
  }
  .tag-coral {
    background: ${color.brand.secondary};
  }
  .tag-orange {
    background: ${color.brand.primary};
  }
  .tag-gray {
    background: rgba(0, 0, 0, ${opacity.high});
  }
`;

