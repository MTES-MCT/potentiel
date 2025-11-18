import z from 'zod';

export const callbackURLSchema = z.string().refine((url) => {
  const allowedBaseURL = process.env.BASE_URL ?? '';
  return checkAllowedCallbackURL(url, allowedBaseURL);
}, "L'URL de redirection n'est pas valide");

export const checkAllowedCallbackURL = (allowedBaseURL: string, url?: string) => {
  if (!url) {
    return true;
  }
  if (url.startsWith('/')) {
    return true;
  }
  if (url.startsWith(allowedBaseURL)) {
    try {
      const parsedUrl = new URL(url);
      return new URL(allowedBaseURL).hostname === parsedUrl.hostname;
    } catch {
      return false;
    }
  }
  return false;
};
