import { seedAppelOffre, seedPériodes } from '@potentiel-applications/projectors';
import { getLogger } from '@potentiel-libraries/monitoring';

import { type SetupSubscribersProps, setupSubscribers } from './setup/index.js';

export type StartSubscribersProps = SetupSubscribersProps;

export const startSubscribers = async ({ dependencies }: StartSubscribersProps) => {
  await seedAppelOffre();
  await seedPériodes();

  const subscribers = setupSubscribers({ dependencies });

  await subscribers.setupSubscriptions();

  getLogger('subscribers').info('Subscribers started');

  return subscribers.clearSubscriptions;
};
