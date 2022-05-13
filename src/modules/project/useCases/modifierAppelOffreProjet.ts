import { ResultAsync } from '@core/utils'
import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { AppelOffre } from '@entities'
import { Project } from '@modules/project'
import { EntityNotFoundError } from '@modules/shared'

type ModifierAppelOffreProjetDeps = {
  projectRepo: TransactionalRepository<Project>
  getAppelOffre: (appelOffreId: string) => ResultAsync<AppelOffre, EntityNotFoundError>
}

type ModifierAppelOffreProjetArgs = { appelOffreId: string; projectId: string }

export const makeModifierAppelOffreProjet = ({
  projectRepo,
  getAppelOffre,
}: ModifierAppelOffreProjetDeps) => {
  return ({ appelOffreId, projectId }: ModifierAppelOffreProjetArgs) => {
    return getAppelOffre(appelOffreId).andThen((appelOffre) =>
      projectRepo.transaction(new UniqueEntityID(projectId), (project: Project) =>
        project.modifierAppelOffre(appelOffre)
      )
    )
  }
}
