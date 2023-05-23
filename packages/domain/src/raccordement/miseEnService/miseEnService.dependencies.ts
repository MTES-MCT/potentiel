import { Subscribe } from '@potentiel/core-domain';
import { TransmettreDateMiseEnServiceCommandDependencies } from './transmettre/transmettreDateMiseEnService.command';
import { DateMiseEnServiceTransmiseDependencies } from './transmettre/handlers/dateMiseEnServiceTransmise.handler';

type CommandHandlerDependencies = TransmettreDateMiseEnServiceCommandDependencies;
type EventHandlerDependencies = DateMiseEnServiceTransmiseDependencies;

export type MiseEnServiceDependencies = { subscribe: Subscribe } & CommandHandlerDependencies &
  EventHandlerDependencies;
