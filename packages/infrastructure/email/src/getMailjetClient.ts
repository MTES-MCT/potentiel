import MailjetLib from 'node-mailjet';

// Hack due to node-mailjet bad ESM configuration
const Mailjet = MailjetLib.default ?? MailjetLib;
type Mailjet = MailjetLib.default;
let client: Mailjet | undefined;

export const getMailjetClient = () => {
  const { MJ_APIKEY_PUBLIC = '', MJ_APIKEY_PRIVATE = '' } = process.env;

  if (!client) {
    client = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  }

  return client;
};
