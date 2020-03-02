import { Project } from '../entities'
import { ProjectRepo } from '../dataAccess'

interface MakeProps {
  projectRepo: ProjectRepo
}

interface CallProps {
  projects: Array<Project>
}

export default function makeImportProjects({ projectRepo }: MakeProps) {
  return async function importProjects({ projects }: CallProps): Promise<void> {
    await projectRepo.insertMany(projects)
  }
}
