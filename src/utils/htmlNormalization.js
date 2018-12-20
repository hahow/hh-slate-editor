
/**
 * This file is for normalizing html string to "slate-acceptable" htm string.
 * It mainly relies on DOMParser, so it may have some browser compatibility issue.
 * Usually it traverse the whole DOM tree for normalization.
 *
 * What is "slate-acceptable" html string ?
 *   In slate editor, they assume the document structure of whole DOM tree. According
 *   to slate core rule, some nodes will be removed if it doesn't follow those rules.
 *   In order to prevent some contents from removing, we need to normalize the orininal
 *   DOM tree as slate-acceptable DOM tree.
 *   For details of slate core rules. Please see:
 *   1. https://docs.slatejs.org/guides/data-model#documents-and-nodes
 *   2. https://github.com/ianstormtaylor/slate/blob/master/packages/slate/src/constants/core-schema-rules.js
 *
 *   However, changing the structure of DOM tree of course leads to changing how it looks.
 *   So we try to apply different normalization algorigthm for different structure, trying to
 *   keep looking like identical to original ones.
 */

const BLOCK_NODES = ['h4', 'blockquote', 'li', 'ul', 'ol', 'iframe', 'p', 'pre', 'img'];
const INLINE_NODDES = ['a'];
const MARK_NODES = ['b', 'i'];

function isBlockNode(nodeName) {
  return BLOCK_NODES.indexOf(nodeName) >= 0;
}

function isInlineNode(nodeName) {
  return INLINE_NODDES.indexOf(nodeName) >= 0;
}

function isMarkNode(nodeName) {
  return MARK_NODES.indexOf(nodeName) >= 0;
}

function getNodeName(node) {
  return node.nodeName.toLowerCase();
}

/**
 * Remove all new lines characters (\n) in html, except those inside <pre></pre>.
 * The algorithm is scanning whole string from beginning to end, and using stack to
 * remember how many <pre> layers we are in at current scanning. Recording all new
 * newline characters position inside <pre> tag, then remove all the other newline
 * characters.
 * E.g. <p>\n<pre>\n<pre>\n</pre></pre>  -> <p><pre>\n<pre>\n</pre></pre>
 */
function removeNewLineChars(html) {
  if (!html) { return html; }
  const notRemovePos = []; // not to remove positions
  const stack = [];
  let currentPos = 0;
  // scanning from beginning
  while (currentPos < html.length) {
    // if current layer is zero (not inside <pre> tag)
    if (stack.length === 0) {
      // find the possible next <pre> tag opening
      const start = html.indexOf('<pre', currentPos);
      if (start >= 0) {
        stack.push(start);
        currentPos = start + 1;
      } else {
        currentPos = html.length;
      }
    } else if (stack.length > 0) { // current layer is larger than zero (inside <pre> tag)
      // find the possible next <pre> tag opening or </pre> ending
      const start = html.indexOf('<pre', currentPos);
      const end = html.indexOf('</pre', currentPos);
      if (start >= 0 && end >= 0) {
        if (start < end) {
          stack.push(start);
          currentPos = start + 1;
        } else {
          notRemovePos.push({
            start: stack.pop(),
            end,
          });
          currentPos = end + 1;
        }
      } else if (start >= 0 && end < 0) {
        stack.push(start);
        currentPos = start + 1;
      } else if (start < 0 && end >= 0) {
        notRemovePos.push({
          start: stack.pop(),
          end,
        });
        currentPos = end + 1;
      } else {
        currentPos = html.length;
      }
    }
  }

  if (stack.length !== 0) {
    // eslint-disable-next-line no-console
    console.error('>>>>>>>> <pre> tag was not in pairs');
    return html;
  }

  if (notRemovePos.length > 0) {
    let result = '';
    currentPos = 0;
    for (let i = 0; i < notRemovePos.length; i += 1) {
      const { start, end } = notRemovePos[i];
      const tmp = html.substring(currentPos, start).replace(/\n/g, '');
      result += tmp;
      result += html.substring(start, end);
      currentPos = end;
    }
    result += html.substring(currentPos, html.length).replace(/\n/g, '');
    return result;
  }
  return html.replace(/\n/g, '');
}

