import { ResultAsync } from '../../../../core/utils'
import { GetNonLegacyProjectsByContactEmail } from '../../../../modules/project'
import { InfraNotAvailableError } from '../../../../modules/shared'
import { isPeriodeLegacy } from '../../../../dataAccess/inMemory'

import models from '../../models'

const { Project } = models

export const getNonLegacyProjectsByContactEmail: GetNonLegacyProjectsByContactEmail = (email) => {
  return ResultAsync.fromPromise(
    Project.findAll({
      where: { email },
      attributes: ['id', 'appelOffreId', 'periodeId'],
    }),
    () => new InfraNotAvailableError()
  ).andThen((projects: any[]) => ResultAsync.fromSafePromise(filterOutLegacyProjects(projects)))
}

async function filterOutLegacyProjects(projects: any[]): Promise<string[]> {
  const projectIds: string[] = []
  for (const { id, appelOffreId, periodeId } of projects) {
    if (!(await isPeriodeLegacy({ appelOffreId, periodeId }))) {
      projectIds.push(id)
    }
  }

  return projectIds
}
