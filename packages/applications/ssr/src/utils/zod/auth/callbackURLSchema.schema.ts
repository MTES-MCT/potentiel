import z from 'zod';

export const callbackURLSchema = z.string().refine((url) => {
  const allowedBaseURL = process.env.BASE_URL ?? '';
  return checkAllowedCallbackURL(allowedBaseURL, url);
}, "L'URL de redirection n'est pas valide");

export const checkAllowedCallbackURL = (allowedBaseURL: string, url: string | undefined) => {
  if (!url) {
    return true;
  }
  try {
    const parsedUrl = new URL(url);
    return new URL(allowedBaseURL).hostname === parsedUrl.hostname;
  } catch {
    return false;
  }
};
