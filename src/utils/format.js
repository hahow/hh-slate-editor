/**
 * Shorten the href for displaying. E.g. http://123456789012345678901234567890 -> http://1234...7890
 * @param {*} href original href string
 * @param {*} leftMax left-most maximum length (default=10)
 * @param {*} rightMax right-most maximum legnth (default=10)
 */
export function shortenHref(href, leftMax = 20, rightMax = 20) {
  if (!href) { return null; }
  if (href.length > leftMax + rightMax) {
    return `${href.slice(0, leftMax)}...${href.slice(-1 * rightMax)}`;
  }
  return href;
}
