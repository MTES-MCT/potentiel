import { wrapInfra } from '../../../../core/utils';
import { GetUnnotifiedProjectsForPeriode } from '../../../../modules/project';
import { Project } from '../../projectionsNext';
import { AppelOffre, Periode } from '@potentiel/domain-views';

export const getUnnotifiedProjectsForPeriode: GetUnnotifiedProjectsForPeriode = (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id'],
) => {
  return wrapInfra(Project.findAll({ where: { notifiedOn: 0, appelOffreId, periodeId } })).map(
    (projects: any) =>
      projects.map((project) => ({
        projectId: project.id,
        candidateEmail: project.email,
        candidateName: project.nomRepresentantLegal,
        familleId: project.familleId,
      })),
  );
};
