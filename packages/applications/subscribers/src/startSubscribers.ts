import { mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { logMiddleware } from '@potentiel-applications/bootstrap';

import { setupSubscribers, SetupSubscribersProps } from './setup';

export type StartSubscribersProps = SetupSubscribersProps;
export const startSubscribers = async ({ dependencies }: StartSubscribersProps) => {
  mediator.use({ middlewares: [logMiddleware] });

  const unsetup = await setupSubscribers({ dependencies });

  getLogger('subscribers').info('Subscribers started');

  return unsetup;
};
