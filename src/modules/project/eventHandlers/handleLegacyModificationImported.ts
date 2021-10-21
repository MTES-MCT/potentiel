import { Project } from '..'
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { LegacyDelai, LegacyModificationImported } from '../../modificationRequest'

export const handleLegacyModificationImported = (deps: {
  projectRepo: TransactionalRepository<Project>
}) => async (event: LegacyModificationImported) => {
  const { projectRepo } = deps
  const { projectId, modifications } = event.payload

  const delaiModifications = modifications.filter(({ type }) => type === 'delai') as LegacyDelai[]

  if (!delaiModifications.length) return

  for (const { nouvelleDateLimiteAchevement } of delaiModifications) {
    await projectRepo.transaction(new UniqueEntityID(projectId), (project) => {
      return project.setCompletionDueDate(nouvelleDateLimiteAchevement)
    })
  }
}
