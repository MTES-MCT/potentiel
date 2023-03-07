// TODO: a supprimer lorsque le soucis des imports side effects sera résolue.
import { initializeProjectors } from '@infra/sequelize/projectionsNext';
import { subscribeToRedis as subscribe } from './eventBus.config';

initializeProjectors(subscribe);
