/*
 * @description: 根据权限控制路由
 * @author: Zyg
 * @date: 2022-07-05 14:10:53
 * remark:  https://umijs.org/zh-CN/plugins/plugin-access
 */

import type { USER_TYPE } from '@/common/globalType';

export default function access(initialState: { currentUser?: USER_TYPE } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser, 'currentUser');
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
