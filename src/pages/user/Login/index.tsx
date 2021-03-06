import React from 'react';
import { history } from 'umi';

import { getUacLoginUrl } from '@/services/loginApi';
import { getQueryString } from '@/utils/url';

import styles from './index.less';

const handleJumpUacLogin = async () => {
  const host = window.location.origin;

  const returnTo =
    (history.location.query?.redirect as string) || getQueryString('redirect') || '/';

  const params = {
    callback: `${host}/uaccallback`,
    return_to: returnTo,
    provider: 'dingtalk',
  };

  try {
    const data = await getUacLoginUrl(params);
    window.location.href = data.auth_url;
  } catch (ex) {
    //
  } finally {
  }
};

const Login: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content} onClick={handleJumpUacLogin}>
        登陆
      </div>
    </div>
  );
};

export default Login;
