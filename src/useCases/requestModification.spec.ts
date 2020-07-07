import makeRequestModification, {
  ACCESS_DENIED_ERROR,
} from './requestModification'

import makeFakeUser from '../__tests__/fixtures/user'

import { modificationRequestRepo } from '../dataAccess/inMemory'
import { request } from 'http'

describe('requestModification use-case', () => {
  describe('given user has no rights on this project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)

    const requestModification = makeRequestModification({
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        filename: 'fichier',
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: 'project1',
      })
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is not a porteur-projet', () => {
    const shouldUserAccessProject = jest.fn()

    const requestModification = makeRequestModification({
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'admin' })
      const requestResult = await requestModification({
        type: 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        filename: 'fichier',
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).not.toHaveBeenCalled()
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is the projects porteur-project', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    const requestModification = makeRequestModification({
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should register the modification request', async () => {
      const user = makeFakeUser({ id: '1234', role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'actionnaire' as 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        filename: 'fichier',
        user,
        projectId: 'project1',
      })

      expect(requestResult.is_ok()).toEqual(true)

      const allRequests = await modificationRequestRepo.findAll()

      expect(allRequests).toHaveLength(1)

      const newRequest = allRequests[0]
      expect(newRequest).toEqual(
        expect.objectContaining({
          type: 'actionnaire' as 'actionnaire',
          actionnaire: 'nouvel actionnaire',
          filename: 'fichier',
          userId: user.id,
          projectId: 'project1',
        })
      )
    })
  })
})
