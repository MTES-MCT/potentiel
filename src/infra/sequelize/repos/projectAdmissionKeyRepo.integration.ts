import { UniqueEntityID } from '../../../core/domain'
import models from '../models'
import { resetDatabase } from '../helpers'

import { makeProjectAdmissionKeyRepo } from './projectAdmissionKeyRepo'
import { EntityNotFoundError } from '../../../modules/shared'
import { UnwrapForTest } from '../../../types'
import { makeProjectAdmissionKey } from '../../../entities'

const { ProjectAdmissionKey } = models

const projectAdmissionKeyRepo = makeProjectAdmissionKeyRepo(models)

describe('sequelize projectAdmissionKeyRepo', () => {
  describe('save()', () => {
    describe('when projectAdmissionKey with id does not exist', () => {
      const projectAdmissionKeyId = new UniqueEntityID().toString()

      beforeAll(async () => {
        await resetDatabase()
      })

      it('should save the projectAdmissionKey', async () => {
        const projectAdmissionKey = {
          id: projectAdmissionKeyId,
          email: 'test@test.test',
          fullName: 'John Doe',
        }

        const res = await projectAdmissionKeyRepo.save(projectAdmissionKey)

        expect(res.isOk()).toBe(true)

        const savedProjectAdmissionKey = await ProjectAdmissionKey.findByPk(projectAdmissionKeyId)
        expect(savedProjectAdmissionKey).not.toBeNull()
        expect(savedProjectAdmissionKey).toMatchObject({
          id: projectAdmissionKeyId,
          email: 'test@test.test',
          fullName: 'John Doe',
        })
      })
    })

    describe('when projectAdmissionKey with id exists', () => {
      const projectAdmissionKeyId = new UniqueEntityID().toString()

      beforeAll(async () => {
        await resetDatabase()

        await ProjectAdmissionKey.bulkCreate([
          {
            id: projectAdmissionKeyId,
            fullName: 'John Doe',
            email: 'test@test.test',
          },
        ])
      })

      it('should update the projectAdmissionKey', async () => {
        const projectAdmissionKey = {
          id: projectAdmissionKeyId,
          email: 'test@test.test',
          fullName: 'Jane Doe',
        }

        const res = await projectAdmissionKeyRepo.save(projectAdmissionKey)

        expect(res.isOk()).toBe(true)

        const updatedProjectAdmissionKey = await ProjectAdmissionKey.findByPk(projectAdmissionKeyId)
        expect(updatedProjectAdmissionKey).not.toBeNull()
        expect(updatedProjectAdmissionKey).toMatchObject({
          id: projectAdmissionKeyId,
          email: 'test@test.test',
          fullName: 'Jane Doe',
        })
      })
    })
  })

  describe('load()', () => {
    describe('when projectAdmissionKey with id exists', () => {
      const projectAdmissionKeyId = new UniqueEntityID()

      beforeAll(async () => {
        await resetDatabase()

        await ProjectAdmissionKey.bulkCreate([
          {
            id: projectAdmissionKeyId.toString(),
            fullName: 'John Doe',
            email: 'test@test.test',
          },
        ])
      })

      it('should return the projectAdmissionKey', async () => {
        const res = await projectAdmissionKeyRepo.load(projectAdmissionKeyId)

        expect(res._unsafeUnwrap()).toMatchObject({
          id: projectAdmissionKeyId.toString(),
          fullName: 'John Doe',
          email: 'test@test.test',
        })
      })
    })

    describe('when projectAdmissionKey with id does not exist', () => {
      const projectAdmissionKeyId = new UniqueEntityID()

      beforeAll(async () => {
        await resetDatabase()
      })

      it('should return the projectAdmissionKey', async () => {
        const res = await projectAdmissionKeyRepo.load(projectAdmissionKeyId)

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError)
      })
    })
  })
})
