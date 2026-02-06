import { Client } from 'node-mailjet';

let client: Client | undefined;

export const getMailjetClient = () => {
  const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env;

  if (!client) {
    client = Client.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  }

  return client;
};
