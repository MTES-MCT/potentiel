import type { AutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase.js';
import type {
  ConsulterAccèsQuery,
  ConsulterAccèsReadModel,
} from './consulter/consulterAccès.query.js';
import type { ListerAccèsQuery, ListerAccèsReadModel } from './lister/listerAccès.query.js';
import type {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from './lister/listerProjetsÀRéclamer.query.js';
import type { RemplacerAccèsProjetUseCase } from './remplacer/remplacerAccèsProjet.usecase.js';
import type { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase.js';
import type { RéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase.js';
import type { VérifierAccèsProjetQuery } from './vérifier/vérifierAccèsProjet.query.js';

// UseCases
export type AccèsUseCase =
  | AutoriserAccèsProjetUseCase
  | RéclamerAccèsProjetUseCase
  | RetirerAccèsProjetUseCase
  | RemplacerAccèsProjetUseCase;

export type {
  AutoriserAccèsProjetUseCase,
  RemplacerAccèsProjetUseCase,
  RetirerAccèsProjetUseCase,
  RéclamerAccèsProjetUseCase,
};

// Query
export type AttestationConformitéQuery =
  | VérifierAccèsProjetQuery
  | ListerAccèsQuery
  | ListerProjetsÀRéclamerQuery
  | ConsulterAccèsQuery;

// Entities
export type * from './accès.entity.js';
// Errors
export * from './accès.error.js';
// Events
export type * from './accès.event.js';
export type * from './autoriser/autoriserAccèsProjet.event.js';
export type * from './remplacer/remplacerAccèsProjet.event.js';
export type * from './retirer/retirerAccèsProjet.event.js';
// Readmodels
export type {
  ConsulterAccèsQuery,
  ConsulterAccèsReadModel,
  ListerAccèsQuery,
  ListerAccèsReadModel,
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
  VérifierAccèsProjetQuery,
};
