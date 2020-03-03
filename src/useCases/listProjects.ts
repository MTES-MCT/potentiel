import { Project, makeProject } from '../entities'
import { ProjectRepo } from '../dataAccess'

interface MakeUseCaseProps {
  projectRepo: ProjectRepo
}

interface CallUseCaseProps {}

export default function makeImportProjects({ projectRepo }: MakeUseCaseProps) {
  return async function listProjects(
    props: CallUseCaseProps
  ): Promise<Array<Project>> {
    return projectRepo.findAll()
  }
}
