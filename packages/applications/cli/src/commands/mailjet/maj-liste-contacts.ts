import { Command, Flags } from '@oclif/core';
import z from 'zod';

import type { Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, mailjetSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
  ...mailjetSchema.shape,
});

const MAILJET_API_URL = 'https://api.mailjet.com/v3/REST';
const PAGE_SIZE = 1000;

type MailjetListResponse<TData> = {
  Count: number;
  Total: number;
  Data: Array<TData>;
};

type MailjetContact = {
  ID: number;
  Email: string;
};

type RôleSansVisiteur = Exclude<Role.RawType, 'visiteur'>;

export class MiseÀJourListeContactsMailjetCommand extends Command {
  static description =
    'Compare le nombre de contacts d’une liste Mailjet avec le nombre d’utilisateurs Potentiel';

  static flags = {
    listId: Flags.integer({
      char: 'l',
      description: 'identifiant numérique de la liste Mailjet (et non son adresse)',
      required: true,
    }),
    role: Flags.string({
      char: 'r',
      description: 'filtrage par rôle',
      options: Role.roles.filter((rôle) => rôle !== 'visiteur'),
      required: false,
    }),
  };

  async run() {
    const {
      flags: { listId, role },
    } = await this.parse(MiseÀJourListeContactsMailjetCommand);
    const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = envSchema.parse(process.env);

    const logger = getLogger();

    const apiKeyPublic = MJ_APIKEY_PUBLIC;
    const apiKeyPrivate = MJ_APIKEY_PRIVATE;

    try {
      const potentielUtilisateurs = await executeSelect<{
        email: Email.RawType;
        rôle: RôleSansVisiteur;
        estDésactivé?: true;
      }>(
        `
            select
              value->>'identifiantUtilisateur' as "email",
              value->>'rôle' as "rôle",
              value->'désactivé' as "estDésactivé"
            from
              domain_views.projection
            where
              key like 'utilisateur|%'
              and value->>'identifiantUtilisateur' not ilike '%@clients'
              and ($1::text is null or value->>'rôle' = $1)
            `,
        role ?? null,
      );

      if (!potentielUtilisateurs.length) {
        logger.error(`❌ Aucun utilisateur Potentiel trouvé`);
        return;
      }

      const contactsMailjet = await récupérerContactsListeMailjet({
        listId,
        apiKeyPublic,
        apiKeyPrivate,
      });

      console.info(`📊 ${potentielUtilisateurs.length} utilisateurs dans Potentiel`);
      console.info(`📬 ${contactsMailjet.length} contacts dans la liste Mailjet ${listId}`);

      const emailsMailjet = new Set(contactsMailjet.map(({ Email }) => Email.toLowerCase()));

      const utilisateursÀAjouter: AjouterContactsÀUneListeMailjetProps['contacts'] =
        potentielUtilisateurs
          .filter(
            ({ email, estDésactivé }) => !estDésactivé && !emailsMailjet.has(email.toLowerCase()),
          )
          .map(({ email, rôle }) => ({
            email,
            rôle,
          }));

      if (!utilisateursÀAjouter.length) {
        console.info(`✅ Aucun utilisateur à ajouter dans Potentiel`);
        return;
      }

      const job = await ajouterContactsÀUneListeMailjet({
        listId,
        apiKeyPublic,
        apiKeyPrivate,
        contacts: utilisateursÀAjouter,
      });

      if (job.Status !== 'Completed' || job.Error) {
        console.error(`❌ Job Mailjet en échec (${job.Status}) : ${job.Error}`);
        const erreurs = await récupérerErreursJobMailjet({
          apiKeyPublic,
          apiKeyPrivate,
          jobId: job.ID,
        });
        console.error(`📄 Détail des erreurs :`, JSON.stringify(erreurs));
        return;
      }

      console.info(
        `⚡️ ${job.Count} utilisateurs ajoutés à la liste ${listId} dans Mailjet (${utilisateursÀAjouter.length} envoyés)`,
      );
    } catch (error) {
      logger.error(error as Error);
    }
  }
}

const getMailjetAuthorization = (apiKeyPublic: string, apiKeyPrivate: string) =>
  `Basic ${Buffer.from(`${apiKeyPublic}:${apiKeyPrivate}`).toString('base64')}`;

type GetMailjetApiUrlProps = {
  path: `/${string}`;
  searchParams?: Record<string, string | number>;
};
const getMailjetApiUrl = ({ path, searchParams = {} }: GetMailjetApiUrlProps) => {
  const url = new URL(`${MAILJET_API_URL}${path}`);

  for (const [clé, valeur] of Object.entries(searchParams)) {
    url.searchParams.set(clé, String(valeur));
  }

  return url;
};

