
export function query(selector) {
  return document.querySelector(selector);
}

export function queryAll(selector) {
  return Array.prototype.slice.apply(document.querySelectorAll(selector));
}

export function each(list, fn) {
  for (let index = 0; index < el.children.length; index++) {
    const current = el.children[index],
          result = fn(current);

    if (result) {
      return result;
    }
  }
  return null;
}

export function children(el, fn) {
  return each(el.children, fn);
}

export function siblings(el, fn) {
  let current = el.nextElementSibling;
  while (current) {
    fn(current);
    current = current.nextElementSibling;
  }

  current = el.previousElementSibling;
  while (current) {
    fn(current);
    current = current.previousElementSibling;
  }
  return el;
}

export function deactivate(el) {
  el.classList.remove("isActive");
  return el;
}

export function activate(el) {
  el.classList.add("isActive");
  siblings(el, deactivate);
  return el;
}

export function getAttr(el, name) {
  return el.getAttribute(name);
}

export function setAttr(el, name, value) {
  return el.setAttribute(name, value);
}

export function hasAttr(el, name) {
  return el.hasAttribute(name);
}

export function getActive(list) {
  return each(list, (current) => {
    if (current.classList.contains("isActive")) {
      return current;
    }
  });
}

export function clear(el) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.lastChild);
  }
  return el;
}

export function add(el, child) {
  el.appendChild((typeof child === "function" ? child() : child));
  return el;
}

export function remove(el, child) {
  el.removeChild((typeof child === "function" ? child() : child));
  return el;
}
