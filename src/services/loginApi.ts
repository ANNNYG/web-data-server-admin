import request from '@/utils/request';

export async function getUacLoginUrl(params: any): Promise<any> {
  return request(`/api/uac/login/redirect`, {
    method: 'get',
    params,
  });
}

export async function getDingLoginInfo(code: string): Promise<any> {
  return request(`/api/uac/token`, {
    method: 'get',
    params: { code },
  });
}

// 退出登陆
export async function userLogout(): Promise<any> {
  return request(`/api/uac/logout`, {
    method: 'delete',
  });
}
