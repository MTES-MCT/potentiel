import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauLauréatDependencies,
  registerConsulterGestionnaireRéseauLauréatQuery,
} from './gestionnaireRéseau/consulter/consulterGestionnaireRéseauLauréat.query';
import {
  ListerAbandonAvecRecandidatureDependencies,
  registerListerAbandonAvecRecandidatureQuery,
} from './abandon/lister/listerAbandon.query';
import { AbandonEvent, GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import {
  ExecuteGestionnaireRéseauLauréatProjector,
  GestionnaireRéseauLauréatProjectorDependencies,
  registerGestionnaireRéseauLauréatProjector,
} from './gestionnaireRéseau/gestionnaireRéseau.projector';
import {
  ConsulterPièceJustificativeAbandonProjetDependencies,
  registerConsulterPièceJustificativeAbandonProjetQuery,
} from './abandon/consulter/consulterPièceJustificativeAbandon.query';
import { ExecuteAbandonProjector, registerAbandonProjector } from './abandon/abandon.projector';
import { registerConsulterAbandonQuery } from './abandon/consulter/consulterAbandon.query';
import {
  ConsulterRéponseSignéeAbandonDependencies,
  registerConsulterRéponseAbandonSignéeQuery,
} from './abandon/consulter/consulterRéponseSignéeAbandon.query';

type GestionnaireRéseauLauréatDependencies = ConsulterGestionnaireRéseauLauréatDependencies;

type AbandonDependencies = ListerAbandonAvecRecandidatureDependencies &
  ConsulterPièceJustificativeAbandonProjetDependencies &
  ConsulterRéponseSignéeAbandonDependencies;

// Setup
export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies &
  AbandonDependencies &
  GestionnaireRéseauLauréatProjectorDependencies;

export const setupLauréatViews = async (dependencies: LauréatDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerConsulterGestionnaireRéseauLauréatQuery(dependencies);
  registerListerAbandonAvecRecandidatureQuery(dependencies);
  registerConsulterPièceJustificativeAbandonProjetQuery(dependencies);
  registerConsulterRéponseAbandonSignéeQuery(dependencies);

  // Projector
  registerGestionnaireRéseauLauréatProjector(dependencies);
  registerAbandonProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe({
      name: 'projector-gestionnaire-reseau',
      eventType: [
        'GestionnaireRéseauProjetDéclaré-V1',
        'GestionnaireRéseauProjetModifié-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event: GestionnaireRéseauProjetEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteGestionnaireRéseauLauréatProjector>({
          type: 'EXECUTE_GESTIONNAIRE_RÉSEAU_LAURÉAT_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'projet',
    }),
    await subscribe({
      name: 'projector',
      eventType: [
        'AbandonDemandé-V1',
        'AbandonAccordé-V1',
        'AbandonAnnulé-V1',
        'AbandonConfirmé-V1',
        'AbandonRejeté-V1',
        'ConfirmationAbandonDemandée-V1',
        'RebuildTriggered',
      ],
      eventHandler: async (event: AbandonEvent | RebuildTriggered) => {
        await mediator.publish<ExecuteAbandonProjector>({
          type: 'EXECUTE_ABANDON_PROJECTOR',
          data: event,
        });
      },
      streamCategory: 'abandon',
    }),
  ];
};
