import { AutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase';
import { ListerAccèsQuery } from './lister/listerAccès.query';
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
export type AttestationConformitéQuery = VérifierAccèsProjetQuery | ListerAccèsQuery;

export { VérifierAccèsProjetQuery, ListerAccèsQuery };

// Events
export * from './accès.event';
export * from './autoriser/autoriserAccèsProjet.event';
export * from './retirer/retirerAccèsProjet.event';

// Entities
export * from './accès.entity';

// Errors
export * from './accès.error';
