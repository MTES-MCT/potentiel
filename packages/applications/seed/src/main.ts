import { bootstrap } from '@potentiel-applications/bootstrap';
import { startSubscribers } from '@potentiel-applications/subscribers';
import { seedAppelOffre, seedPériodes } from '@potentiel-applications/projectors';
import { executeQuery, killPool } from '@potentiel-libraries/pg-helpers';

import { seedUtilisateurs } from './utilisateurs.js';
import { seedCandidatures } from './candidatures.js';

const main = async () => {
  process.env.DATABASE_CONNECTION_STRING = 'postgres://potentiel:password@localhost:5432/potentiel';

  await bootstrap({ middlewares: [] });

  // setup subscribers list in DB
  const unlisten = await startSubscribers({});
  // unlisten : update will be done when starting the app next time
  await unlisten();
  // remove notifications
  await executeQuery("DELETE from event_store.subscriber where subscriber_name = 'notifications'");

  await seedAppelOffre();
  await seedPériodes();

  await seedUtilisateurs();
  await seedCandidatures();

  await killPool();
};

void main();
