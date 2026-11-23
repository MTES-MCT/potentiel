import type { Email } from '@potentiel-domain/common';

import { PAGE_SIZE } from './constants.js';
import type { MailjetFetch } from './fetch.js';
import type { MailjetContact, MailjetListResponse, RôleSansVisiteur } from './types.js';

type RécupérerContactsListeMailjetProps = {
  listId: number;
};
export const makeRécupérerContactsListeMailjet =
  (fetch: MailjetFetch) =>
  async ({ listId }: RécupérerContactsListeMailjetProps) => {
    const contacts: Array<MailjetContact> = [];
    let offset = 0;
    let count = 0;

    do {
      const response = await fetch<MailjetListResponse<MailjetContact>>({
        pathname: '/contact',
        searchParams: { ContactsList: listId, Limit: PAGE_SIZE, Offset: offset },
      });

      contacts.push(...response.Data);
      count = response.Count;
      offset += PAGE_SIZE;
    } while (count === PAGE_SIZE);

    return contacts;
  };

type AjouterContactsÀUneListeMailjetProps = {
  listId: number;
  contacts: Array<{
    email: Email.RawType;
    rôle: RôleSansVisiteur;
  }>;
};
export const makeAjouterContactsÀUneListeMailjet =
  (fetch: MailjetFetch) =>
  async ({ listId, contacts }: AjouterContactsÀUneListeMailjetProps) => {
    const response = await fetch<MailjetListResponse<{ JobID: number }>>({
      pathname: `/contactslist/${listId}/managemanycontacts`,
      body: {
        Action: 'addnoforce',
        Contacts: contacts.map(({ email, rôle }) => ({
          Email: email,
          Properties: { rôle },
        })),
      },
    });

    const {
      Data: [{ JobID }],
    } = response;

    return JobID;
  };
