/*
 * @description: 全局api
 * @author: Zyg
 * @date: 2022-07-04 16:12:34
 */

import request from '@/utils/request';

export async function getAuth(): Promise<any> {
  return request(`/api/users/permissions`);
}

export async function fetchUserInfo(): Promise<any> {
  return request(`/api/users/info`);
}

export async function refreshToken(refresh_token: string): Promise<any> {
  return request(`/api/uac/refresh/token`, {
    method: 'POST',
    params: { refresh_token },
  });
}
