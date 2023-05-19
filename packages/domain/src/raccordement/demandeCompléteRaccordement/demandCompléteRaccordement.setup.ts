import { Subscribe } from '@potentiel/core-domain';
import {
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery,
  ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies,
} from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import {
  registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand,
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies,
} from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import {
  registerModifierDemandeComplèteRaccordementCommand,
  ModifierDemandeComplèteRaccordementDependencies,
} from './modifier/modifierDemandeComplèteRaccordement.command';
import {
  registerSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand,
  SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies,
} from './supprimerAccuséRéception/supprimerAccuséRéceptionDemandeComplèteRaccordement.command';
import {
  registerTransmettreDemandeComplèteRaccordementCommand,
  TransmettreDemandeComplèteRaccordementDependencies,
} from './transmettre/transmettreDemandeComplèteRaccordement.command';
import {
  accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory,
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies,
} from './supprimerAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementSupprimé.handler';
import {
  demandeComplèteRaccordementTransmiseHandlerFactory,
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies,
} from './transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import {
  DemandeComplèteRaccordementeModifiéeDependencies,
  demandeComplèteRaccordementeModifiéeHandlerFactory,
} from './modifier/handlers/demandeComplèteRaccordementModifiée.handler';
import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies,
  accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory,
} from './enregisterAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementTransmis.handler';

type QueryHandlerDependencies = ConsulterAccuséRéceptionDemandeComplèteRaccordementDependencies;

type CommandHandlerDependencies =
  EnregistrerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies &
    TransmettreDemandeComplèteRaccordementDependencies &
    ModifierDemandeComplèteRaccordementDependencies;

type EventHandlerDependencies = AccuséRéceptionDemandeComplèteRaccordementTransmisDependencies &
  AccuséRéceptionDemandeComplèteRaccordementSuppriméDependencies &
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies &
  DemandeComplèteRaccordementeModifiéeDependencies;

export type DemandeComplèteRaccordementDependencies = {
  subscribe: Subscribe;
} & QueryHandlerDependencies &
  CommandHandlerDependencies &
  EventHandlerDependencies;

export const setupDemandeCompléteRaccordement = (
  dependencies: DemandeComplèteRaccordementDependencies,
) => {
  // Queries
  registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery(dependencies);

  // Commands
  registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand(dependencies);
  registerModifierDemandeComplèteRaccordementCommand(dependencies);
  registerSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand(dependencies);
  registerTransmettreDemandeComplèteRaccordementCommand(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  const unsubscribes = [
    subscribe(
      'DemandeComplèteDeRaccordementTransmise',
      demandeComplèteRaccordementTransmiseHandlerFactory(dependencies),
    ),
    subscribe(
      'DemandeComplèteRaccordementModifiée',
      demandeComplèteRaccordementeModifiéeHandlerFactory(dependencies),
    ),
    subscribe(
      'AccuséRéceptionDemandeComplèteRaccordementSupprimé',
      accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory(dependencies),
    ),
    subscribe(
      'AccuséRéceptionDemandeComplèteRaccordementTransmis',
      accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory(dependencies),
    ),
  ];

  return unsubscribes;
};
