import { ResultAsync } from '@core/utils';
import { InfraNotAvailableError, EntityNotFoundError } from '../../shared';

export type RésuméProjetReadModel = {
  id: string;
  nomProjet: string;
  nomCandidat: string;
  communeProjet: string;
  regionProjet: string;
  departementProjet: string;
  periodeId: string;
  familleId: string;
  notifiedOn: number;
  appelOffreId: string;
  identifiantGestionnaire?: string;
  gestionnaireRéseau?: { codeEIC: string; raisonSociale: string };
  puissance: number;
  unitePuissance: string;
};

export type RésuméProjetQueryHandler = (
  projetId: string,
) => ResultAsync<RésuméProjetReadModel, EntityNotFoundError | InfraNotAvailableError>;
