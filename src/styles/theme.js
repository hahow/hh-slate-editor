/** Variables */

/**
 * Colors
 *
 * Gray and brand colors for use across styled-components.
 */
export const color = {
  gray: {
    darker: '#1d1d1d',
    dark: '#656565',
    base: '#9b9b9b',
    light: '#cccccc',
    lighter: '#eaeaea',
    lightest: '#fafafa',
    white: '#fff',
  },
  brand: {
    primary: {
      base: '#fa8b00',
      dark: '#f06c00',
      light: '#ffb115',
      light1: '#ffd4c4',
    },
    secondary: {
      base: '#00bea4',
      dark: '#009590',
      light: '#2ee1b3',
    },
  },
  error: '#f05050',
  like: '#ee6457',
  message: '#fff9e1',
  background: '#f3f3f1',
  warning: '#FFEE58',
  notification: {
    hover: '#fffcf6',
    unread: '#fff8ec',
  },
  idea: {
    primary: {
      base: '#eb5e00',
      light: '#ff8050',
    },
    secondary: {
      base: '#0c9',
      dark: '#01a99d',
    },
  },
};

/**
 * Opacity
 *
 */
export const opacity = {
  higher: 0.87,
  high: 0.65,
  medium: 0.43,
  low: 0.24,
  lower: 0.12,
  lowest: 0.06,
};

/**
 * Scaffolding
 *
 * Settings for some of the most global styles.
 */
export const scaffolding = {
  body: {
    // Background color for <body>.
    bg: color.background,
  },
  text: {
    // Global text color on <body>.
    color: 'rgba(0, 0, 0, 0.65)',
  },
};

/**
 * Typography
 *
 * Font, line-height, and color for body text, headings, and more.
 */

export const FONT_SIZE_BASE = 16;
export const FONT_SIZE_XXL = '40px';
export const FONT_SIZE_XL = '33px';
export const FONT_SIZE_L = '30px';
export const FONT_SIZE_M = '23px';
export const FONT_SIZE_S = '20px';
export const FONT_SIZE_XS = `${FONT_SIZE_BASE}px`;
export const FONT_SIZE_XXS = '14px';
export const FONT_SIZE_XXXS = '12px';

export const FONT_WEIGHT_BASE = 400;
export const FONT_WEIGHT_BOLD = 500;
export const FONT_WEIGHT_BOLDER = 600;

export const typography = {
  font: {
    family: {
      base: '"PingFang TC", "微軟正黑體", sans-serif',
    },
    size: {
      h1: FONT_SIZE_XXL,
      h2: FONT_SIZE_XL,
      h3: FONT_SIZE_L,
      h4: FONT_SIZE_M,
      h5: FONT_SIZE_S,
      base: FONT_SIZE_XS,
      sm: FONT_SIZE_XXS,
      xs: FONT_SIZE_XXXS,
    },
    color: {
      dark: `rgba(0, 0, 0, ${opacity.higher})`,
      base: `rgba(0, 0, 0, ${opacity.high})`,
      light: `rgba(0, 0, 0, ${opacity.medium})`,
      lighter: `rgba(0, 0, 0, ${opacity.low})`,
      lightest: `rgba(0, 0, 0, ${opacity.lower})`,
    },
  },
  weight: {
    base: FONT_WEIGHT_BASE,
    bold: FONT_WEIGHT_BOLD,
  },
  line: {
    height: {
      // Unit-less "line-height" for use in components like buttons.
      sm: 1.375,
      md: 1.75,
      lg: 1.8,
      // Computed "line-height" ("font-size" * "line-height") for use with `margin`, `padding`, etc.
      computed: Math.floor(FONT_SIZE_BASE * (20 / FONT_SIZE_BASE)),
    },
  },
  headings: {
    font: {
      // By default, this inherits from the <body>.
      family: 'inherit',
      weight: FONT_WEIGHT_BASE,
    },
    line: {
      height: 1.1,
    },
    color: 'inherit',
  },
};

/**
 * Components
 *
 * Define common padding and border radius sizes and more.
 * Values based on 14px text and 1.428 line-height (~20px to start).
 */
export const component = {
  padding: {
    sm: {
      vertical: '8px',
      horizontal: '28px',
    },
    md: {
      vertical: '12px',
      horizontal: '28px',
    },
    lg: {
      vertical: '11px',
      horizontal: '100px',
    },
  },
  line: {
    height: {
      md: typography.line.height.md,
      lg: 20 / typography.font.size.lg,
    },
  },
  border: {
    radius: {
      round: '50%',
      md: '3px',
      lg: '6px',
    },
  },
};

