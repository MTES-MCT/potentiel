import { AutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase';
import { ListerAccèsQuery, ListerAccèsReadModel } from './lister/listerAccès.query';
import {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from './lister/listerProjetsÀRéclamer.query';
import { ConsulterAccèsQuery, ConsulterAccèsReadModel } from './consulter/consulterAccès.query';
import { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import { RéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase';
import { VérifierAccèsProjetQuery } from './vérifier/vérifierAccèsProjet.query';

// UseCases
export type AccèsUseCase =
  | AutoriserAccèsProjetUseCase
  | RéclamerAccèsProjetUseCase
  | RetirerAccèsProjetUseCase;

export { AutoriserAccèsProjetUseCase, RéclamerAccèsProjetUseCase, RetirerAccèsProjetUseCase };

// Query
export type AttestationConformitéQuery =
  | VérifierAccèsProjetQuery
  | ListerAccèsQuery
  | ListerProjetsÀRéclamerQuery
  | ConsulterAccèsQuery;

export {
  VérifierAccèsProjetQuery,
  ListerAccèsQuery,
  ListerProjetsÀRéclamerQuery,
  ConsulterAccèsQuery,
};

// Readmodels
export { ListerAccèsReadModel, ListerProjetsÀRéclamerReadModel, ConsulterAccèsReadModel };

// Events
export * from './accès.event';
export * from './autoriser/autoriserAccèsProjet.event';
export * from './retirer/retirerAccèsProjet.event';

// Entities
export * from './accès.entity';

// Errors
export * from './accès.error';
