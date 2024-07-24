export type EmailPayload = {
  templateId: number;
  messageSubject: string;
  recipients: { email: string; fullName: string }[];
  variables: Record<string, string>;
};
export type SendEmail = (email: EmailPayload) => Promise<void>;