/**
 * Forms
 */
export const form = {
  cursor: {
    // Disabled cursor for form controls and buttons.
    disabled: 'not-allowed',
  },
};

/**
 * Type
 */
export const type = {
  headings: {
    small: {
      // Headings small color
      color: color.gray.light,
    },
  },
};

/**
 * Media
 */
export const SCREEN_SIZE = {
  lg: 1199,
  md: 991,
  sm: 767,
  xs: 479,
};

export const media = {
  breakpoint: {
    lg: `${SCREEN_SIZE.lg}px`,
    md: `${SCREEN_SIZE.md}px`,
    sm: `${SCREEN_SIZE.sm}px`,
    xs: `${SCREEN_SIZE.xs}px`,
  },
  max_width: {
    xl: '1170px',
    lg: '970px',
    md: '100%',
  },
};

export function isMatchMaxWidth(width) {
  return window.matchMedia(`screen and (max-width: ${width})`).matches;
}

export function isMatchBreakpoint(breakPoint) {
  return isMatchMaxWidth(media.breakpoint[breakPoint]);
}

export const matchBreakpoint = {
  lg: function lg() {
    return isMatchBreakpoint('lg');
  },
  md: function md() {
    return isMatchBreakpoint('md');
  },
  sm: function sm() {
    return isMatchBreakpoint('sm');
  },
  xs: function xs() {
    return isMatchBreakpoint('xs');
  },
};

export const dimension = {
  rightPanelWidth: {
    normal: 315,
    ltSmall: 250,
  },
};

/**
 * Border (from angular project)
 */
export const border = {
  gray_border: `1px solid rgba(black,${opacity.low})`,
  radius: '3px',
  shadow_color: 'rgba(0, 0, 0, 0.2)',
};

/*
 * Header (from _variables.scss in angular project)
 */
export const header = {
  main: {
    height: '50px',
  },
  edit: {
    expandHeight: 110,
    height: 60,
  },
};

/**
 * Footer (from _variables.scss in angular project)
 */
export const footer = {
  height: '90px',
};

export const PROFILE_IMAGE_SIZE = {
  xlg: 170,
  lg: 100,
  md: 70,
  sm: 56,
  xs: 40,
};

export const ANIMATION_DURATION = {
  FAST: '0.28s',
  NORMAL: '0.6s',
};

/**
 * 建立 Z-INDEX 的常數，會依照 zIndexList 順序建立由大到小的 z-index
 * 陣列索引越小 (排在越上面)，z-index 越大，z-index 大小會依照 baseZIndex 的值以 5 為單位遞增
 */
const baseZIndex = 9900;
const zIndexIncrementUnit = 5;
const zIndexList = [
  'toaster',
  'dialog',
  'dialog_overlay',
  'video_panel_play_list_mobile',
  'video_panel_heading_wrapper',
  'video_panel_quiz_cover',
  'video_panel_countdown',
  'video_panel',
  'ur_popup',
  'intercom',
  'preview_flag',
  'header',
  'edit_tutorial',
  'slate_hovering_menu',
  'hahow_point_notification',
  'upload_queue',
  'fixed_buy_button',
  'fixed_bookmark',
  'slate_full_screen',
  'scroll_then_fix_bar',
  'scroll_then_fix_bar_under_header',
  'proposal_info_button',
  'footer',
  'dismissable_fixed_top_message', // <DismissableFixedTopMessage> a.k.a UR那條
  'edit_header',
  'edit_alert',
  'edit_reviewing_lock',
];

export const ZINDEX = {};
const lengthOfzIndexList = zIndexList.length;
for (let i = 0; i < lengthOfzIndexList; i += 1) {
  const key = zIndexList[i];
  const zindex = baseZIndex + (lengthOfzIndexList - i) * zIndexIncrementUnit;
  ZINDEX[key] = zindex;
}

export const PAD_DIRECTION = ['t', 'b', 'r', 'l', 'tb', 'rl'];
export const PAD_SIZE = [
  'n25',
  'n5',
  '0',
  '3',
  '5',
  '10',
  '15',
  '20',
  '25',
  '30',
  '40',
  '45',
  '50',
  '60',
  '70',
  '75',
  '80',
  '90',
  '95',
  '100',
  '110',
  '120',
  '135',
  '140',
  '150',
  '160',
];

/**
 * Dialog
 */

export const dialog = {
  size: {
    width: {
      sm: '350px',
      md: '600px',
      lg: '800px',
      xl: '950px',
    },
  },
};
