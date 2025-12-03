import { SendEmailV3_1 } from 'node-mailjet';

export type MailjetContact = SendEmailV3_1.EmailAddressTo;
export type MailjetEmail = SendEmailV3_1.Message;

export const prepareMessages = (
  message: MailjetEmail,
  maxRecipients: number,
): Array<MailjetEmail> => {
  const messages: MailjetEmail[] = [];
  const to = [...(message.To ?? [])];
  const cc = [...(message.Cc ?? [])];
  const bcc = [...(message.Bcc ?? [])];
  while (to.length > 0 || cc.length > 0 || bcc.length > 0) {
    let remainingLength = maxRecipients;
    const batchMessage = { ...message };

    batchMessage.To = to.splice(0, remainingLength);
    remainingLength -= batchMessage.To.length;
    batchMessage.Cc = cc.splice(0, remainingLength);
    remainingLength -= batchMessage.Cc.length;
    batchMessage.Bcc = bcc.splice(0, remainingLength);

    if (batchMessage.To.length === 0) {
      batchMessage.To = undefined;
    }

    messages.push(batchMessage);
  }
  return messages;
};
