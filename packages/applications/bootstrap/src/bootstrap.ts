import { mediator } from 'mediateur';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';

let unsetup: () => Promise<void>;

export const bootstrap = async (): Promise<() => Promise<void>> => {
  if (!unsetup) {
    mediator.use({
      middlewares: [logMiddleware],
    });
    const unsetupLauréat = await setupLauréat();

    unsetup = async () => {
      await unsetupLauréat();
    };
  }

  return unsetup;
};
