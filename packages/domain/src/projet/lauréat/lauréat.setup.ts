import { Subscribe } from '@potentiel/core-domain';
import {
  DéclarerGestionnaireRéseauProjetDependencies,
  registerDéclarerGestionnaireRéseauProjetCommand,
} from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseauProjet.command';
import {
  ModifierGestionnaireRéseauProjetDependencies,
  registerModifierGestionnaireRéseauProjetCommand,
} from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.command';
import {
  DemanderAbandonDependencies,
  registerDemanderAbandonCommand,
} from './abandon/demander/demanderAbandon.command';
import {
  AccorderAbandonDependencies,
  registerAccorderAbandonCommand,
} from './abandon/accorder/accorderAbandon.command';
import {
  ConfirmerAbandonDependencies,
  registerConfirmerAbandonCommand,
} from './abandon/confirmer/confirmerAbandon.command';
import {
  DemanderConfirmationAbandonDependencies,
  registerDemanderConfirmationAbandonCommand,
} from './abandon/demander/demanderConfirmationAbandon.command';
import {
  RejeterAbandonDependencies,
  registerRejeterAbandonCommand,
} from './abandon/rejeter/rejeterAbandon.command';
import { registerModifierGestionnaireRéseauProjetUseCase } from './gestionnaireRéseau/modifier/modifierGestionnaireRéseauProjet.usecase';
import {
  ExecuterAjouterGestionnaireRéseauProjetSaga,
  registerExecuterAjouterGestionnaireRéseauProjetSaga,
} from './gestionnaireRéseau/déclarer/déclarerGestionnaireRéseau.saga';
import { registerDemanderAbandonAvecRecandidatureUseCase } from './abandon/demander/demanderAbandon.usecase';
import { registerAccorderAbandonUseCase } from './abandon/accorder/accorderAbandon.usecase';
import { registerDemanderConfirmationAbandonUseCase } from './abandon/demander/demanderConfirmationAbandon.usecase';
import { registerRejeterAbandonUseCase } from './abandon/rejeter/rejeterAbandon.usecase';
import { registerConfirmerAbandonUseCase } from './abandon/confirmer/confirmerAbandon.usecase';
import { DemandeComplèteRaccordementTransmiseEvent } from '../../raccordement/raccordement.event';
import { mediator } from 'mediateur';
import { registerAnnulerAbandonCommand } from './abandon/annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './abandon/annuler/annulerAbandon.usecase';

type GestionnaireRéseauLauréatDependencies = DéclarerGestionnaireRéseauProjetDependencies &
  ModifierGestionnaireRéseauProjetDependencies;
type AbandonDependencies = AccorderAbandonDependencies &
  ConfirmerAbandonDependencies &
  DemanderAbandonDependencies &
  DemanderConfirmationAbandonDependencies &
  RejeterAbandonDependencies;

export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies &
  AbandonDependencies;

export const setupLauréat = async (dependencies: LauréatDependencies) => {
  registerGestionnaireRéseauLauréat(dependencies);
  registerAbandon(dependencies);

  // Subscribe
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

const registerGestionnaireRéseauLauréat = (dependencies: GestionnaireRéseauLauréatDependencies) => {
  registerModifierGestionnaireRéseauProjetCommand(dependencies);
  registerModifierGestionnaireRéseauProjetUseCase();

  registerDéclarerGestionnaireRéseauProjetCommand(dependencies);
  registerExecuterAjouterGestionnaireRéseauProjetSaga();
};

const registerAbandon = (dependencies: LauréatDependencies) => {
  registerDemanderAbandonCommand(dependencies);
  registerAccorderAbandonCommand(dependencies);
  registerConfirmerAbandonCommand(dependencies);
  registerDemanderConfirmationAbandonCommand(dependencies);
  registerRejeterAbandonCommand(dependencies);
  registerAnnulerAbandonCommand(dependencies);

  registerDemanderAbandonAvecRecandidatureUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
};
