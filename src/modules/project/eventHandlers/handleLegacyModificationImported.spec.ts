import { UniqueEntityID } from '../../../core/domain'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { LegacyModificationImported } from '../../modificationRequest/events'
import { Project } from '../Project'
import { handleLegacyModificationImported } from './handleLegacyModificationImported'

describe('handleLegacyModificationImported', () => {
  const projectId = new UniqueEntityID().toString()
  const importId = new UniqueEntityID().toString()
  const modificationId = new UniqueEntityID().toString()
  const modifiedOn = 123

  describe('when none of the modifications are of type delai', () => {
    const fakeProject = makeFakeProject()
    const projectRepo = fakeTransactionalRepo<Project>(fakeProject as Project)

    beforeAll(async () => {
      await handleLegacyModificationImported({
        projectRepo,
      })(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'abandon',
                modifiedOn,
                modificationId,
              },
            ],
          },
        })
      )
    })

    it('should ignore the event', () => {
      expect(fakeProject.setCompletionDueDate).not.toHaveBeenCalled()
    })
  })

  describe('when one of the modifications is of type delai', () => {
    const fakeProject = makeFakeProject()
    const projectRepo = fakeTransactionalRepo<Project>(fakeProject as Project)

    beforeAll(async () => {
      await handleLegacyModificationImported({
        projectRepo,
      })(
        new LegacyModificationImported({
          payload: {
            projectId,
            importId,
            modifications: [
              {
                type: 'delai',
                nouvelleDateLimiteAchevement: 123456,
                ancienneDateLimiteAchevement: 123,
                modifiedOn,
                modificationId,
              },
            ],
          },
        })
      )
    })

    it('should call Project.setCompletionDueDate()', () => {
      expect(fakeProject.setCompletionDueDate).toHaveBeenCalledWith(123456)
    })
  })
})
