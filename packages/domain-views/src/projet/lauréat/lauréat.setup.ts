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
import { GestionnaireRéseauProjetEvent } from '@potentiel/domain';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import { ExecuteGestionnaireRéseauLauréatProjector } from './gestionnaireRéseau/gestionnaireRéseau.projector';
import { ConsulterPiéceJustificativeAbandonProjetDependencies } from './abandon/consulter/consulterPiéceJustificativeAbandon.query';

type GestionnaireRéseauLauréatDependencies = ConsulterGestionnaireRéseauLauréatDependencies;
type AbandonDependencies = ListerAbandonAvecRecandidatureDependencies &
  ConsulterPiéceJustificativeAbandonProjetDependencies;

// Setup
export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies &
  AbandonDependencies;

export const setupLauréatViews = async (dependencies: LauréatDependencies) => {
  registerConsulterGestionnaireRéseauLauréatQuery(dependencies);
  registerListerAbandonAvecRecandidatureQuery(dependencies);

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
  ];
};