/**
 * Recursively normalize the whole DOM tree in pre-order (starting from root)
 * At each step(node), it will directly apply the normalization for the whole sub-tree.
 * @param {Object} root the root of DOM tree to be normalized
 * @param {Function} normalize the function to normalize the subtree
 */
function normalizeDOMTree(root, normalize) {
  if (!root) return null;
  let node = root;
  let rootRemoved = false;

  // normalize the current root
  rootRemoved = normalize(node);

  // recursively run child nodes
  if (!rootRemoved && root.childNodes) {
    for (let i = 0; i < root.childNodes.length; i += 1) {
      node = root.childNodes[i];
      const childRootRemoved = normalizeDOMTree(node, normalize);
      if (childRootRemoved) {
        i -= 1;
      }
    }
  }
  return rootRemoved;
}

/**
 * Remove all space-only text nodes inside block nodes.
 * E.g. <p>123</p><p> </p>  -->  <p>123</p><p></p>
 */
function blockEmptyTextNormalize(root) {
  if (!root) return false;
  const nodeName = getNodeName(root);

  // if parent node is a block node
  if (isBlockNode(nodeName)) {
    // the array of text node to be removed
    const toRemove = [];
    for (let i = 0; i < root.childNodes.length; i += 1) {
      const n = root.childNodes[i];
      const name = getNodeName(n);
      if (name === '#text') {
        const tmp = n.nodeValue.replace(/ /g, '');
        if (tmp.length === 0) {
          toRemove.push(n);
        }
      }
    }
    toRemove.forEach(n => root.removeChild(n));
  }
  return false;
}

/**
 * Calculate the number of block & non-block nodes in childNodes.
 * E.g. <p><a>123</a>234<blockquote>345</blockquote></p>
 *      --> { nBlock: 1, nNonBlock: 2 } for <p> node
 * because <a> is line (non-block), 234 is text (non-block), <blockquote> is block
 * This is just a utility function for other functions
 */
function calcChildNodeTypeNum(root) {
  let nBlock = 0;
  let nNonBlock = 0;
  for (let i = 0; i < root.childNodes.length; i += 1) {
    const name = getNodeName(root.childNodes[i]);
    if (isBlockNode(name)) {
      nBlock += 1;
    } else {
      nNonBlock += 1;
    }
  }
  return { nBlock, nNonBlock };
}

/**
 * Just an function for repeating procedure
 */
function createNodeAndInsertAfter(root, rootNextSibling, nodeName, childNodes) {
  const newNode = document.createElement(nodeName);
  childNodes.forEach((n) => { newNode.appendChild(n); });
  root.parentNode.insertBefore(newNode, rootNextSibling);
}

/**
 * When there are non-blocks / block child nodes inside block node: <li> or <blockquote>
 * 1. Wrap parent tag for the first child nodes (block/non-block)
 * 2. Wrap <p> for rest "non-block" child nodes.
 * 3. No wrap for rest "block" node.
 *  E.g.
 *       li                   li    p    p
 *    /   |   \                |    |    |
 *   p  text inline   ===>     p  text inline
 *                             ↑    ↑    ↑
 *                      only wrap <li> for first child. wrap <p> for rest non-block
 *
 *  E.g.
 *        li                   li   p    p
 *    /   |   \                |         |
 *  text  p  inline    ===>   text     inline
 *                                  ↑
 *                         no wrap for block node
 *
 *  E.g.
 *       blockquote              blockquote   pre   p
 *       /   |   \                    |             |
 *  inline  pre   text  ===>       inline          text
 *                                             ↑
 *                                   no wrap for block node
 */
