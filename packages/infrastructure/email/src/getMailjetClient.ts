import { Client as Mailjet } from 'node-mailjet';

let client: Mailjet | undefined;

export const getMailjetClient = () => {
  const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env;

  if (!client) {
    client = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  }

  return client;
};
