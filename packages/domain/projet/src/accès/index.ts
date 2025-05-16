import { RetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import { RéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase';
import { VérifierAccèsProjetQuery } from './vérifier/vérifierAccèsProjet.query';

// UseCases
export type AccèsUseCase = RéclamerAccèsProjetUseCase | RetirerAccèsProjetUseCase;

export { RéclamerAccèsProjetUseCase, RetirerAccèsProjetUseCase };

// Query
export type AttestationConformitéQuery = VérifierAccèsProjetQuery;

export { VérifierAccèsProjetQuery };

// Events
export * from './accès.event';
export * from './retirer/retirerAccèsProjet.event';

// Entities
export * from './accès.entity';

// Errors
export * from './accès.error';
