import { registerConsulterAccuséRéceptionDemandeComplèteRaccordementQuery } from './consulterAccuséRéception/consulterAccuséRéceptionDemandeComplèteRaccordement.query';
import { registerEnregistrerAccuséRéceptionDemandeComplèteRaccordementCommand } from './enregisterAccuséRéception/enregistrerAccuséRéceptionDemandeComplèteRaccordement.command';
import { registerModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { registerSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand } from './supprimerAccuséRéception/supprimerAccuséRéceptionDemandeComplèteRaccordement.command';
import { registerTransmettreDemandeComplèteRaccordementCommand } from './transmettre/transmettreDemandeComplèteRaccordement.command';
import { accuséRéceptionDemandeComplèteRaccordementSuppriméHandlerFactory } from './supprimerAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementSupprimé.handler';
import { demandeComplèteRaccordementTransmiseHandlerFactory } from './transmettre/handlers/demandeComplèteRaccordementTransmise.handler';
import { demandeComplèteRaccordementeModifiéeHandlerFactory } from './modifier/handlers/demandeComplèteRaccordementModifiée.handler';
import { accuséRéceptionDemandeComplèteRaccordementTransmisHandlerFactory } from './enregisterAccuséRéception/handlers/accuséRéceptionDemandeComplèteRaccordementTransmis.handler';
import { DemandeComplèteRaccordementDependencies } from './demandeCompléteRaccordement.dependencies';
import { registerConsulterDemandeComplèteRaccordementUseCase } from './consulterDemandeComplèteRaccordement.usecase';
import { registerModifierDemandeComplèteRaccordementUseCase } from './modifierDemandeComplèteRaccordement.usecase';
import { registerTransmettreDemandeComplèteRaccordementUseCase } from './transmettreDemandeComplèteRaccordement.usecase';

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

  // Usecases
  registerConsulterDemandeComplèteRaccordementUseCase();
  registerModifierDemandeComplèteRaccordementUseCase();
  registerTransmettreDemandeComplèteRaccordementUseCase();

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
