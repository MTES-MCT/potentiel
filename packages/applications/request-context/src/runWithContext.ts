import { IncomingMessage, ServerResponse } from 'node:http';

import { getUtilisateur } from './getUtilisateur';
import { requestContextStorage } from './request-context';

type RunWithAuthContextProps = {
  req: IncomingMessage;
  res: ServerResponse;
  app: 'web' | 'legacy';
  callback: () => void | Promise<void>;
};

const ignorePath = (path: string) => ['/_next', '/illustrations'].some((p) => path.startsWith(p));

export function runWebWithContext({ app, req, res, callback }: RunWithAuthContextProps) {
  if (ignorePath(req.url ?? '')) {
    return callback();
  }

  const correlationId = crypto.randomUUID();
  return requestContextStorage.run(
    { app, correlationId, features: fetchFeatures(), url: req.url },
    async () => {
      const utilisateur = await getUtilisateur(req, res);
      const store = requestContextStorage.getStore()!;
      // we could set `utilisateur` in the `run` parameters, but we wouldn't have correlationId in the context
      store.utilisateur = utilisateur;

      await callback();
    },
  );
}

type RunWithWorkerContextProps = {
  app: 'cli' | 'subscribers';
  callback: () => void | Promise<void>;
};
export function runWorkerWithContext({ app, callback }: RunWithWorkerContextProps) {
  const correlationId = crypto.randomUUID();
  return requestContextStorage.run({ app, correlationId, features: fetchFeatures() }, async () => {
    await callback();
  });
}

const fetchFeatures = () => {
  const features = process.env.FEATURES?.split(',') ?? [];

  return features;
};
