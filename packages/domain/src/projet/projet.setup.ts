import { Subscribe } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from '../raccordement/raccordement.event';
import { mediator } from 'mediateur';
import {
  registerExecuterAjouterGestionnaireRéseauProjetSaga,
  ExecuterAjouterGestionnaireRéseauProjetSaga,
} from './lauréat/gestionnaireRéseau/déclarer/déclarerGestionnaireRéseau.saga';
import { registerDéclarerGestionnaireRéseauProjetCommand } from './lauréat/gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './lauréat/gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './lauréat/gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';

export type ProjetDependencies = {
  subscribe: Subscribe;
} & ModifierGestionnaireRéseauProjetDependencies;

export const setupProjet = async (dependencies: ProjetDependencies) => {
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
    await subscribe<DemandeComplèteRaccordementTransmiseEvent>({
      name: 'saga-ajouter-gestionnaire-reseau-projet',
      eventType: ['DemandeComplèteDeRaccordementTransmise'],
      eventHandler: async (event: DemandeComplèteRaccordementTransmiseEvent) => {
        await mediator.send<ExecuterAjouterGestionnaireRéseauProjetSaga>({
          type: 'EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    }),
  ];
};
