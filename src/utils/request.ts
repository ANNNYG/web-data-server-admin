import { extend } from 'umi-request';
import { message as antMessage } from 'antd';
import { clearLocal, getLocal, LOCAL_ACCESS_TOKEN } from '@/utils/localStorage';
import { DOMAIN } from '@/common/constants';
import { history } from 'umi';
import { stringify } from 'querystring';

const noMessagePath = ['/', '/login'];

/**
 * 异常处理程序
 */
const errorHandler = (error: { data: any; message: string }): any => {
  const { message, data } = error;
  if (noMessagePath.includes(window.location.pathname)) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error;
  } else {
    antMessage.error(data?.message || message || '网络异常');
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error;
  }
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  prefix: `${DOMAIN}`,
});

// request拦截器, 改变url 或 options.
// @ts-ignore
request.interceptors.request.use(async (url: string, options) => {
  const token = getLocal(LOCAL_ACCESS_TOKEN);
  if (token) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }

  return {
    url,
    options: { ...options },
  };
});

// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  // token 失效
  if (response.status === 401) {
    clearLocal();
    const { pathname } = history.location;
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }

  return response;
});

export default request;
