import { Subscribe } from '@potentiel/core-domain';
import {
  registerTransmettreDateMiseEnServiceCommand,
  TransmettreDateMiseEnServiceCommandDependencies,
} from './transmettre/transmettreDateMiseEnService.command';
import {
  dateMiseEnServiceTransmiseHandlerFactory,
  DateMiseEnServiceTransmiseDependencies,
} from '../../../../domain-views/src/raccordement/handlers/dateMiseEnServiceTransmise.handler';
import { registerTransmettreDateMiseEnServiceUseCase } from './transmettreDateMiseEnService.usecase';

type CommandHandlerDependencies = TransmettreDateMiseEnServiceCommandDependencies;
type EventHandlerDependencies = DateMiseEnServiceTransmiseDependencies;

export type MiseEnServiceDependencies = { subscribe: Subscribe } & CommandHandlerDependencies &
  EventHandlerDependencies;

export const setupMiseEnPlace = (dependencies: MiseEnServiceDependencies) => {
  // Commands
  registerTransmettreDateMiseEnServiceCommand(dependencies);

  // Usecases
  registerTransmettreDateMiseEnServiceUseCase();

  // Subscribes
  const { subscribe } = dependencies;
  return [
    subscribe('DateMiseEnServiceTransmise', dateMiseEnServiceTransmiseHandlerFactory(dependencies)),
  ];
};
