import { Subscribe } from '@potentiel/core-domain';
import {
  registerTransmettreDateMiseEnServiceCommand,
  TransmettreDateMiseEnServiceCommandDependencies,
} from './transmettre/transmettreDateMiseEnService.command';
import {
  dateMiseEnServiceTransmiseHandlerFactory,
  DateMiseEnServiceTransmiseHandlerFactory,
} from './transmettre/handlers/dateMiseEnServiceTransmise.handler';

type CommandHandlerDependencies = TransmettreDateMiseEnServiceCommandDependencies;
type EventHandlerDependencies = DateMiseEnServiceTransmiseHandlerFactory;

export type MiseEnServiceDependencies = { subscribe: Subscribe } & CommandHandlerDependencies &
  EventHandlerDependencies;

export const setupMiseEnPlace = (dependencies: MiseEnServiceDependencies) => {
  // Commands
  registerTransmettreDateMiseEnServiceCommand(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe('DateMiseEnServiceTransmise', dateMiseEnServiceTransmiseHandlerFactory(dependencies)),
  ];
};
