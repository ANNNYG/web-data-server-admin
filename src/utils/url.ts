/*
 * changeURLStatic 修改地址栏URL参数 不跳转
 * @param name 参数名
 * @param value 参数值
 */
export function changeURLStatic(n: string, v: string) {
  const url = window.location.href;
  // eslint-disable-next-line
  const reg = eval('/([?|&]' + n + '=)[^&]*/gi');
  const value = v.toString().replace(/(^\s*)|(\s*$)/g, ''); // 移除首尾空格
  let url2 = '';
  if (!value) {
    url2 = url.replace(reg, ''); // 正则替换
  } else if (url.match(reg)) {
    url2 = url.replace(reg, `$1${value}`); // 正则替换
  } else {
    url2 = `${url + (url.indexOf('?') > -1 ? '&' : '?') + n}=${value}`; // 没有参数添加参数
  }
  window.history.replaceState(null, '', url2); // 替换地址栏
}

/**
 * @param {*} n
 * 获取url参数
 */
export const getQueryString = (name: string) => {
  const regExp = `(^|&)${name}=([^&]*)(&|$)`;
  const reg = new RegExp(regExp, 'i');
  let s = window.location.search;
  if (!s) {
    const sHref = window.location.href;
    const args = sHref.split('?');
    if (args[0] === sHref) return null;
    s = `?${args[1]}`;
  }
  const r = s.substr(1).match(reg);
  if (r !== null) return decodeURIComponent(r[2]);
  return null;
};
