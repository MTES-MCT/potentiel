import z from 'zod';

const allowedBaseURL = process.env.BASE_URL ?? '';

export const callbackURLSchema = z.string().refine((url) => {
  checkAllowedCallbackURL(url, allowedBaseURL);
}, "L'URL de redirection n'est pas valide");

export const checkAllowedCallbackURL = (url: string, allowedBaseURL: string) => {
  if (!url.startsWith('/') && !url.startsWith(allowedBaseURL)) {
    return false;
  }
  if (url.startsWith(allowedBaseURL)) {
    try {
      const parsedUrl = new URL(url);
      return new URL(allowedBaseURL).hostname === parsedUrl.hostname;
    } catch {
      return false;
    }
  }
  return true;
};
