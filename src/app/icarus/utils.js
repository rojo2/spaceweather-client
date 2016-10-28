import React from "react";

export function formatDate(date) {
  return padLeft(date.getFullYear(), "0", 4)
    + "-" + padLeft((date.getMonth() + 1), "0", 2)
    + "-" + padLeft(date.getDate(), "0", 2);
}

export function formatDateTime(date) {
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

export function daysFrom(days, date = new Date()) {
  date.setDate(date.getDate() + days);
  const minDateFormatted = formatDate(date);
  return minDateFormatted;
}

function sunspotCoord(value, positive = false) {
  return Math.sin(Math.PI * (positive ? 0.5 : -0.5)) * Math.sin(value);
}

function parseSunspot(data) {
  const NS = (data.substr(0,1) === "N" ? false : true);
  const WE = (data.substr(3,1) === "W" ? true : false);

  const alpha = (parseInt(data.substr(1,2),10) / 90) * Math.PI * 0.5;
  const beta = (parseInt(data.substr(4,2),10) / 90) * Math.PI * 0.5;

  const x = sunspotCoord(beta, WE);
  const y = sunspotCoord(alpha, NS);

  return { x, y };
}

function parseDate(d) {
  if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(d)) {
    const [fullMatch,year,month,day,hours,minutes,seconds] = d.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/);
    return new Date(parseInt(year,10),parseInt(month,10),parseInt(day,10),parseInt(hours,10),parseInt(minutes,10),parseInt(seconds,10));
  } else if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(d)) {
    const [fullMatch,year,month,day] = d.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
    return new Date(parseInt(year,10),parseInt(month,10),parseInt(day,10));
  }
  return Date.parse(d);
}

function interpolate(value,min,max) {
  return min + (value * (max - min));
}

function interpolateLog(value,min,max) {
  return interpolate(Math.log10(value), Math.log10(min), Math.log10(max));
}

function range(value,min,max) {
  return (value - min) / (max - min);
}

function ts(list,x = "date",y = "ts") {
  return list.map((item) => {
    item[y] = new Date(item[x]);
    return item;
  });
}

function time(list,x = "date",y = "time") {
  return list.map((item) => {
    item[y] = parseDate(item[x]).getTime();
    return item;
  });
}

function max(list,name) {
  return list.reduce((acc,current) => {
    return Math.max(acc,current[name]);
  }, Number.MIN_VALUE);
}

function maxOf(lists,name,count = 0) {
  if (count <= 0) {
    return Math.max(...lists.map((list) => max(list,name)));
  } else {
    let current = Number.MIN_VALUE;
    for (let index = 0; index < count; index++) {
      const list = lists[index];
      current = Math.max(max(list,name),current);
    }
    return current;
  }
}

function min(list,name) {
  return list.reduce((acc,current) => {
    return Math.min(acc,current[name]);
  }, Number.MAX_VALUE);
}

function minOf(lists,name,count = 0) {
  if (count <= 0) {
    return Math.min(...lists.map((list) => min(list,name)));
  } else {
    let current = Number.MAX_VALUE;
    for (let index = 0; index < count; index++) {
      const list = lists[index];
      current = Math.min(min(list,name),current);
    }
    return current;
  }
}

function log(value,min,max) {
  const m = Math.log10(min);
  return (Math.log10(value) - m) / (Math.log10(max) - m);
}

function pointsLog(list,x,y,minX,maxX,minY,maxY) {
  return list.map((item) => {
    return {
      x: range(item[x], minX, maxX),
      y: log(item[y], minY, maxY)
    };
  });
}

function points(list,x,y,minX,maxX,minY,maxY) {
  return list.map((item) => {
    return {
      x: range(item[x], minX, maxX),
      y: range(item[y], minY, maxY)
    };
  });
}

function dots(points,width,height) {
  return points.map((point) => {
    const x = point.x * width;
    const y = height - (point.y * height);
    if (x === 0 && y === 0) {
      return null;
    }
    return (<rect className="Graph__dot" x={x} y={y} width="2" height="2" key={`${x}_${y}`}></rect>);
  });
}

function areaPath(points,width,height) {
  return points.reduce((acc,point,index) =>  {
    const cmd = (index === 0 ? "M" : "L");
    const pos = `${cmd}${point.x * width} ${height - (point.y * height)}`;
    return acc + (index > 0 ? "," : "") + pos;
  }, "") + `L${width} ${height} L0 ${height}`;
}

function path(points,width,height) {
  return points.reduce((acc,point,index) =>  {
    const cmd = (index === 0 ? "M" : "L");
    const pos = `${cmd}${point.x * width} ${height - (point.y * height)}`;
    return acc + (index > 0 ? "," : "") + pos;
  }, "");
}

function nearest(value, roundTo = 0.1) {
  return Math.round(value / roundTo) * roundTo;
}

function ticksLog(min,max) {
  const range = (max - min);
  const step = range / 10;
  const ticks = [];
  for (let i = min; i < max; i += step) {
    ticks.push(Math.log10(i) / Math.log10(max));
  }
  return ticks;
}

function ticks(min,max) {
  const range = (max - min);
  const step = range / 10;
  const ticks = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(i);
  }
  return ticks;
}

function canvasDot(points,canvas,style = { color: "#fff", width: 1 }) {
  const context = canvas.getContext("2d");
  const halfWidth = style.width * 0.5;
  points.forEach((point,index) => {
    context.fillStyle = style.color;
    context.fillRect(point.x - halfWidth, point.y - halfWidth, style.width, style.width);
  });
}

function canvasLine(points,canvas,style = { color: "#fff", width: 1 }) {
  const context = canvas.getContext("2d");
  context.beginPath();
  points.forEach((point,index) => {
    if (index === 0) {
      context.moveTo(point.x * canvas.width,point.y * canvas.height);
    } else {
      context.lineTo(point.x * canvas.width,point.y * canvas.height);
    }
  });
  context.strokeStyle = style.color;
  context.lineWidth = style.width;
  context.stroke();
}

function radio(list) {
  ts(list, "date");
  const items = [];
  let lastItem = null;
  for (let item of list) {
    if (items.length === 0) {
      items.push(item);
    } else {
      if (item.ts.getDate() !== lastItem.ts.getDate()) {
        items.push(item);
      }
    }
    lastItem = item;
  }
  return items;
}

export default {
  parseDate,
  interpolate,
  interpolateLog,
  range,
  time,
  ts,
  max,
  min,
  maxOf,
  minOf,
  log,
  points,
  pointsLog,
  areaPath,
  path,
  dots,
  ticksLog,
  ticks,
  radio,
  daysFrom,
  formatDate,
  formatDateTime,
  padLeft,
  padRight,
  sunspotCoord,
  parseSunspot
};
