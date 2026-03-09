import { createServer } from 'http';

import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { runWebWithContext } from '@potentiel-applications/request-context';
import { Utilisateur } from '@potentiel-domain/utilisateur';

import { createApiServer } from '../src/server.js';

/** @param req {Request} */
const getTestUtilisateur = (req) => {
  const token = req.headers['authorization']?.split(' ')[1].split('.')[1];
  const jwtPayload = JSON.parse(atob(token ?? ''));
  const identifiantUtilisateur = jwtPayload.email;
  if (identifiantUtilisateur === 'integration-grd-enedis@clients') {
    return Utilisateur.convertirEnValueType({
      identifiantUtilisateur,
      rôle: 'grd',
      identifiantGestionnaireRéseau: '17X100A100A0001A',
    });
  }

  if (identifiantUtilisateur === 'integration-cocontractant-edf@clients') {
    return Utilisateur.convertirEnValueType({
      identifiantUtilisateur,
      rôle: 'cocontractant',
      zone: 'métropole',
    });
  }

  console.log('utilisateur non trouvé');
};

/**
 * Serveur de test de l'API
 **/
const main = async () => {
  initLogger(createLogger({}));

  const { bootstrap } = await import('@potentiel-applications/bootstrap');
  await bootstrap({ middlewares: [] });

  const apiHandler = createApiServer('/api/v1');
  const server = createServer();

  server.on('request', (req, res) =>
    runWebWithContext({
      app: 'api',
      getUtilisateur: getTestUtilisateur,
      req,
      res,
      callback: apiHandler,
    }),
  );

  server.listen(3000, () => {
    console.log('API server listening on port 3000');
  });
};

void main();
