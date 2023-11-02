import { Subscribe } from '@potentiel/core-domain';
import {
  DéclarerGestionnaireRéseauProjetDependencies,
  registerDéclarerGestionnaireRéseauProjetCommand,
} from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';
import {
  ExecuterAjouterGestionnaireRéseauProjetSaga,
  registerExecuterAjouterGestionnaireRéseauProjetSaga,
} from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseau.saga';
import { DemandeComplèteRaccordementTransmiseEventV1 } from '../../raccordement/raccordement.event';
import { mediator } from 'mediateur';

type GestionnaireRéseauLauréatDependencies = DéclarerGestionnaireRéseauProjetDependencies &
  ModifierGestionnaireRéseauProjetDependencies;

export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies;

export const setupLauréat = async (dependencies: LauréatDependencies) => {
  registerGestionnaireRéseauLauréat(dependencies);
  // Subscribe
  const { subscribe } = dependencies;

  return [
    await subscribe<DemandeComplèteRaccordementTransmiseEventV1>({
      name: 'saga-ajouter-gestionnaire-reseau-projet',
      eventType: ['DemandeComplèteDeRaccordementTransmise-V1'],
      eventHandler: async (event: DemandeComplèteRaccordementTransmiseEventV1) => {
        await mediator.send<ExecuterAjouterGestionnaireRéseauProjetSaga>({
          type: 'EXECUTER_DÉCLARER_GESTIONNAIRE_RÉSEAU_PROJET_SAGA',
          data: event,
        });
      },
      streamCategory: 'raccordement',
    }),
  ];
};

const registerGestionnaireRéseauLauréat = (dependencies: GestionnaireRéseauLauréatDependencies) => {
  registerModifierGestionnaireRéseauProjetCommand(dependencies);
  registerModifierGestionnaireRéseauProjetUseCase();

  registerDéclarerGestionnaireRéseauProjetCommand(dependencies);
  registerExecuterAjouterGestionnaireRéseauProjetSaga();
};
