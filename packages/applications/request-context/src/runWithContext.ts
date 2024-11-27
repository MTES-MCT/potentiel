import { IncomingMessage, ServerResponse } from 'node:http';

import { getUtilisateur } from './getUtilisateur';
import { requestContextStorage } from './request-context';

type RunWithAuthContextProps = {
  req: IncomingMessage;
  res: ServerResponse;
  callback: () => void | Promise<void>;
};

export function runWithContext({ req, res, callback }: RunWithAuthContextProps) {
  const correlationId = crypto.randomUUID();

  return requestContextStorage.run({ correlationId }, async () => {
    const utilisateur = await getUtilisateur(req, res);
    // we could set `utilisateur` in the `run` parameters, but we wouldn't have correlationId in the context
    requestContextStorage.getStore()!.utilisateur = utilisateur;

    await callback();
  });
}
