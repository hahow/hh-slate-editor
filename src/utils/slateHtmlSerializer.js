import React from 'react';
import Html from 'slate-html-serializer';

/**
 * @see {@link https://docs.slatejs.org/other-packages/slate-html-serializer}
 */

// enumeration of different kinds of nodes for serialization/deserialization
const BLOCK_TAGS = {
  blockquote: 'block-quote',
  ol: 'numbered-list',
  ul: 'bulleted-list',
  li: 'list-item',
  h4: 'heading-four',
  p: 'paragraph',
  iframe: 'iframe', // actually it will be 'audio' or 'video', decided by src attribute
  img: 'image',
  pre: 'pre',
  test: 'test',
};
const INLINE_TAGS = { a: 'link' };
const MARK_TAGS = {
  b: 'bold',
  i: 'italic',
};

const getIframeType = (src) => {
  const youtubePrefix = '//www.youtube.com/embed/';
  const vimeoPrefix = '//player.vimeo.com/video/';
  const mixCloudPrefix = 'https://www.mixcloud.com/widget/iframe/';
  const soundCloudPrefix = 'https://w.soundcloud.com/player/';
  if (src.indexOf(youtubePrefix) >= 0 || src.indexOf(vimeoPrefix) >= 0) {
    return 'video';
  } else if (src.indexOf(mixCloudPrefix) === 0 || src.indexOf(soundCloudPrefix) === 0) {
    return 'audio';
  }
  // eslint-disable-next-line no-console
  console.error('getIframeType cannot distinguish iframe type:', src);
  return null;
};

/** 
 * An object of HTML - React attribute names mapping
 * @const {Object.<string, string>} 
 */
const attrNameMap = {
  'class': 'className'
};

/**
 * Return an object of target attribute values, and will return all attribute values of the node if input is empty.
 * @param {Element} node The html node
 * @param {...string} attrs Attribute names
 * @returns {Object.<string, string>} An object of attr values.
 */
const getNodeAttrs = function(node, ...attrs){
  const names = attrs.length ? attrs : node.getAttributeNames()
  return names.reduce((attrObj, name) => {
    attrObj[attrNameMap[name] || name] = node.getAttribute(name);
    return attrObj;
  }, {})
}

/**
 * 這個是使用 Slate Editor，幾乎必備的邏輯。提供 slate 自已 maintain
 * 的 document model 跟 html string 之間轉換。每一種 node 都要有對
 * 應的 serialize & deserialize 函數
 *
 * serialize: convert slate document model object to html string
 * deserialize: convert html string to slate document mode object
 */
const rules = [
  {
    // handle block nodes
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (!type) return undefined;
      switch (type) {
        case 'iframe': {
          // <iframe> could have 'video' or 'audio' type node, we need to distinguish them by src
          const { src } = getNodeAttrs(el, 'src');
          const newType = getIframeType(src);
          if (!newType) { return undefined; }
          return {
            object: 'block',
            type: newType,
            nodes: next(el.childNodes),
            data: { src },
            isVoid: true,
          };
        }
        case 'image': {
          return {
            object: 'block',
            type,
            nodes: next(el.childNodes),
            data: getNodeAttrs(el, 'src', 'alt'),
            isVoid: true,
          };
        }
        case 'test': {
          return {
            object: 'block',
            type,
            nodes: next(el.childNodes),
            data: getNodeAttrs(el, 'class'),
          };
        }
        default: return {
          object: 'block',
          type,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(object, children) {
      if (object.object !== 'block') return undefined;
      switch (object.type) {
        case 'block-quote': return <blockquote>{children}</blockquote>;
        case 'numbered-list': return <ol>{children}</ol>;
        case 'bulleted-list': return <ul>{children}</ul>;
        case 'list-item': return <li>{children}</li>;
        case 'heading-four': return <h4>{children}</h4>;
        case 'paragraph': return <p>{children}</p>;
        case 'image': {
          const src = object.data.get('src');
          const alt = object.data.get('alt');
          const href = object.data.get('href');
          const target = object.data.get('target');
          const rel = target && 'noopener noreferrer';
          return href ? <a href={href} target={target} rel={rel}><img src={src} alt={alt} /></a> : <img src={src} alt={alt} />;
        }
        case 'pre': return <pre>{children}</pre>;
        // while serialization, these 2 types sharing <iframe> tag
        case 'audio':
        case 'video': {
          const videoSrc = object.data.get('src');
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          return <iframe src={videoSrc} />;
        }
        case 'test': {
          const className = object.data.get('className');
          return <test className={className} />;
        }
        default: return null;
      }
    },
  },
  // handle inline nodes
  {
    deserialize(el, next) {
      const type = INLINE_TAGS[el.tagName.toLowerCase()];
      if (!type) return undefined;
      switch (type) {
        case 'link': {
          const { href, target } = getNodeAttrs(el, 'href', 'target');
          const child = el.childNodes[0]

          // 為了 linkedImg 做的 patch，假如子元素是圖片則作為圖片處理
          return child.tagName === 'IMG' ? {
            object: 'block',
            type: 'image',
            data: { href, target, ...getNodeAttrs(child, 'src', 'alt') },
            isVoid: true,
          } : {
            object: 'inline',
            type,
            nodes: next(el.childNodes),
            data: { href, target },
          };
        }
        default: return null;
      }
    },
    serialize(object, children) {
      if (object.object !== 'inline') return undefined;
      switch (object.type) {
        case 'link': {
          const href = object.data.get('href');
          const target = object.data.get('target');
          const rel = target && 'noopener noreferrer';
          if (target) {
            return <a href={href} target={target} rel={rel}>{children}</a>;
          }
          return <a href={href}>{children}</a>;
        }
        default: return null;
      }
    },
  },
  // handle mark nodes
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (!type) return undefined;
      return {
        object: 'mark',
        type,
        nodes: next(el.childNodes),
      };
    },
    serialize(object, children) {
      if (object.object !== 'mark') return undefined;
      switch (object.type) {
        case 'bold': return <b>{children}</b>;
        case 'italic': return <i>{children}</i>;
        default: return null;
      }
    },
  },
];

const htmlSerializer = new Html({ rules });

export default htmlSerializer;
