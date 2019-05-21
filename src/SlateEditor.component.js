/**
 * Warning: This is not a full-functioned editor. There is no image uploading
 *  function. Please do not import this component directly.
 * Please import SlateEditor.container in containers folder
 */

import PropTypes from 'prop-types';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Editor, getEventTransfer } from 'slate-react';
import SoftBreak from 'slate-soft-break';
import debounce from 'lodash/debounce';

import Iframe from './components/Iframe.component';
import Link from './components/Link.component';
import InputDialog from './components/InputDialog.component';
import LinkInputDialog from './components/LinkInputDialog.component';
import UploadContainer from './components/UploadContainer.component';
import ErrorMessage from './components/ErrorMessage.component';
import Tooltip from './components/Tooltip.component';
import clearIcon from './assets/icon-clear.svg';

import StyledSlateEditor from './SlateEditor.style';
import htmlSerializer from './utils/slateHtmlSerializer';
import { isBoldHotkey, isItalicHotkey, isLinkHotKey, isTab } from './utils/hotkey';
import { editorJoiSchema } from './utils/validator';
import normalize from './utils/htmlNormalization';
import GlobalStyleDiv from './styles/global.style';

const DEFAULT_NODE = 'paragraph';

const plugins = [
  SoftBreak({ shift: true, onlyIn: ['pre', 'block-quote'] }),
];

function wrapLink(editor, href, openInNewWindow) {
  const data = { href };
  if (openInNewWindow) {
    data.target = '_blank';
  }
  editor.wrapInline({
    type: 'link',
    data,
  });
  // 讓游標移動到原本選取字的最後一個字後面 @see {@link https://docs.slatejs.org/slate-core/commands#moveto-point}
  editor.moveToEnd();
}

function unwrapLink(editor) {
  editor.unwrapInline('link');
}

function setLinkByKey(editor, nodeKey, href, openInNewWindow) {
  const data = { href };
  if (openInNewWindow) { data.target = '_blank'; }
  editor.setNodeByKey(nodeKey, {
    data,
  });
}

function addIframe(editor, type, href, hasListItem = false) {
  // if the position for iframe has list-item, then unwrap it first
  if (hasListItem) {
    editor
      .setBlocks(DEFAULT_NODE)
      .unwrapBlock('bulleted-list')
      .unwrapBlock('numbered-list');
  }
  editor.insertBlock({
    type,
    data: { src: href },
  });
  editor.insertBlock({
    type: 'paragraph',
  });
}

function insertImage(editor, src, hasListItem = false) {
  // if the position for image has list-item, then unwrap it first
  if (hasListItem) {
    editor
      .setBlocks(DEFAULT_NODE)
      .unwrapBlock('bulleted-list')
      .unwrapBlock('numbered-list');
  }
  editor.insertBlock({
    type: 'image',
    data: { src },
  });
  editor.insertBlock({
    type: 'paragraph',
  });
}

const schema = {
  blocks: {
    image: { isVoid: true },
    audio: { isVoid: true },
    video: { isVoid: true },
  },
};
class SlateEditor extends React.Component {
  static propTypes = {
    /** html string as content of editor */
    value: PropTypes.string,
    /** onChange(value): debounced onChange function which
     * emits new value(html string) for updating */
    onChange: PropTypes.func,
    /** debounce time to call onChange function, default: 500 ms */
    debounceTime: PropTypes.number,
    /** height of editing area, default: 350px */
    height: PropTypes.number,
    /** open debugMode */
    debugMode: PropTypes.bool,
    /** for connecting upload function in container */
    uploadImage: PropTypes.func,
    /** to show some warning message while using editor */
    onWarning: PropTypes.func,
    normalizeValue: PropTypes.bool,
    normalizePastedValue: PropTypes.bool,
    errorMessage: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    value: '<p></p>',
    onChange: () => { },
    height: 350,
    debounceTime: 100,
    debugMode: false,
    uploadImage: () => { },
    onWarning: () => {},
    normalizeValue: false,
    normalizePastedValue: true,
    errorMessage: '',
    className: '',
  };