function wrapFirstNormalize(root) {
  if (!root) return false;
  const nodeName = getNodeName(root);
  if (['li', 'blockquote'].indexOf(nodeName) >= 0) {
    const { nBlock, nNonBlock } = calcChildNodeTypeNum(root);
    if (nNonBlock > 0 && nBlock > 0) {
      const rootNextSibling = root.nextSibling;
      let newNodeName = nodeName;
      let childNodes = [];
      let current = root.childNodes[0];
      let next = current ? current.nextSibling : null;
      while (current !== null) {
        const name = getNodeName(current);
        if (isBlockNode(name)) {
          if (childNodes.length > 0) {
            createNodeAndInsertAfter(root, rootNextSibling, newNodeName, childNodes);
            childNodes = [];
            newNodeName = 'p';
          }
          if (newNodeName === nodeName) {
            createNodeAndInsertAfter(root, rootNextSibling, newNodeName, [current]);
            newNodeName = 'p';
          } else {
            root.parentNode.insertBefore(current, rootNextSibling);
          }
        } else {
          childNodes.push(current);
        }
        current = next;
        next = next ? next.nextSibling : null;
      }
      // for last groups of non-block nodes
      if (childNodes.length > 0) {
        createNodeAndInsertAfter(root, rootNextSibling, newNodeName, childNodes);
      }
      root.parentNode.removeChild(root);
      return true;
    }
  }
  return false;
}

/**
 * When there are non-blocks / block child nodes inside block node: <h4>
 * 1. Wrap parent tag for the last non-block child nodes
 * 2. Wrap <p> for rest "non-block" child nodes.
 * 3. No wrap for rest "block" node.
 *
 *  E.g.
 *        h4                   p    p   h4
 *    /   |   \                |         |
 *  text  p  inline    ===>   text     inline
 *                                       ↑
 *                        only wrap <h4> for last non-block child.
 */
function wrapLastNormalize(root) {
  if (!root) return false;
  const nodeName = getNodeName(root);
  if (nodeName === 'h4') {
    const { nBlock, nNonBlock } = calcChildNodeTypeNum(root);
    if (nNonBlock > 0 && nBlock > 0) {
      const rootNextSibling = root.nextSibling;
      let newNodeName = 'p';
      let childNodes = [];
      let current = root.childNodes[0];
      let next = current ? current.nextSibling : null;
      while (current !== null) {
        const name = getNodeName(current);
        if (isBlockNode(name)) {
          if (childNodes.length > 0) {
            createNodeAndInsertAfter(root, rootNextSibling, newNodeName, childNodes);
            childNodes = [];
          }
          if (next === null) {
            newNodeName = 'h4';
            createNodeAndInsertAfter(root, rootNextSibling, newNodeName, [current]);
          } else {
            root.parentNode.insertBefore(current, rootNextSibling);
          }
        } else {
          childNodes.push(current);
        }
        current = next;
        next = next ? next.nextSibling : null;
      }
      // for last groups of non-block nodes
      if (childNodes.length > 0) {
        newNodeName = 'h4';
        createNodeAndInsertAfter(root, rootNextSibling, newNodeName, childNodes);
      }
      root.parentNode.removeChild(root);
      return true;
    }
  }
  return false;
}

/**
 * Basically identical to calcChildNodeTypeNum, the only difference is to skip mark node.
 * (<b> and <i>).
 *
 * E.g. <p><b><i>123</i></b>/<p> will be viewed as   p
 *                                                   |
 *                                                  text
 * Mark ndoe is basically ignored in document tree
 */
// eslint-disable-next-line camelcase
function calcChildNodeTypeNum_SkipMark(root) {
  let layer = 1;
  let current = root.childNodes[0];
  let currentParent = root;
  let next;
  let nBlock = 0;
  let nNonBlock = 0;
  while (layer > 0 && current) {
    const name = getNodeName(current);
    if (isMarkNode(name)) {
      layer += 1;
      currentParent = current;
      current = current.childNodes[0];
      // eslint-disable-next-line
      continue;
    } else if (isBlockNode(name)) {
      nBlock += 1;
    } else {
      nNonBlock += 1;
    }

    next = current.nextSibling;
    while (next === null && layer > 0) {
      layer -= 1;
      currentParent = current.parentNode;
      current = current.parentNode;
      next = currentParent.nextSibling;
    }
    current = next;
  }
  return { nBlock, nNonBlock };
}

