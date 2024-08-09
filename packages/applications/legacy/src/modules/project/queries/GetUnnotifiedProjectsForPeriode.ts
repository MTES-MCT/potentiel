import { ResultAsync } from '../../../core/utils';
import { Project } from '../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InfraNotAvailableError } from '../../shared';

export interface UnnotifiedProjectDTO {
  projectId: Project['id'];
  familleId: Project['familleId'];
  candidateEmail: Project['email'];
  candidateName: Project['nomRepresentantLegal'];
}

export type GetUnnotifiedProjectsForPeriode = (
  appelOffreId: AppelOffre.AppelOffreReadModel['id'],
  periodeId: AppelOffre.Periode['id'],
) => ResultAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>;
