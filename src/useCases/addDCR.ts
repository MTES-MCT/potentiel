import {
  Project,
  User,
  makeProject,
  applyProjectUpdate,
  NotificationProps,
} from '../entities'
import { ProjectRepo, UserRepo, ProjectAdmissionKeyRepo } from '../dataAccess'
import _ from 'lodash'
import moment from 'moment'
import { ResultAsync, Ok, Err, ErrorResult } from '../types'
import routes from '../routes'

interface MakeUseCaseProps {
  findProjectById: ProjectRepo['findById']
  saveProject: ProjectRepo['save']
  shouldUserAccessProject: (args: {
    user: User
    projectId: Project['id']
  }) => Promise<boolean>
}

interface CallUseCaseProps {
  filename: string
  numeroDossier: string
  date: number
  projectId: Project['id']
  user: User
}

export const UNAUTHORIZED = "Vous n'avez pas de droits pour ce projet."

export const SYSTEM_ERROR =
  'Une erreur système est survenue, merci de réessayer ou de contacter un administrateur si le problème persiste.'

export default function makeAddDCR({
  findProjectById,
  saveProject,
  shouldUserAccessProject,
}: MakeUseCaseProps) {
  return async function addDCR({
    filename,
    numeroDossier,
    date,
    projectId,
    user,
  }: CallUseCaseProps): ResultAsync<null> {
    // console.log('addDCR', filename, numeroDossier, date)
    const access = await shouldUserAccessProject({ user, projectId })

    if (!access) return ErrorResult(UNAUTHORIZED)

    const project = await findProjectById(projectId)

    if (!project) {
      console.log('addDCR failed because projectRes.is_none()')
      return ErrorResult(UNAUTHORIZED)
    }

    const updatedProject = applyProjectUpdate({
      project,
      update: {
        dcrDate: date,
        dcrFile: filename,
        dcrNumeroDossier: numeroDossier,
        dcrSubmittedOn: Date.now(),
        dcrSubmittedBy: user.id,
      },
      context: {
        userId: user.id,
        type: 'dcr-submission',
      },
    })

    if (!updatedProject) {
      // OOPS
      console.log('addDCR use-case: applyProjectUpdate returned null')

      return ErrorResult(SYSTEM_ERROR)
    }

    const res = await saveProject(updatedProject)

    if (res.is_err()) return Err(res.unwrap_err())

    return Ok(null)
  }
}
