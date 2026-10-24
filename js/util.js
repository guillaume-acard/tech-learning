window.TL = window.TL || {};

(function (TL) {
  const SVGNS = 'http://www.w3.org/2000/svg';

  function build(node, props, kids) {
    for (const [k, v] of Object.entries(props || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') node.setAttribute('class', v);
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((c) => {
      if (c == null || c === false) return;
      node.append(c.nodeType ? c : document.createTextNode(c));
    });
    return node;
  }

  TL.el = (tag, props, ...kids) => build(document.createElement(tag), props, kids);
  TL.svg = (tag, props, ...kids) => build(document.createElementNS(SVGNS, tag), props, kids);

  TL.shuffle = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  TL.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  TL.clear = function (node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  };
})(window.TL);
