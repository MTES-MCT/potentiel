import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';

export type GetProjectIdsForPeriode = (args: {
  appelOffreId: AppelOffre.AppelOffreReadModel['id'];
  periodeId: AppelOffre.Periode['id'];
  familleId?: string;
}) => ResultAsync<string[], InfraNotAvailableError>;