  constructor(props) {
    super(props);

    let initialValue = '';
    if (props.normalizeValue) {
      // eslint-disable-next-line no-console
      if (props.debugMode) { console.log('before normalization:', props.value); }
      const normalized = normalize(props.value);
      // eslint-disable-next-line no-console
      if (props.debugMode) { console.log('after normalization:', normalized); }
      initialValue = htmlSerializer.deserialize(normalized);
    } else {
      initialValue = htmlSerializer.deserialize(props.value);
    }
    this.state = {
      /** the data model maintained by Slate Editor, not html string */
      value: initialValue,
      /** the serialized value (html string) from value or props.value */
      serializedValue: props.value,
      fullScreenMode: false,
      currentOpenDialog: null,
      dialogValue: '',
      dialogUrl: '',
      dialogText: '',
      openInNewWindow: true,
      editNodeKey: null,
    };
  }

  ref = (editor) => {
    this.editor = editor;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.value !== this.props.value &&
      nextProps.value !== this.state.serializedValue
    ) {
      let serializedValue = nextProps.value;
      let value;
      if (nextProps.normalizeValue) {
        // eslint-disable-next-line no-console
        if (nextProps.debugMode) { console.log('before normalization:', nextProps.value); }
        serializedValue = normalize(nextProps.value);
        // eslint-disable-next-line no-console
        if (nextProps.debugMode) { console.log('after normalization:', serializedValue); }
        value = htmlSerializer.deserialize(serializedValue);
      } else {
        value = htmlSerializer.deserialize(nextProps.value);
      }
      this.setState({ serializedValue, value });
    }
  }

  /**
   * On change handler for slate editor, save the new `value`.
   */
  onChange = ({ value, operations }) => {
    this.setState({ value });
    if (this.willChangeContent(operations)) {
      this.debounceOnChange(value);
    }
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   */
  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  }

  /**
   * Handle numbered-list, bulleted-list button click event
   *
   * @param {Event} event
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. Allowed value: `numbered-list`, `bulleted-list`
   */
  onClickList = (event, type) => {
    event.preventDefault();
    if (type !== 'bulleted-list' && type !== 'numbered-list') { return; }

    const editor = this.editor;
    const value = this.state.value;
    const { document } = value;
    const hasListItem = this.hasBlock('list-item');
    const hasVoidBlock = this.hasVoidBlock();
    const hasNonListBlock = this.hasNonListBlock();
    // @see {@link https://docs.slatejs.org/slate-core/node#getclosest}
    const hasType = value.blocks.some(block => !!document.getClosest(
      block.key,
      parent => parent.type === type,
    ));

    /*
      假設選取的範圍包含 void block (image, video, audio)，或 non-list block
      (heading-four, block-quote, pre) 情況會非常複雜，不好處理，因此目前僅會
      unwrap 原本的 list。
      e.g.
        選取範圍
        <ol>                                  <p>123</p>
          <li>123</li>  click numbered-list   <p>456</p>
          <li>456</li>  ===================>  <img />
        </ol>
        <img />
      e.g.
        選取範圍
        <ol>
          <li>123</li>  click bulleted-list
          <li>456</li>  ===================> 不處理
        </ol>
        <img />
    */
    if (hasVoidBlock || hasNonListBlock) {
      if (hasListItem && hasType) {
        editor
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
        value.blocks.forEach((block) => {
          if (!this.isVoidBlock(block)) {
            editor.setNodeByKey(block.key, DEFAULT_NODE);
          }
        });
      } else if (hasListItem) {
        // This case is too complicate, just show warning message
        this.props.onWarning('糟糕！ 這個情況... 有點複雜呀');
      } else {
        // This case is too complicate, just show warning message
        this.props.onWarning('糟糕！ 這個情況... 有點複雜呀');
      }
    } else {
      /**
       *  假設不包含 void block 以及 non-list block，情況會簡單一點：
       *  if (如果原本小孩包含 list item <li>，以及最靠近的 parent 有原本的 type) {
       *    取消原本的 type，轉成 paragraph
       *  }
       *  else if (如果原本小孩包含 list item <li>，但最靠近的 parent 沒有 type) {
       *    那就把原本的取消，包上 type
       * }
       *  else { 剩下的情況，就包上 type }
       */
      // eslint-disable-next-line no-lonely-if
      if (hasListItem && hasType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (hasListItem) {
        editor
          .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type);
      } else {
        editor
          .setBlocks('list-item')
          .wrapBlock(type);
      }
    }
  }

  /**
   * When a non-list block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   */
  onClickNonListBlock = (event, type) => {
    event.preventDefault();
    if (type === 'bulleted-list' || type === 'numbered-list') { return; }

    const editor = this.editor;
    const { value } = this.state;
    const hasListItem = this.hasBlock('list-item');
    const hasVoidBlock = this.hasVoidBlock();
    const isActive = this.hasBlock(type);

    if (hasVoidBlock) {
      /*
        假設包含 void block (image, video, audio)，不能直接 setBlocks，否則資料會不見。
        這邊的做法是跳過 void block，只對其他 block 操作。
      */
      if (hasListItem) {
        editor
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      }
      value.blocks.forEach((block) => {
        if (!this.isVoidBlock(block)) {
          editor.setNodeByKey(block.key, isActive ? DEFAULT_NODE : type);
        }
      });
    } else {
      /**
       *  if (如果原本小孩包含 list item <li>)  { 把原本的 bullted-list & numbered-list unwrap 掉，並設成指定的 type }
       *  if (如果原本就已經是 T) { 還原成 paragraph }
       */
      // eslint-disable-next-line no-lonely-if
      if (hasListItem) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type);
      }
    }
  }

  /**
   * When clicking a link, if the selection has a link in it, remove the link.
   * Otherwise, add a new link with an href and text.
   *
   * @param {Event} event
   */
  onClickLink = (event) => {
    event.preventDefault();

    const { value } = this.state;
    const hasLinks = this.hasLinks();

    if (hasLinks) {
      this.editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      this.setState({
        currentOpenDialog: 'link',
        showTextInput: false,
        dialogUrl: '',
        openInNewWindow: true,
      });
    } else {
      this.setState({
        currentOpenDialog: 'link',
        showTextInput: true,
        dialogUrl: '',
        dialogText: '',
        openInNewWindow: true,
      });
    }
  }

  onOpenLinkEditDialog = (nodeKey) => {
    const node = this.state.value.document.getNode(nodeKey);
    this.setState({
      currentOpenDialog: 'edit-link',
      showTextInput: false,
      dialogUrl: node.data.get('href'),
      openInNewWindow: node.data.get('target') === '_blank',
      editNodeKey: nodeKey,
    });
  }

  onImageUploaded = (response) => {
    if (response && response.url) {
      const hasListItem = this.hasBlock('list-item');
      this.editor.command(insertImage, response.url, hasListItem);
    }
  }

  onClickGiphy = (event) => {
    event.preventDefault();
    this.setState({
      currentOpenDialog: 'giphy',
      dialogValue: '',
    });
  }

  onClickYoutube = (event) => {
    event.preventDefault();
    this.setState({
      currentOpenDialog: 'youtube',
      dialogValue: '',
    });
  }

  onClickVimeo = (event) => {
    event.preventDefault();
    this.setState({
      currentOpenDialog: 'vimeo',
      dialogValue: '',
    });
  }

  onClickMixCloud = (event) => {
    event.preventDefault();
    this.setState({
      currentOpenDialog: 'mixcloud',
      dialogValue: '',
    });
  }

  onInsertTab = (event) => {
    event.preventDefault();
    this.editor.insertText('    ');
  }

  onClickFullScreen = () => {
    this.setState({ fullScreenMode: !this.state.fullScreenMode });
  }

  onClickClearFormat = (event) => {
    event.preventDefault();
    const editor = this.editor;
    const { value } = this.state;
    editor
      .removeMark('bold')
      .removeMark('italic')
      .unwrapInline('link')
      .unwrapBlock('bulleted-list')
      .unwrapBlock('numbered-list');

    value.blocks.forEach((block) => {
      if (!this.isVoidBlock(block)) {
        editor.setNodeByKey(block.key, DEFAULT_NODE);
      }
    });
  }

  /**
   * The event handler while user press certain hot keys
   *
   * @param {Event} event
   * @param {Object} editor - {@link https://docs.slatejs.org/slate-core/editor}
   */
  onKeyDown = (event, editor, next) => {
    let mark;
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isLinkHotKey(event)) {
      this.onClickLink(event);
      return;
    } else if (isTab(event)) {
      this.onInsertTab(event);
      return;
    } else {
      // eslint-disable-next-line
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  }

  /**
   * The event handler while pasting content to slate editor
   *
   * @param {Event} event
   * @param {Object} editor - {@link https://docs.slatejs.org/slate-core/editor}
   */
  onPaste = (event, editor, next) => {
    const transfer = getEventTransfer(event);
    if (transfer.type !== 'html') return next();
    let html = transfer.html;
    if (this.props.normalizePastedValue) {
      html = normalize(transfer.html);
    }
    const { document } = htmlSerializer.deserialize(html);
    this.editor.insertFragment(document);
    return true;
  }

  debounceOnChange = debounce((value) => {
    let serializedValue = this.serializeValue(value);
    // for empty content, it will emit empty string (for back-end)
    if (serializedValue === '<p></p>') {
      serializedValue = '';
    }
    this.setState({ serializedValue });
    this.props.onChange(serializedValue);
  }, this.props.debounceTime);

  /**
   * return the serialized content from document model
   */
  serializeValue = value => htmlSerializer.serialize(value);

  /**
   * check whether the operations will change content or not,
   * to prevent calling serializer on every selection change
   */
  willChangeContent = operations => operations.some(op => op.type !== 'set_selection');

  insertGiphy = (url) => {
    const giphyRegExp = /\/\/giphy\.com\/gifs\/(\w*?-)*?(\w*?)$/;
    if (url && giphyRegExp.test(url)) {
      // generate embed link
      const giphyMatch = url.match(giphyRegExp);
      const src = ['////i.giphy.com/', giphyMatch[2], '.gif'].join('');
      const hasListItem = this.hasBlock('list-item');
      this.editor.command(insertImage, src, hasListItem);
    }
  }

  insertYoutube = (url) => {
    const ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    if (url && ytRegExp.test(url)) {
      // generate embed link
      const ytMatch = url.match(ytRegExp);
      const src = `//www.youtube.com/embed/${ytMatch[1]}`;
      const hasListItem = this.hasBlock('list-item');
      this.editor.command(addIframe, 'video', src, hasListItem);
    }
  }

  insertVimeo = (url) => {
    const vimRegExp = /\/\/(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/;

    if (url && vimRegExp.test(url)) {
      // generate embed link
      const vimMatch = url.match(vimRegExp);
      const src = `//player.vimeo.com/video/${vimMatch[3]}`;
      const hasListItem = this.hasBlock('list-item');
      this.editor.command(addIframe, 'video', src, hasListItem);
    }
  }

  insertMixCloud = (url) => {
    const mixcloudRegExp = /(http:|https:)?\/\/www\.mixcloud\.com\/.*\/.*\//;

    if (url && mixcloudRegExp.test(url)) {
      const src = `https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&amp;feed=${encodeURIComponent(url)}&amp;hide_cover=1&amp;hide_tracklist=1&amp;replace=0`;
      const hasListItem = this.hasBlock('list-item');
      this.editor.command(addIframe, 'audio', src, hasListItem);
    }
  }

  insertLink = (href, text, openInNewWindow) => {
    const editor = this.editor;
    if (href) {
      if (text) {
        editor
          .insertText(text)
          // 移動移標來選取字，來新增超連結 @see {@link https://docs.slatejs.org/slate-core/commands#move-point-forward}
          .moveFocusForward(0 - text.length)
          .command(wrapLink, href, openInNewWindow);
      } else {
        editor.command(wrapLink, href, openInNewWindow);
      }
    }
  }

  editLink = (nodeKey, href, openInNewWindow) => {
    this.editor.command(setLinkByKey, nodeKey, href, openInNewWindow);
  }

  /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   * @return {Boolean}
   */
  hasMark = (type) => {
    const { value } = this.state;
    // @see {@link https://docs.slatejs.org/slate-core/value#activemarks}
    return value.activeMarks.some(mark => mark.type === type);
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   * @return {Boolean}
   */
  hasBlock = (type) => {
    const { value } = this.state;
    // @see {@link https://docs.slatejs.org/slate-core/value#blocks}
    return value.blocks.some(node => node.type === type);
  }

  /**
   * Check whether the current selection has a link in it.
   *
   * @return {Boolean} hasLinks
   */
  hasLinks = () => {
    const { value } = this.state;
    // @see {@link https://docs.slatejs.org/slate-core/value#inlines}
    return value.inlines.some(inline => inline.type === 'link');
  }

  /**
   * Check whether the current selection has a void block (image, video, audio) in it.
   * @return {Boolean} hasVoidBlock
   */
  hasVoidBlock = () => this.state.value.blocks.some(block => this.isVoidBlock(block));

  /**
   * Check whether this block is a void block or not.
   * @return {Boolean} isVoidBlock
   */
  isVoidBlock = block => ['image', 'video', 'audio'].indexOf(block.type) >= 0;

  /**
   * Check whether the current selection has a non-list block (heading-four,
   * block-quote, pre) in it.
   * @return {Boolean} hasNonListBlock
   */
  hasNonListBlock = () => this.state.value.blocks.some(block => this.isNonListBlock(block));

  /**
   * Check whether this block is a non-list block or not.
   * @return {Boolean} isVoidBlock
   */
  isNonListBlock = block => ['heading-four', 'block-quote', 'pre'].indexOf(block.type) >= 0;

  /**
   * Render block and inline nodes.
   *
   * @param {Object} nodeProps
   * @param {Object} nodeProps.attributes - {@link https://docs.slatejs.org/slate-react/custom-nodes#attributes}
   * @param {Object} nodeProps.children - {@link https://docs.slatejs.org/slate-react/custom-nodes#children}
   * @param {Node} nodeProps.node - {@link https://docs.slatejs.org/slate-react/custom-nodes#node}
   * @param {boolean} nodeProps.isSelected - {@link https://docs.slatejs.org/slate-react/custom-nodes#isselected}
   * @return {Element}
   */
  renderNode = (nodeProps, editor, next) => {
    const { attributes, children, node, isSelected } = nodeProps;
    switch (node.type) {
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>;
      case 'heading-four': return <h4 {...attributes}>{children}</h4>;
      case 'list-item': return <li {...attributes}>{children}</li>;
      case 'numbered-list': return <ol {...attributes}>{children}</ol>;
      case 'paragraph': return <p {...attributes}>{children}</p>;
      case 'pre': return <pre {...attributes}>{children}</pre>;
      case 'audio':
      case 'video': return <Iframe type={node.type} {...nodeProps} />;
      case 'link': return (
        <Link
          node={node}
          attributes={attributes}
          isSelected={isSelected}
          onOpenEditDialog={this.onOpenLinkEditDialog}
          onRemoveLink={this.onClickLink}
        >{children}
        </Link>
      );
      case 'image': {
        const src = node.data.get('src');
        const className = isSelected ? 'active' : null;
        const style = { display: 'block' };
        return <img alt="img" src={src} className={className} style={style} {...attributes} />;
      }
      case 'test': {
        const className = node.data.get('className');
        return <test className={className}>{children}</test>;
      }
      default: return next();
    }
  }

  /**
   * Render mark
   *
   * @param {Object} nodeProps
   * @param {Object} nodeProps.children - {@link https://docs.slatejs.org/slate-react/custom-nodes#children}
   * @param {Mark} nodeProps.mark - {@link https://docs.slatejs.org/slate-core/mark}
   * @return {Element}
   */
  renderMark = (nodeProps, editor, next) => {
    const { children, mark } = nodeProps;
    switch (mark.type) {
      case 'bold': return <b>{children}</b>;
      case 'italic': return <i>{children}</i>;
      default: return next();
    }
  }

  /**
   * Render a mark-toggling toolbar button.
   *
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   * @param {Element} icon - react element to be shown as button icon
   * @return {Element}
   */
  renderMarkButton = (type, icon, tooltipText) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);
    return (
      <Tooltip placement="bottom" overlay={tooltipText}>
        <button
          type="button"
          className="button btn btn-default btn-sm"
          onMouseDown={onMouseDown}
          data-active={isActive}
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  /**
   * Render a block-toggling toolbar button.
   *
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   * @param {Element} icon - react element to be shown as button icon
   * @return {Element}
   */
  renderBlockButton = (type, icon, tooltipText) => {
    const isActive = this.hasBlock(type);
    const onMouseDown = event => this.onClickNonListBlock(event, type);
    return (
      <Tooltip placement="bottom" overlay={tooltipText}>
        <button
          type="button"
          className="button btn btn-default btn-sm"
          onMouseDown={onMouseDown}
          data-active={isActive}
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  /**
   * Render a block-toggling toolbar button for numbered-list and bulleted-list
   *
   * @param {String} type - custom name of node type defined by ourselves,
   *                        just for understanding. e.g. paragraph, block-quote.
   * @param {Element} icon - react element to be shown as button icon
   * @return {Element}
   */
  renderListButton = (type, icon, tooltipText) => {
    const { value } = this.state;
    const { document } = value;
    const isActive = value.blocks.some(block => !!document.getClosest(
      block.key,
      parent => parent.type === type,
    ));
    const onMouseDown = event => this.onClickList(event, type);
    return (
      <Tooltip placement="bottom" overlay={tooltipText}>
        <button
          type="button"
          className="button btn btn-default btn-sm"
          onMouseDown={onMouseDown}
          data-active={isActive}
        >
          {icon}
        </button>
      </Tooltip>
    );
  }

  renderLinkButton = () => {
    const hasLinks = this.hasLinks();
    return (
      <Tooltip placement="bottom" overlay="超連結">
        <button
          type="button"
          className="button btn btn-default btn-sm"
          onMouseDown={this.onClickLink}
          data-active={hasLinks}
        >
          <FontAwesome name="link" />
        </button>
      </Tooltip>
    );
  }

  /**
   * Render a button
   *
   * @param {function} onMouseDown - callback function while user mouse down the button
   * @param {Element} icon - react element to be shown as button icon
   * @return {Element}
   */
  renderButton = (onMouseDown, icon, tooltipText) => {
    const mouseDown = event => onMouseDown(event);
    return (
      <Tooltip placement="bottom" overlay={tooltipText}>
        <button
          type="button"
          className="button btn btn-default btn-sm"
          onMouseDown={mouseDown}
        >
          {icon}
        </button>
      </Tooltip>
    );
  };

  renderFullScreenButton = () => (
    <Tooltip placement="bottom" overlay="全螢幕">
      <button
        type="button"
        className="button btn btn-default btn-sm full-screen-btn"
        onClick={this.onClickFullScreen}
      >
        <FontAwesome name="arrows-alt" />
      </button>
    </Tooltip>
  )

  renderImageUploadButton = () => (
    <Tooltip placement="bottom" overlay="圖片">
      <UploadContainer
        onUpload={this.props.uploadImage}
        fulfilledCallback={this.onImageUploaded}
        onValidateFailed={null}
        validate={null}
        accept="image/*"
        type="button"
        className="no-style-container button btn btn-default btn-sm"
      >
        <FontAwesome name="picture-o" />
      </UploadContainer>
    </Tooltip>
  );

  renderClearFormatButton = () => (
    <Tooltip placement="bottom" overlay="清除格式">
      <button
        type="button"
        className="button btn btn-default btn-sm"
        onClick={this.onClickClearFormat}
      >
        <img src={clearIcon} alt="clear format icon" />
      </button>
    </Tooltip>
  );

  renderToolbar = () => (
    <div className="toolbar-menu">
      <div className="button-group">
        <div className="flex">
          {this.renderMarkButton('bold', <FontAwesome name="bold" />, '粗體 (⌘+B)', 'bold-button')}
          {this.renderMarkButton('italic', <FontAwesome name="italic" />, '斜體 (⌘+I)', 'italic-button')}
          {this.renderBlockButton('pre', <FontAwesome name="code" />, '程式碼區塊', 'code-button')}
          {this.renderBlockButton('heading-four', <FontAwesome name="header" />, '標題', 'heading-button')}
          {this.renderBlockButton('block-quote', <FontAwesome name="quote-right" />, '引用區塊', 'blockquote-button')}
          {this.renderClearFormatButton()}
        </div>
      </div>
      <div className="button-group">
        <div className="flex">
          {this.renderListButton('numbered-list', <FontAwesome name="list-ol" />, '編號清單', 'numbered-list-button')}
          {this.renderListButton('bulleted-list', <FontAwesome name="list" />, '項目清單', 'bulleted-list-button')}
        </div>
      </div>
      <div className="button-group">
        <div className="flex">
          {this.renderLinkButton()}
          {this.renderImageUploadButton()}
          {this.renderButton(this.onClickGiphy, <FontAwesome name="giphy" />, 'Giphy', 'giphy-button')}
          {this.renderButton(this.onClickYoutube, <FontAwesome name="youtube-play" />, 'Youtube', 'youtube-button')}
          {this.renderButton(this.onClickVimeo, <FontAwesome name="vimeo-square" />, 'Vimeo', 'vimeo-button')}
          {this.renderButton(this.onClickMixCloud, <FontAwesome name="mixcloud" />, 'Mixcloud', 'mixcloud-button')}
        </div>
      </div>
      {this.renderFullScreenButton()}
    </div>
  )

  /**
   * Render editing area of slate editor
   */
  renderEditor = () => (
    <div className="editing-area">
      <Editor
        className="slate-editor"
        ref={this.ref}
        value={this.state.value}
        schema={schema}
        onChange={this.onChange}
        onPaste={this.onPaste}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        plugins={plugins}
      />
    </div>
  )

  renderInputDialogs = () => {
    const onChange = event => this.setState({ dialogValue: event.target.value });
    const onChangeUrl = e => this.setState({ dialogUrl: e.target.value });
    const onChangeText = e => this.setState({ dialogText: e.target.value });
    const onChangeOpenInNewWindow = e => this.setState({ openInNewWindow: e.target.checked });
    /** This is a workaround solution：在關閉 Dialog 的那瞬間不知道為什麼
     * 不能同時改變 editor 的值，所以這邊讓 Dialog 晚點關閉。 */
    const onClose = () => {
      window.setTimeout(() => {
        this.setState({ currentOpenDialog: null });
      }, 100);
    };
    const { currentOpenDialog } = this.state;
    switch (currentOpenDialog) {
      case 'giphy':
        return (
          <InputDialog
            title="請輸入 Giphy 網址"
            text="範例：https://giphy.com/gifs/oooxxx"
            value={this.state.dialogValue}
            isOpen
            validate={editorJoiSchema.giphyUrl}
            onChange={onChange}
            onClose={onClose}
            onSubmit={() => {
              this.insertGiphy(this.state.dialogValue);
              onClose();
            }}
          />
        );
      case 'youtube':
        return (
          <InputDialog
            title="請輸入 Youtube 網址"
            text="範例：https://www.youtube.com/watch?v=oooxxx 或 https://youtu.be/oooxxx 或 https://www.youtube.com/embed/oooxxx"
            value={this.state.dialogValue}
            isOpen
            validate={editorJoiSchema.youtubeUrl}
            onChange={onChange}
            onClose={onClose}
            onSubmit={() => {
              this.insertYoutube(this.state.dialogValue);
              onClose();
            }}
          />
        );
      case 'vimeo':
        return (
          <InputDialog
            title="請輸入 Vimeo 網址"
            text="範例：https://vimeo.com/12345678 或 https://player.vimeo.com/video/12345678"
            value={this.state.dialogValue}
            isOpen
            validate={editorJoiSchema.vimeoUrl}
            onChange={onChange}
            onClose={onClose}
            onSubmit={() => {
              this.insertVimeo(this.state.dialogValue);
              onClose();
            }}
          />
        );
      case 'mixcloud':
        return (
          <InputDialog
            title="請輸入 MixCloud 網址"
            text="範例：https://www.mixcloud.com/ooo/xxx/"
            value={this.state.dialogValue}
            isOpen
            validate={editorJoiSchema.mixCloudUrl}
            onChange={onChange}
            onClose={onClose}
            onSubmit={() => {
              this.insertMixCloud(this.state.dialogValue);
              onClose();
            }}
          />
        );
      case 'link':
        return (
          <LinkInputDialog
            isOpen
            showTextInput={this.state.showTextInput}
            title="插入連結"
            url={this.state.dialogUrl}
            text={this.state.dialogText}
            openInNewWindow={this.state.openInNewWindow}
            urlValidate={editorJoiSchema.url}
            textValidate={editorJoiSchema.text}
            onChangeUrl={onChangeUrl}
            onChangeText={onChangeText}
            onChangeOpenInNewWindow={onChangeOpenInNewWindow}
            onClose={onClose}
            onSubmit={() => {
              this.insertLink(
                this.state.dialogUrl,
                this.state.dialogText,
                this.state.openInNewWindow,
              );
              onClose();
            }}
          />
        );
      case 'edit-link':
        return (
          <LinkInputDialog
            isOpen
            showTextInput={this.state.showTextInput}
            title="編輯連結"
            url={this.state.dialogUrl}
            text={this.state.dialogText}
            openInNewWindow={this.state.openInNewWindow}
            urlValidate={editorJoiSchema.url}
            textValidate={editorJoiSchema.text}
            onChangeUrl={onChangeUrl}
            onChangeText={onChangeText}
            onChangeOpenInNewWindow={onChangeOpenInNewWindow}
            onClose={onClose}
            onSubmit={() => {
              this.editLink(
                this.state.editNodeKey,
                this.state.dialogUrl,
                this.state.openInNewWindow,
              );
              onClose();
            }}
          />
        );
      default:
        return null;
    }
  }

  // this is only for debugging
  renderLogButton = () => (
    <button onClick={(event) => {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log('serialized state', this.serializeValue(this.state.value));
      // eslint-disable-next-line no-console
      console.log('state:', this.state.value.toJSON());
    }}
    >
      Log
    </button>
  );

  render() {
    return (
      <GlobalStyleDiv className={this.props.className}>
        <StyledSlateEditor
          className="slate-editor"
          fullScreenMode={this.state.fullScreenMode}
          height={this.props.height}
          error={Boolean(this.props.errorMessage)}
        >
          <div className={this.state.fullScreenMode ? 'slate-full-screen-mode' : ''}>
            {this.renderToolbar()}
            {this.renderEditor()}
            {this.renderInputDialogs()}
            {this.props.debugMode ? this.renderLogButton() : null}
          </div>
        </StyledSlateEditor>
        {this.props.errorMessage ?
          <ErrorMessage>
            <FontAwesome name="exclamation-triangle" />
            {this.props.errorMessage}
          </ErrorMessage> : null
        }
      </GlobalStyleDiv>
    );
  }
}

export default SlateEditor;
