import { Subscribe } from '@potentiel/core-domain';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './modifier/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './modifier/modifierGestionnaireRéseauProjet.usecase';
import { DemandeComplèteRaccordementTransmiseEvent } from '../raccordement/raccordement.event';
import { mediator } from 'mediateur';
import {
  ExecuterAjouterGestionnaireRéseauProjetSaga,
  registerExecuterAjouterGestionnaireRéseauProjetSaga,
} from './ajouter/ajouterGestionnaireRéseau.saga';
import { registerAjouterGestionnaireRéseauProjetCommand } from './ajouter/ajouterGestionnaireRéseauProjet.command';

export type ProjetDependencies = {
  subscribe: Subscribe;
} & ModifierGestionnaireRéseauProjetDependencies;

export const setupProjet = (dependencies: ProjetDependencies) => {
  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);
  registerAjouterGestionnaireRéseauProjetCommand(dependencies);

  // Use cases
  registerModifierGestionnaireRéseauProjetUseCase();

  // Sagas
  registerExecuterAjouterGestionnaireRéseauProjetSaga();

  // Sagas
  const { subscribe } = dependencies;

  return [
    subscribe<DemandeComplèteRaccordementTransmiseEvent>(
      ['DemandeComplèteDeRaccordementTransmise'],
      async (event: DemandeComplèteRaccordementTransmiseEvent) => {
        try {
          await mediator.send<ExecuterAjouterGestionnaireRéseauProjetSaga>({
            type: 'EXECUTER_AJOUTER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
            data: event,
          });
        } catch (error) {
          console.log(error);
        }
      },
    ),
  ];
};
