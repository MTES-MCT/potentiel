export type Recipient = {
  email: string;
  fullName: string;
};

export type EmailPayload = {
  templateId: number;
  messageSubject: string;
  recipients: Array<Recipient>;
  cc?: Array<Recipient>;
  bcc?: Array<Recipient>;
  variables: Record<string, string>;
};
export type SendEmail = (email: EmailPayload) => Promise<void>;