/**
 * Basically identical to createNodeAndInsertAfter, the only difference is to skip mark node.
 * (<b> and <i>).
 */
// eslint-disable-next-line camelcase
function createNodeAndInsertAfter_SkipMark(root, rootNextSibling, stack, childNodes) {
  if (!stack || stack.length === 0) { return; }
  const newNode = document.createElement(stack[0]);
  let current = newNode;
  for (let i = 1; i < stack.length; i += 1) {
    current.appendChild(document.createElement(stack[i]));
    current = current.childNodes[0];
  }
  childNodes.forEach((n) => { current.appendChild(n); });
  root.parentNode.insertBefore(newNode, rootNextSibling);
}

/**
 * When there are non-blocks / block child nodes inside block node <p>, <pre>
 * 1. Wrap <p> tag for the every non-block child nodes
 * 2. No wrap for block node.
 *
 *  E.g.
 *       pre                  p   img   p
 *    /   |   \               |         |
 *  text img  inline    ===> text     inline
 *                            ↑         ↑
 *                 wrap <p> for every non-block child nodes
 *
 * Besides, when we see mark node, it will be ignored in document structure.
 *
 * E.g.
 *        p                   p   img   p
 *    /   |   \               |         |
 *  mark img mark           mark      mark
 *   |        |     ===>      |         |
 *  text     mark           text      mark
 *            |                         |
 *          inline                    inline
 *  ↑         ↑
 * Mark node was actually ignored in slate document model, it will viewed as:
 *        p
 *    /   |   \
 *  text img inline
 */
// eslint-disable-next-line camelcase
function wrapNonBlockNormalize_SkipMark(root) {
  if (!root) return false;
  const nodeName = getNodeName(root);
  if (['p', 'pre'].indexOf(nodeName) >= 0) {
    const { nBlock, nNonBlock } = calcChildNodeTypeNum_SkipMark(root);
    if (nNonBlock > 0 && nBlock > 0) {
      const rootNextSibling = root.nextSibling;
      let childNodes = [];
      let current = root.childNodes[0];
      let parent = root;
      let next = current ? current.nextSibling : null;
      let layer = 1;
      const stack = ['p'];

      while (layer > 0 && current) {
        const name = getNodeName(current);
        if (isBlockNode(name)) {
          if (childNodes.length > 0) {
            createNodeAndInsertAfter_SkipMark(root, rootNextSibling, stack, childNodes);
            childNodes = [];
          }
          root.parentNode.insertBefore(current, rootNextSibling);
        } else if (isMarkNode(name)) {
          const childNodeTypeNum = calcChildNodeTypeNum_SkipMark(current);
          if (childNodeTypeNum.nBlock > 0 && childNodeTypeNum.nNonBlock === 0) {
            if (childNodes.length > 0) {
              createNodeAndInsertAfter_SkipMark(root, rootNextSibling, stack, childNodes);
              childNodes = [];
            }
            stack.push(name);
            layer += 1;
            parent = current;
            current = current.childNodes[0];
            next = current ? current.nextSibling : null;
            // eslint-disable-next-line
            continue;
          } else if (childNodeTypeNum.nBlock === 0 && childNodeTypeNum.nNonBlock > 0) {
            childNodes.push(current);
          } else {
            // eslint-disable-next-line no-console
            console.error('Currently cannot deal with this problem: Block and non-block nodes in mark node');
          }
        } else {
          childNodes.push(current);
        }

        if (next !== null) {
          current = next;
          next = next.nextSibling;
        } else {
          if (childNodes.length > 0) {
            createNodeAndInsertAfter_SkipMark(root, rootNextSibling, stack, childNodes);
            childNodes = [];
          }
          layer -= 1;
          stack.pop();
          current = parent.nextSibling;
          next = current ? current.nextSibling : null;
        }
      }

      // for last groups of non-block nodes
      if (childNodes.length > 0) {
        createNodeAndInsertAfter_SkipMark(root, rootNextSibling, stack, childNodes);
      }
      root.parentNode.removeChild(root);
      return true;
    }
  }
  return false;
}

