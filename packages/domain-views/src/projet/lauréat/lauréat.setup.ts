import { mediator } from 'mediateur';
import { Subscribe } from '@potentiel/core-domain';
import { ConsulterGestionnaireRéseauLauréatDependencies } from './gestionnaireRéseau/consulter/consulterGestionnaireRéseauLauréat.query';
import { GestionnaireRéseauProjetEvent } from '@potentiel/domain-usecases';
import { RebuildTriggered } from '@potentiel/core-domain-views';
import {
  ExecuteGestionnaireRéseauLauréatProjector,
  GestionnaireRéseauLauréatProjectorDependencies,
  registerGestionnaireRéseauLauréatProjector,
} from './gestionnaireRéseau/gestionnaireRéseau.projector';

type GestionnaireRéseauLauréatDependencies = ConsulterGestionnaireRéseauLauréatDependencies;

// Setup
export type LauréatDependencies = { subscribe: Subscribe } & GestionnaireRéseauLauréatDependencies &
  GestionnaireRéseauLauréatProjectorDependencies;

export const setupLauréatViews = async (dependencies: LauréatDependencies) => {
  // Projector
  registerGestionnaireRéseauLauréatProjector(dependencies);

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
  ];
};
