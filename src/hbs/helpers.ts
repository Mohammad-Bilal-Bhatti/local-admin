import { get } from 'lodash';
import { menuItems } from 'src/shared/constants';
const { formatDistance, startOfDay, endOfDay } = require('date-fns');

export function printName(name: string) {
  const output = `<div> ${name}</div>`;
  return output;
}

export function json(data: any, indent = 2) {
  return JSON.stringify(data, null, indent);
}

export function ifEq(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
}

export function ifNotEq(arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
}

export function epochToDate(epoch: number) {
  try {
    const isInMillis = String(epoch).length >= 13;
    const multiplier = isInMillis ? 1 : 1000;
    return new Date(epoch * multiplier).toDateString();
  } catch (error) {
    return error.message;
  }
}

export function fromNow(epoch: number): string {
  try {
    const isInMillis = String(epoch).length >= 13;
    const multiplier = isInMillis ? 1 : 1000;
    const current = new Date();
    const epochDate = new Date(epoch * multiplier);
    return formatDistance(epochDate, current, { addSuffix: true })
  } catch (error) {
    return error.message;
  }
}

export function toSize(bytes: string) {
  const value = parseInt(bytes, 10);

  if (value < 1024) return `${value} bytes`;
  if (value / 1e3 < 1000) return `${(value / 1e3).toFixed(2)} KB`;
  if (value / 1e6 < 1000) return `${(value / 1e6).toFixed(2)} MB`;
  return `${(value / 1e9).toFixed(2)} GB`;

}

export function olookup(object: any, accessor: string): string {
  return get(object, accessor, '🤷‍♂️');
}

export function MenuItems(hb) {
  const currentPath: string = hb?.data?.root?.location?.path;
  const multipleMatches = menuItems.filter(item => currentPath?.startsWith(item?.link)).length > 1;

  const itemsAsHtml = menuItems.map((item, i) => {
    const isActive = (i === 0 && multipleMatches) ? false : currentPath?.startsWith(item?.link);
    return `<li class="nav-item">
      <a class="nav-link ${isActive ? 'active': ''}" href="${item.link}">${item.title}</a>
    </li>`
  });
  return `<ul class="navbar-nav">
    ${itemsAsHtml.join("\n")}
  </ul>`;
}

export function SideMenuItems(hb) {
  const currentPath: string = hb?.data?.root?.location?.path;
  const multipleMatches = menuItems.filter(item => currentPath?.startsWith(item?.link)).length > 1;
  const itemsAsHtml = menuItems.map((item, i) => {
    const isActive = (i === 0 && multipleMatches) ? false : currentPath?.startsWith(item?.link);
    return `
      <li class="nav-item">
          <a href="${item.link}" class="nav-link ${isActive ? 'active' : 'link-dark'}">
              ${item.title}
          </a>
      </li>`
  });
  return itemsAsHtml.join('');
}

export function startOf(date: Date): Date {
  return startOfDay(date);
}

export function endOf(date: Date): Date {
  return endOfDay(date);
}

export function createOptions(type: Record<string, string>) {
  return Object.keys(type).map(key => ({ label: key, value: type[key] }));
}

export function printKeyValue(value: any) {
  const type = typeof value;
  const isArray = Array.isArray(value);
  if (type === 'object') return `<pre>${JSON.stringify(value, null, 2)}</pre>`;
  return value;
}