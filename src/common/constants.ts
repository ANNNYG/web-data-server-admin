export let DOMAIN = window.location.origin;

if (process.env.NODE_ENV === 'development') {
  DOMAIN = 'https://yunmute.easub.com';
}
