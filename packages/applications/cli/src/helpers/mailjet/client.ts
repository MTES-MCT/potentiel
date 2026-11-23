import { MAILJET_API_URL, MAILJET_DATA_API_URL } from './constants.js';
import {
  makeAjouterContactsÀUneListeMailjet,
  makeRécupérerContactsListeMailjet,
} from './contact.js';
import { createMailjetFetch } from './fetch.js';
import { makeAttendreFinJobMailjet, makeRécupérerErreursJobMailjet } from './job.js';

export const createMailjetClient = ({
  apiKeyPublic,
  apiKeyPrivate,
}: {
  apiKeyPublic: string;
  apiKeyPrivate: string;
}) => {
  const mailjetFetch = createMailjetFetch({
    baseUrl: MAILJET_API_URL,
    apiKeyPublic,
    apiKeyPrivate,
  });
  const mailjetDataApiFetch = createMailjetFetch({
    baseUrl: MAILJET_DATA_API_URL,
    apiKeyPublic,
    apiKeyPrivate,
  });
  return {
    contactList: {
      lister: makeRécupérerContactsListeMailjet(mailjetFetch),
      ajouter: makeAjouterContactsÀUneListeMailjet(mailjetFetch),
    },
    job: {
      attendreFin: makeAttendreFinJobMailjet(mailjetFetch),
      récupérerErreurs: makeRécupérerErreursJobMailjet(mailjetDataApiFetch),
    },
  };
};
