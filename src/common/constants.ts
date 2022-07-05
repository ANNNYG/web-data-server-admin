/*
 * @Description:
 * @Author: shaojia
 * @Date: 2021-11-05 11:31:19
 * @LastEditTime: 2021-11-05 11:31:20
 * @LastEditors: shaojia
 */

export let DOMAIN = window.location.origin;

if (process.env.NODE_ENV === 'development') {
  DOMAIN = 'https://yunmute.easub.com';
}
