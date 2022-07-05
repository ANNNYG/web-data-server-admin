const { localStorage } = window;

export const LOCAL_ACCESS_TOKEN: string = 'access_token';
export const LOCAL_EXPIRES_IN: string = 'expires_in';
export const LOCAL_REFRESH_TOKEN: string = 'refresh_token';

// -----------------localStorage---------------------

// 设置localStorage
export function setLocal(key: string, val: string): void {
  // eslint-disable-next-line
  const setting = arguments[0];
  if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
    // eslint-disable-next-line
    for (const i in setting) {
      localStorage.setItem(i, setting[i]);
    }
  } else {
    localStorage.setItem(key, val);
  }
}

// 获取localStorage
export function getLocal(key: string): string | null {
  try {
    if (key && localStorage.getItem(key) && localStorage.getItem(key) !== 'undefined')
      return localStorage.getItem(key);
    return null;
  } catch (error) {
    return null;
  }
}

// 移除localStorage
export function removeLocal(key: string): void {
  localStorage.removeItem(key);
}

// 移除所有localStorage
export function clearLocal(): void {
  localStorage.clear();
}
