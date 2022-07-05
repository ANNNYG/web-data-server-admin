import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading } from '@ant-design/pro-components';
import { history } from 'umi';

import type { RunTimeLayoutConfig } from 'umi';
import type { USER_TYPE } from '@/common/globalType';

import { fetchUserInfo as queryCurrentUser, getAuth, refreshToken } from '@/services/globalApi';
import {
  getLocal,
  setLocal,
  LOCAL_ACCESS_TOKEN,
  LOCAL_EXPIRES_IN,
  LOCAL_REFRESH_TOKEN,
} from '@/utils/localStorage';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const loginPath = '/login';
const uacPath = '/uaccallback';

const notNeedLogin = (): boolean =>
  [loginPath, uacPath].some((item) => history.location.pathname.startsWith(item));

const loginUrl = () => {
  return `${loginPath}?redirect=${history.location.pathname}`;
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: USER_TYPE;
  fetchUserInfo?: () => Promise<USER_TYPE | undefined>;
}> {
  const fetchUserInfo = async () => {
    // 登陆接口
    try {
      const currentUser = await queryCurrentUser();
      return currentUser;
    } catch (error) {
      history.push(loginUrl());
    }
    return undefined;
  };

  // 刷新token
  const fetchRefreshToken = async () => {
    try {
      const localExpiresIn = getLocal(LOCAL_EXPIRES_IN);
      const localAccessToken = getLocal(LOCAL_ACCESS_TOKEN);
      const localRefreshToken = getLocal(LOCAL_REFRESH_TOKEN);
      if (
        Date.now() > Number(localExpiresIn) - 3600000 * 1.5 &&
        localAccessToken &&
        localRefreshToken
      ) {
        const result = await refreshToken(localRefreshToken as string);
        setLocal(LOCAL_ACCESS_TOKEN, result.access_token);
        setLocal(LOCAL_EXPIRES_IN, (Date.now() + result.expires_in * 1000).toString());
        setLocal(LOCAL_REFRESH_TOKEN, result.refresh_token);
      }
    } catch (error) {
      history.push(loginPath);
    }
  };

  // 如果是登录页面，不执行
  if (!notNeedLogin()) {
    await fetchRefreshToken();
    const currentUser = await fetchUserInfo();
    const currentAuth = await getAuth();
    return {
      fetchUserInfo,
      currentUser: { ...currentUser, currentAuth },
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !notNeedLogin()) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