type RécupérerContactsListeMailjetProps = {
  listId: number;
  apiKeyPublic: string;
  apiKeyPrivate: string;
};
const récupérerContactsListeMailjet = async ({
  listId,
  apiKeyPublic,
  apiKeyPrivate,
}: RécupérerContactsListeMailjetProps) => {
  const contacts: Array<MailjetContact> = [];
  let offset = 0;
  let count = 0;

  do {
    const url = getMailjetApiUrl({
      path: '/contact',
      searchParams: { ContactsList: listId, Limit: PAGE_SIZE, Offset: offset },
    });

    const response = await fetch(url, {
      headers: { Authorization: getMailjetAuthorization(apiKeyPublic, apiKeyPrivate) },
    });

    if (!response.ok) {
      throw new Error(`Mailjet GET ${url} : ${response.status} ${await response.text()}`);
    }

    const page = (await response.json()) as MailjetListResponse<MailjetContact>;
    contacts.push(...page.Data);
    count = page.Count;
    offset += PAGE_SIZE;
  } while (count === PAGE_SIZE);

  return contacts;
};

type AjouterContactsÀUneListeMailjetProps = {
  apiKeyPublic: string;
  apiKeyPrivate: string;
  listId: number;
  contacts: Array<{
    email: Email.RawType;
    rôle: RôleSansVisiteur;
  }>;
};
const ajouterContactsÀUneListeMailjet = async ({
  apiKeyPublic,
  apiKeyPrivate,
  listId,
  contacts,
}: AjouterContactsÀUneListeMailjetProps) => {
  const url = getMailjetApiUrl({
    path: `/contactslist/${listId}/managemanycontacts`,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: getMailjetAuthorization(apiKeyPublic, apiKeyPrivate),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Action: 'addnoforce',
      Contacts: contacts.map(({ email, rôle }) => ({
        Email: email,
        Properties: { rôle },
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Mailjet POST ${url} : ${response.status} ${await response.text()}`);
  }

  const {
    Data: [{ JobID }],
  } = (await response.json()) as MailjetListResponse<{ JobID: number }>;

  return attendreFinJobMailjet({ apiKeyPublic, apiKeyPrivate, listId, jobId: JobID });
};

type MailjetJob = {
  ID: number;
  Count: number;
  Error: string;
  ErrorFile: string;
  Status: string;
};

type AttendreFinJobMailjetProps = {
  apiKeyPublic: string;
  apiKeyPrivate: string;
  listId: number;
  jobId: number;
};
const attendreFinJobMailjet = async ({
  apiKeyPublic,
  apiKeyPrivate,
  listId,
  jobId,
}: AttendreFinJobMailjetProps): Promise<MailjetJob> => {
  const STATUTS_FINAUX_JOB_MAILJET = ['Completed', 'Error', 'Abort'];
  const DÉLAI_POLLING_JOB_MAILJET_MS = 2000;
  const NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET = 25;

  const url = getMailjetApiUrl({
    path: `/contactslist/${listId}/managemanycontacts/${jobId}`,
  });

  for (let tentative = 1; tentative <= NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET; tentative++) {
    console.log(
      `⏳ Traitement en cours (${tentative} tentatives /${NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET})`,
    );

    const response = await fetch(url, {
      headers: { Authorization: getMailjetAuthorization(apiKeyPublic, apiKeyPrivate) },
    });

    if (!response.ok) {
      throw new Error(`Mailjet GET ${url} : ${response.status} ${await response.text()}`);
    }

    const {
      Data: [job],
    } = (await response.json()) as MailjetListResponse<MailjetJob>;

    if (STATUTS_FINAUX_JOB_MAILJET.includes(job.Status)) {
      return { ...job, ID: jobId };
    }

    await new Promise((resolve) => setTimeout(resolve, DÉLAI_POLLING_JOB_MAILJET_MS));
  }

  throw new Error(
    `Job Mailjet ${jobId} non terminé après ${(NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET * DÉLAI_POLLING_JOB_MAILJET_MS) / 1000} secondes`,
  );
};

type RécupérerErreursJobMailjetProps = {
  apiKeyPublic: string;
  apiKeyPrivate: string;
  jobId: number;
};
const récupérerErreursJobMailjet = async ({
  apiKeyPublic,
  apiKeyPrivate,
  jobId,
}: RécupérerErreursJobMailjetProps): Promise<unknown> => {
  const url = `https://api.mailjet.com/v3/DATA/BatchJob/${jobId}/JSONError/application:json/LAST`;

  const response = await fetch(url, {
    headers: { Authorization: getMailjetAuthorization(apiKeyPublic, apiKeyPrivate) },
  });

  if (!response.ok) {
    throw new Error(`Mailjet GET ${url} : ${response.status} ${await response.text()}`);
  }

  return response.json();
};
