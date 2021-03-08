import { errAsync, wrapInfra } from '../../../core/utils'
import { AppelOffre, Periode } from '../../../entities'
import { GetUnnotifiedProjectsForPeriode } from '../../../modules/project/queries'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeGetUnnotifiedProjectsForPeriode = (models): GetUnnotifiedProjectsForPeriode => (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id']
) => {
  const ProjectModel = models.Project
  if (!ProjectModel) return errAsync(new InfraNotAvailableError())

  return wrapInfra(ProjectModel.findAll({ where: { notifiedOn: 0, appelOffreId, periodeId } })).map(
    (projects: any) =>
      projects.map((project) => ({
        projectId: project.id,
        candidateEmail: project.email,
        candidateName: project.nomRepresentantLegal,
        familleId: project.familleId,
      }))
  )
}
