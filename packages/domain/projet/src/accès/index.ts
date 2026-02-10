import { AutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase.js';
import { ListerAccèsQuery, ListerAccèsReadModel } from './lister/listerAccès.query.js';
import {
  ListerProjetsÀRéclamerQuery,
  ListerProjetsÀRéclamerReadModel,
} from './lister/listerProjetsÀRéclamer.query.js';
import { ConsulterAccèsQuery, ConsulterAccèsReadModel } from './consulter/consulterAccès.query.js';
import { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase.js';
import { RéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase.js';
import { VérifierAccèsProjetQuery } from './vérifier/vérifierAccèsProjet.query.js';
import { RemplacerAccèsProjetUseCase } from './remplacer/remplacerAccèsProjet.usecase.js';

// UseCases
export type AccèsUseCase =
  | AutoriserAccèsProjetUseCase
  | RéclamerAccèsProjetUseCase
  | RetirerAccèsProjetUseCase
  | RemplacerAccèsProjetUseCase;

export type {
  AutoriserAccèsProjetUseCase,
  RéclamerAccèsProjetUseCase,
  RetirerAccèsProjetUseCase,
  RemplacerAccèsProjetUseCase,
};

// Query
export type AttestationConformitéQuery =
  | VérifierAccèsProjetQuery
  | ListerAccèsQuery
  | ListerProjetsÀRéclamerQuery
  | ConsulterAccèsQuery;

export type {
  VérifierAccèsProjetQuery,
  ListerAccèsQuery,
  ListerProjetsÀRéclamerQuery,
  ConsulterAccèsQuery,
};

// Readmodels
export type { ListerAccèsReadModel, ListerProjetsÀRéclamerReadModel, ConsulterAccèsReadModel };

// Events
export type * from './accès.event.js';
export type * from './autoriser/autoriserAccèsProjet.event.js';
export type * from './retirer/retirerAccèsProjet.event.js';
export type * from './remplacer/remplacerAccèsProjet.event.js';

// Entities
export type * from './accès.entity.js';

// Errors
export * from './accès.error.js';
