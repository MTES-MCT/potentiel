import { wrapInfra } from '../../../../core/utils';
import { AppelOffre, Periode } from '../../../../entities';
import { GetUnnotifiedProjectsForPeriode } from '../../../../modules/project';
import { Project } from "../../projectionsNext";

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
