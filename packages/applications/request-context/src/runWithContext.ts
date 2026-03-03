import { IncomingMessage, ServerResponse } from 'node:http';

import { getLogger } from '@potentiel-libraries/monitoring';

import { getContext, type PotentielUtilisateur, requestContextStorage } from './request-context.js';

type GetUtilisateur = (props: { headers: Headers }) => Promise<PotentielUtilisateur | undefined>;

type RunWithAuthContextProps = {
  req: IncomingMessage;
  res: ServerResponse;
  app: 'web' | 'api';
  callback: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
  getUtilisateur: GetUtilisateur;
};

export function runWebWithContext({
  app,
  req,
  res,
  callback,
  getUtilisateur,
}: RunWithAuthContextProps) {
  const logger = getLogger('http');

  const correlationId = crypto.randomUUID();
  return requestContextStorage.run(
    { app, correlationId, features: fetchFeatures(), url: req.url },
    async () => {
      const start = Date.now();
      try {
        const utilisateur = await getUtilisateur({
          headers: new Headers(req.headers as Record<string, string>),
        });
        const store = requestContextStorage.getStore()!;
        // we could set `utilisateur` in the `run` parameters, but we wouldn't have correlationId in the context
        store.utilisateur = utilisateur;
      } catch (e) {
        getLogger().warn('Auth failed', { error: e });
      }
      try {
        console.log(
          'pre callback',
          req.url,
          getContext()?.utilisateur?.identifiantUtilisateur.email,
        );
        await callback(req, res);
      } finally {
        const duration = Date.now() - start;
        logger.debug(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`, {
          correlationId,
          app,
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration,
        });
      }
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
