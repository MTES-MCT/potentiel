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
} from './déclarer/déclarerGestionnaireRéseau.saga';
import { registerDéclarerGestionnaireRéseauProjetCommand } from './déclarer/déclarerGestionnaireRéseauProjet.command';

export type ProjetDependencies = {
  subscribe: Subscribe;
} & ModifierGestionnaireRéseauProjetDependencies;

export const setupProjet = (dependencies: ProjetDependencies) => {
  // Commands
  registerModifierGestionnaireRéseauProjetCommand(dependencies);
  registerDéclarerGestionnaireRéseauProjetCommand(dependencies);

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
            type: 'EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
            data: event,
          });
        } catch (error) {
          console.log(error);
        }
      },
    ),
  ];
};
