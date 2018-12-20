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
  if (src.indexOf(youtubePrefix) >= 0 || src.indexOf(vimeoPrefix) >= 0) {
    return 'video';
  } else if (src.indexOf(mixCloudPrefix) === 0) {
    return 'audio';
  }
  // eslint-disable-next-line no-console
  console.error('getIframeType cannot distinguish iframe type:', src);
  return null;
};

/**
 * The serialization/deserialization rule to/from html.
 * serialize: convert slate document model object to string
 * deserialize: convert string to slate document mode object
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
          const src = el.getAttribute('src');
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
          const src = el.getAttribute('src');
          return {
            object: 'block',
            type,
            nodes: next(el.childNodes),
            data: { src },
            isVoid: true,
          };
        }
        case 'test': {
          const className = el.getAttribute('class');
          return {
            object: 'block',
            type,
            nodes: next(el.childNodes),
            data: { className },
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
          return <img src={src} alt="" />;
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
          const href = el.getAttribute('href');
          const target = el.getAttribute('target');
          const data = { href, target };
          return {
            object: 'inline',
            type,
            nodes: next(el.childNodes),
            data,
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
          if (target) {
            return <a href={href} target={target}>{children}</a>;
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
