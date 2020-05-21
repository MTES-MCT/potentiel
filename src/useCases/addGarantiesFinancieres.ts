import { Project, User, makeProject } from '../entities'
import { ProjectRepo } from '../dataAccess'
import _ from 'lodash'
import { ResultAsync, Ok, Err, ErrorResult } from '../types'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
}

interface CallUseCaseProps {
  filename: string
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED =
  "Vous n'avez pas le droit de déposer les garanties financières pour ce projet."

export default function makeAddGarantiesFinancieres({
  projectRepo,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function addGarantiesFinancieres({
    filename,
    date,
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const res = await projectRepo.update(projectId, {
      garantiesFinancieresDate: date,
      garantiesFinancieresFile: filename,
      garantiesFinancieresSubmittedOn: Date.now(),
      garantiesFinancieresSubmittedBy: user.id,
    })

    if (res.is_err()) return Err(res.unwrap_err())
    return Ok(null)
  }
}
