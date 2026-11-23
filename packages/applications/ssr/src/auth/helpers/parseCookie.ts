export const parseCookie = (cookieHeader: string | null, cookieName: string) => {
  return cookieHeader
    ?.split(';')
    .find((cookie) => cookie.trim().startsWith(`${cookieName}=`))
    ?.split('=')[1];
};
