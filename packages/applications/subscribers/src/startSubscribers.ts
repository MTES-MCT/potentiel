import { mediator } from 'mediateur';

import { logMiddleware } from '@potentiel-applications/bootstrap';
import { getLogger } from '@potentiel-libraries/monitoring';

import { type SetupSubscribersProps, setupSubscribers } from './setup/index.js';

export type StartSubscribersProps = SetupSubscribersProps;

export const startSubscribers = ({ dependencies }: StartSubscribersProps) => {
  mediator.use({ middlewares: [logMiddleware] });

  const unsetup = setupSubscribers({ dependencies });

  getLogger('subscribers').info('Subscribers started');

  return unsetup;
};
