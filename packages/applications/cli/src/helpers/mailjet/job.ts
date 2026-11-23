import { ExponentialBackoff, handleAll, retry, wrap } from 'cockatiel';

import type { MailjetFetch } from './fetch.js';
import type { MailjetListResponse } from './types.js';

type MailjetJob = {
  ID: number;
  Count: number;
  Error: string;
  ErrorFile: string;
  Status: string;
};

type AttendreFinJobMailjetProps = {
  listId: number;
  jobId: number;
};
export const makeAttendreFinJobMailjet =
  (fetch: MailjetFetch) =>
  async ({ listId, jobId }: AttendreFinJobMailjetProps): Promise<MailjetJob> => {
    const STATUTS_FINAUX_JOB_MAILJET = ['Completed', 'Error', 'Abort'];
    const NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET = 25;

    const policy = wrap(
      retry(handleAll, {
        maxAttempts: NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET,
        backoff: new ExponentialBackoff({ initialDelay: 100, maxDelay: 2000 }),
      }),
    );

    return policy.execute(async ({ attempt }) => {
      console.log(
        `⏳ Traitement en cours (${attempt} tentatives /${NOMBRE_MAX_TENTATIVES_POLLING_JOB_MAILJET})`,
      );

      const response = await fetch<MailjetListResponse<MailjetJob>>({
        pathname: `/contactslist/${listId}/managemanycontacts/${jobId}`,
      });

      const {
        Data: [job],
      } = response;

      if (STATUTS_FINAUX_JOB_MAILJET.includes(job.Status)) {
        return { ...job, ID: jobId };
      }
      throw new Error('job non terminé');
    });
  };

type RécupérerErreursJobMailjetProps = {
  jobId: number;
};
export const makeRécupérerErreursJobMailjet =
  (fetch: MailjetFetch) =>
  async ({ jobId }: RécupérerErreursJobMailjetProps): Promise<unknown> =>
    await fetch({
      pathname: `/BatchJob/${jobId}/JSONError/application:json/LAST`,
    });
