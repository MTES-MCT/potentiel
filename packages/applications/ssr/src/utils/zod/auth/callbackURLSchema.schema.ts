import z from 'zod';

const allowedBaseURL = process.env.BASE_URL ?? '__MISSING__';

export const callbackURLSchema = z
  .string()
  .refine(
    (url) => url.startsWith('/') || url.startsWith(allowedBaseURL),
    "L'URL de redirection n'est pas valide",
  )
  .refine((url) => {
    if (url.startsWith(allowedBaseURL)) {
      try {
        const parsedUrl = new URL(url);
        return new URL(allowedBaseURL).hostname === parsedUrl.hostname;
      } catch {
        return false;
      }
    }
    return true;
  }, "L'URL de redirection n'est pas valide")
  .optional();
