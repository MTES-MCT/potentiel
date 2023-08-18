import { ResultAsync } from '../../../core/utils';
import { Project } from '../../../entities';
import { AppelOffre, Periode } from '@potentiel/domain-views';
import { InfraNotAvailableError } from '../../shared';

export interface UnnotifiedProjectDTO {
  projectId: Project['id'];
  familleId: Project['familleId'];
  candidateEmail: Project['email'];
  candidateName: Project['nomRepresentantLegal'];
}

export type GetUnnotifiedProjectsForPeriode = (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id'],
) => ResultAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>;
