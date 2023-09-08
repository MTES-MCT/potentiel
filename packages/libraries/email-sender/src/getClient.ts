import Mailjet from 'node-mailjet';
import { VariableEnvironnementEmailSenderManquanteError } from './emailSender.errors';

let client: Mailjet | undefined;

export const getClient = () => {
  const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, SEND_EMAILS_FROM, SEND_EMAILS_FROM_NAME } =
    process.env;

  if (!MJ_APIKEY_PRIVATE) {
    throw new VariableEnvironnementEmailSenderManquanteError('MJ_APIKEY_PRIVATE');
  }

  if (!MJ_APIKEY_PUBLIC) {
    throw new VariableEnvironnementEmailSenderManquanteError('MJ_APIKEY_PUBLIC');
  }

  if (!SEND_EMAILS_FROM) {
    throw new VariableEnvironnementEmailSenderManquanteError('SEND_EMAILS_FROM');
  }

  if (!SEND_EMAILS_FROM_NAME) {
    throw new VariableEnvironnementEmailSenderManquanteError('SEND_EMAILS_FROM_NAME');
  }

  if (!client) {
    client = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  }

  return client;
};