/**
 * When there are block nodes under inline nodes. Raise block node outside inline node.
 * E.g.  (<a> is inline node, <img> is block node)
 *        a                  a   img  a
 *    /   |   \     ====>    |        |
 *  text img text           text     text
 */
function blockInInlineNormalize(root) {
  if (!root) return false;
  const rootNodeName = getNodeName(root);
  if (isInlineNode(rootNodeName)) {
    const { nBlock } = calcChildNodeTypeNum(root);
    if (nBlock > 0) {
      const rootNextSibling = root.nextSibling;
      let childNodes = [];
      let current = root.childNodes[0];
      let next = current ? current.nextSibling : null;
      while (current !== null) {
        const name = getNodeName(current);
        if (isBlockNode(name)) {
          if (childNodes.length > 0) {
            createNodeAndInsertAfter(root, rootNextSibling, rootNodeName, childNodes);
            childNodes = [];
          }
          root.parentNode.insertBefore(current, rootNextSibling);
        } else {
          childNodes.push(current);
        }
        current = next;
        next = next ? next.nextSibling : null;
      }
      // for last groups of non-block nodes
      if (childNodes.length > 0) {
        createNodeAndInsertAfter(root, rootNextSibling, rootNodeName, childNodes);
      }
      root.parentNode.removeChild(root);
      return true;
    }
  }
  return false;
}

/**
 * Utility function to check whether <p> is empty
 */
function isEmptyP(node) {
  if (!node) { return false; }
  const nodeName = getNodeName(node);
  if (nodeName === 'p') {
    if (node.childNodes.length === 0) { return true; }
    if (node.childNodes.length === 1) {
      const childNode = node.childNodes[0];
      if (getNodeName(childNode) === '#text' && childNode.nodeValue === '') { return true; }
    }
  }
  return false;
}

/**
 * If there are multiple empty p in one node, then normalize them into one empty <p>
 * E.g.
 *     node                  node
 *   / |  | \ \             /  |  \
 *  p  p  p  p p   ====>   p   p   p
 *        |                   |
 *       text                text
 */
function multipleEmptyPNormalize(root) {
  if (!root) return false;
  let toRemove = [];
  let emptyPList = [];
  let current = root.childNodes[0];
  while (current) {
    if (isEmptyP(current)) {
      emptyPList.push(current);
    } else if (emptyPList.length >= 2) {
      toRemove = toRemove.concat(emptyPList.slice(0, -1));
      emptyPList = [];
    } else {
      emptyPList = [];
    }
    current = current.nextSibling;
  }
  toRemove.forEach(n => root.removeChild(n));
  return false;
}

/**
 * Remove the <br> inside the node if:
 * 1. The node has at least 2 childs
 * 2. <br> is the last child of its parent
 */
function brNormalize(root) {
  if (!root) return false;
  if (root.childNodes.length >= 2) {
    const lastChild = root.childNodes[root.childNodes.length - 1];
    const nodeName = getNodeName(lastChild);
    if (nodeName === 'br') {
      root.removeChild(lastChild);
    }
  }
  return false;
}

const normalize = (html) => {
  const newHtml = removeNewLineChars(html);
  const parsed = new DOMParser().parseFromString(newHtml, 'text/html');

  normalizeDOMTree(parsed.body, brNormalize);
  normalizeDOMTree(parsed.body, multipleEmptyPNormalize);
  normalizeDOMTree(parsed.body, blockEmptyTextNormalize);
  normalizeDOMTree(parsed.body, blockInInlineNormalize);
  normalizeDOMTree(parsed.body, wrapFirstNormalize);
  normalizeDOMTree(parsed.body, wrapLastNormalize);
  normalizeDOMTree(parsed.body, wrapNonBlockNormalize_SkipMark);

  return parsed.body.innerHTML;
};

export default normalize;
