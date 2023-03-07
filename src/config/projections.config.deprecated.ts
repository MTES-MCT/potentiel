// TODO: a supprimer lorsque le soucis des imports side effects sera résolue.
import { initializeProjectors } from '@infra/sequelize/projectionsNext';
import { subscribeToRedis } from './eventBus.config';

initializeProjectors({ subscribe: subscribeToRedis });
