import React, { useEffect, useState } from 'react';
import { getPageQuery } from '@/utils/utils';
import { PageLoading } from '@ant-design/pro-layout';
import { message } from 'antd';
import { history, useModel } from 'umi';
import {
  setLocal,
  LOCAL_ACCESS_TOKEN,
  LOCAL_EXPIRES_IN,
  LOCAL_REFRESH_TOKEN,
} from '@/utils/localStorage';

import { getDingLoginInfo } from '@/services/loginApi';
import { getAuth, fetchUserInfo } from '@/services/globalApi';

type TOKEN_TYPE = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  return_to: string;
};

const error = (content?: string) => {
  if (content) message.error(`${content}`);
  setTimeout(() => {
    history.push(`/login`);
  }, 3000);
};

const UacLogin: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [status, setState] = useState<string>('');

  console.log('UacLogin');

  const fetchUser = async () => {
    const resultAuth = await getAuth();
    const resultInfo = await fetchUserInfo();
    setInitialState({
      ...initialState,
      currentUser: { ...resultInfo, currentAuth: resultAuth },
    });
  };

  const initUser = async (return_to: string) => {
    try {
      await fetchUser();
      setTimeout(() => {
        window.location.replace(return_to || '/');
      }, 10);
    } catch (e) {
      setState('error');
    }
  };

  const fetchToken = async (code: string) => {
    try {
      const result = await getDingLoginInfo(code);
      await setLocal(LOCAL_ACCESS_TOKEN, result.access_token);
      await setLocal(LOCAL_EXPIRES_IN, (Date.now() + result.expires_in * 1000).toString());
      await setLocal(LOCAL_REFRESH_TOKEN, result.refresh_token);
      initUser(result.return_to);
    } catch (e) {
      setState('error');
    }
  };

  const initToken = async (params: TOKEN_TYPE) => {
    await setLocal(LOCAL_ACCESS_TOKEN, params.access_token);
    await setLocal(LOCAL_EXPIRES_IN, params.expires_in);
    await setLocal(LOCAL_REFRESH_TOKEN, params.refresh_token);
    initUser(params.return_to);
  };

  // code-登录 access_token-跳转注入token
  useEffect(() => {
    const params = getPageQuery();
    if ('code' in params) fetchToken(params.code as string);
    if ('access_token' in params) initToken(params as TOKEN_TYPE);
  }, []);

  return (
    <div>
      <PageLoading />
      {status === 'error' && error()}
    </div>
  );
};

export default UacLogin;
