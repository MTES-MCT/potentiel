import { AppelOffre, Periode } from '@potentiel-domain/appel-offre';
import { ResultAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';

export type GetProjectIdsForPeriode = (args: {
  appelOffreId: AppelOffre['id'];
  periodeId: Periode['id'];
  familleId?: string;
}) => ResultAsync<string[], InfraNotAvailableError>;
