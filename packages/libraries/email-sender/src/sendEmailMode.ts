const SEND_EMAIL_MODE = ['send', 'sandbox', 'logging-only'] as const;

export type SendEmailMode = (typeof SEND_EMAIL_MODE)[number];

export const mapToSendEmailMode = (value: string): SendEmailMode => {
  const existingMode = SEND_EMAIL_MODE.find((mode) => mode === value);

  return existingMode ?? 'logging-only';
};
