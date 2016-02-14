import d3 from "d3";
import {config} from "./config";

export function rect(el) {
  return el.getBoundingClientRect();
}

export function wrap(text, tag) {
  return "<" + tag + ">" + text + "</" + tag + ">";
}

export function html(el, v) {
  el.innerHTML = v;
  return el;
}

export function timeline(el, fn) {
  const progress = el,
        fill = query(".Timeline__fill", progress),
        mark = query(".Timeline__mark", progress);

  let isAuto = true, autoValue = 0, autoRestoreId = null;
  function autoOff(restoreTime = 5000) {
    isAuto = false;

    if (autoRestoreId) {
      clearTimeout(autoRestoreId);
    }

    autoRestoreId = setTimeout(() => {
      if (isAuto === false) {
        isAuto = true;
        window.requestAnimationFrame(animate);
      }
    }, restoreTime);
  }

  function updateValue(value) {
    mark.style.left = (value * 100) + "%";
    fill.style.transform = `scaleX(${value})`;

    if (typeof fn === "function") {
      fn(value);
    }
  }


  function updateFromEvent(e) {
    const r = rect(progress);

    const value = Math.max(0,Math.min(1,(e.clientX - r.left) / r.width));
    autoValue = value;
    updateValue(value);
  }

  function handleClick(e) {
    if (e.button === 0) {
      autoOff();
      updateFromEvent(e);
    }
  }

  function handleMove(e) {
    updateFromEvent(e);
  }

  function handleDown(e) {
    if (e.button === 0) {
      autoOff();
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    }
  }

  function handleUp(e) {
    if (e.button === 0) {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    }
  }

  function dispose() {
    mark.removeEventListener("mousedown", handleDown);
    progress.removeEventListener("click", handleClick);
  }

  mark.addEventListener("mousedown", handleDown);
  progress.addEventListener("click", handleClick);

  updateValue(0);

  function animate() {
    autoValue += 0.001;
    if (autoValue > 1.0) {
      autoValue = 0;
    }

    updateValue(autoValue);
    if (isAuto) {
      window.requestAnimationFrame(animate);
    }
  }
  window.requestAnimationFrame(animate);

  return {
    el,
    updateValue,
    dispose
  };
}

export function query(selector, el = document) {
  return el.querySelector(selector);
}

export function queryAll(selector, el = document) {
  return Array.prototype.slice.apply(el.querySelectorAll(selector));
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
  if (!el) {
    debugger;
  }
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

export function attributes(el, attribs) {
  const names = Object.keys(attribs);
  for (let index = 0; index < names.length; index++) {
    const name = names[index],
          value = attribs[name];
    setAttr(el, name, value);
  }
  return el;
}

export function addAll(el, content) {
  for (let index = 0; index < content.length; index++) {
    const child = content[index];
    add(el, child);
  }
  return el;
}

export function tag(name, attribs = {}, content = null) {
  const el = document.createElement(name);
  attributes(el, attribs);
  if (content) {
    if (Array.isArray(content)) {
      addAll(el, content);
    } else if (typeof content === "string" || content instanceof String ||
               typeof content === "number" || content instanceof Number ||
               typeof content === "boolean" || content instanceof Boolean || content instanceof Date) {
      add(el, document.createTextNode(content.toString()));
    }
  }
  return el;
}

export function clear(el) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.lastChild);
  }
  return el;
}

export function dateYMD(date) {
  return padLeft(date.getFullYear(), "0", 4)
    + "-" + padLeft((date.getMonth() + 1), "0", 2)
    + "-" + padLeft(date.getDate(), "0", 2);
}

export function dateFormatted(date) {
  return padLeft(date.getFullYear(), "0", 4)
    + "-" + padLeft((date.getMonth() + 1), "0", 2)
    + "-" + padLeft(date.getDate(), "0", 2)
    + " " + padLeft(date.getHours(), "0", 2)
    + ":" + padLeft(date.getMinutes(), "0", 2);
}

export function padLeft(str, chr, length) {
  str = str.toString();
  while (str.length < length) {
    str = chr + str;
  }
  return str;
}

export function padRight(str, chr, length) {
  str = str.toString();
  while (str.length < length) {
    str += chr;
  }
  return str;
}

export function text(el, text) {
  el.textContent = text;
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

export function interpolateDate(a,b,p,c = new Date()) {
  const newTime = ((b.getTime() - a.getTime()) * p) + a.getTime();
  c.setTime(newTime);
  return c;
}

export function interpolateText(text, data = {}, filters = {}) {
  return text.replace(/\{(.*?)\}/g, (fullMatch,name) => {
    if (name in data) {
      if (name in filters) {
        const filter = filters[name];
        return filter(data[name]);
      }
      return data[name];
    }
    return name;
  });
}

export function interpolate(el, data = {}, filters = {}) {
  for (let index = 0; index < el.childNodes.length; index++) {
    const childNode = el.childNodes[index];
    if (childNode.nodeType === document.TEXT_NODE) {
      childNode.textContent = interpolateText(childNode.textContent, data, filters);
    } else if (childNode.nodeType === document.ELEMENT_NODE) {
      for (let index = 0; index < childNode.attributes.length; index++) {
        const attribute = childNode.attributes[index];
        attribute.value = interpolateText(attribute.value, data, filters);
      }
      interpolate(childNode, data, filters);
    }
  }
  return el;
}

export function template(selector, data = {}, filters = {}) {
  const element = query(selector);
  if (!element) {
    throw `Element ${selector} not found`;
  }
  const templated = document.importNode(element.content, true);
  interpolate(templated, data, filters);
  return templated;
}

export function daysFrom(days) {
  const currentDate = config.USE_FIXED_DATE ? new Date("2015-12-18 00:00:00") : new Date();
  const minDate = (function() {
        const date = currentDate;
        date.setDate(date.getDate() + days);
        return date;
      }()),
      minDateFormatted = dateYMD(minDate);

  return minDateFormatted;
}

