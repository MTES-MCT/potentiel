import { UniqueEntityID } from '@core/domain'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { LegacyModificationImported } from '../../modificationRequest/events'
import { Project } from '../Project'
import { handleLegacyModificationImported } from './handleLegacyModificationImported'

describe('handleLegacyModificationImported', () => {
  const projectId = new UniqueEntityID().toString()
  const importId = new UniqueEntityID().toString()
  const modificationId = new UniqueEntityID().toString()
  const modifiedOn = 123

  describe('when none of the modifications are of type delai or abandon', () => {
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
                type: 'autre',
                column: 'a',
                value: 'b',
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
      expect(fakeProject.abandonLegacy).not.toHaveBeenCalled()
    })
  })

  describe('when one of the modifications is a "delai" request that is not accepted', () => {
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
                accepted: false,
              },
            ],
          },
        })
      )
    })

    it('should not call Project.setCompletionDueDate()', () => {
      expect(fakeProject.setCompletionDueDate).not.toHaveBeenCalledWith(123456)
    })
  })

  describe('when one of the modifications is a "delai" request that is accepted', () => {
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
                accepted: true,
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

  describe('when one of the modifications is a "abandon" request that is rejected', () => {
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
                accepted: false,
              },
            ],
          },
        })
      )
    })

    it('should not call Project.abandonLegacy()', () => {
      expect(fakeProject.abandonLegacy).not.toHaveBeenCalledWith(modifiedOn)
    })
  })

  describe('when one of the modifications is a "abandon" request that is accepted', () => {
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
                accepted: true,
              },
            ],
          },
        })
      )
    })

    it('should call Project.abandonLegacy()', () => {
      expect(fakeProject.abandonLegacy).toHaveBeenCalledWith(modifiedOn)
    })
  })

  describe('when several of the modifications are of type abandon', () => {
    const fakeProject = makeFakeProject()
    const projectRepo = fakeTransactionalRepo<Project>(fakeProject as Project)
    const earlierModifiedOn = 1
    const latterModifiedOn = 2

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
                modifiedOn: latterModifiedOn,
                modificationId,
                accepted: true,
              },
              {
                type: 'abandon',
                modifiedOn: earlierModifiedOn,
                modificationId,
                accepted: true,
              },
            ],
          },
        })
      )
    })

    it('should call Project.abandonLegacy() on the latter of the modifications of type abandon', () => {
      expect(fakeProject.abandonLegacy).toHaveBeenCalledTimes(1)
      expect(fakeProject.abandonLegacy).toHaveBeenCalledWith(latterModifiedOn)
    })
  })
})
