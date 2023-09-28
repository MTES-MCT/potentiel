import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauLauréatDependencies,
  registerConsulterGestionnaireRéseauLauréatQuery,
} from './gestionnaireRéseau/consulter/consulterGestionnaireRéseauLauréat.query';
import {
  ListerAbandonAvecRecandidatureDependencies,
  registerListerAbandonAvecRecandidatureQuery,
} from './abandon/lister/listerAbandonAvecRecandidature.query';
import { AbandonEvent, GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import {
  ExecuteGestionnaireRéseauLauréatProjector,
  GestionnaireRéseauLauréatProjectorDependencies,
  registerGestionnaireRéseauLauréatProjector,
} from './gestionnaireRéseau/gestionnaireRéseau.projector';
import { ConsulterPiéceJustificativeAbandonProjetDependencies } from './abandon/consulter/consulterPiéceJustificativeAbandon.query';
import { ExecuteAbandonProjector, registerAbandonProjector } from './abandon/abandon.projector';

type GestionnaireRéseauLauréatDependencies = ConsulterGestionnaireRéseauLauréatDependencies;
type AbandonDependencies = ListerAbandonAvecRecandidatureDependencies &
  ConsulterPiéceJustificativeAbandonProjetDependencies;

// Setup
export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies &
  AbandonDependencies &
  GestionnaireRéseauLauréatProjectorDependencies;

export const setupLauréatViews = async (dependencies: LauréatDependencies) => {
  registerConsulterGestionnaireRéseauLauréatQuery(dependencies);
  registerListerAbandonAvecRecandidatureQuery(dependencies);

  // Projector
  registerGestionnaireRéseauLauréatProjector(dependencies);
  registerAbandonProjector(dependencies);

  // Subscribes
  const { subscribe } = dependencies;
  return [
    await subscribe({
      name: 'projector-gestionnaire-reseau',
      eventType: [
        'GestionnaireRéseauProjetDéclaré',
        'GestionnaireRéseauProjetModifié',
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
      eventType: ['AbandonDemandé-V1', 'RebuildTriggered'],
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
