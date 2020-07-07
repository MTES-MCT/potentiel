import { v4 as uuid } from 'uuid'
import { ProjectRepo } from '../project'
import { makeProjectRepo } from './project'
import { makeUserRepo } from './user'
import { appelOffreRepo } from '../inMemory/appelOffre'
import { UserRepo } from '../user'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { Project } from '../../entities'

import {
  userRepo,
  projectRepo,
  initDatabase,
  resetDatabase,
  sequelize,
} from './'
import { Pagination } from '../../types'

const defaultPagination = { page: 0, pageSize: 10 } as Pagination

describe('userRepo sequelize', () => {
  beforeAll(async () => {
    await initDatabase()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('addUserToProjectsWithEmail(userId, email)', () => {
    it('should add the user to all projects that have the given email address', async () => {
      const userId = uuid()

      await userRepo.insert(
        makeFakeUser({
          id: userId,
        })
      )

      const targetProjet1 = uuid()
      const targetProjet2 = uuid()
      const targetEmail = 'test@test.test'

      await Promise.all(
        [
          {
            id: targetProjet1,
            email: targetEmail,
          },
          {
            id: targetProjet2,
            email: targetEmail,
          },
          {
            id: uuid(),
            email: 'other',
          },
        ]
          .map(makeFakeProject)
          .map(projectRepo.save)
      )

      const result = await userRepo.addUserToProjectsWithEmail(
        userId,
        targetEmail
      )

      expect(result.is_ok()).toBeTruthy()

      const UserModel = sequelize.model('user')
      const ProjectModel = sequelize.model('project')
      const userProjects = (
        await ProjectModel.findAll({
          attributes: ['id'],
          include: [{ model: UserModel, where: { id: userId } }],
        })
      ).map((item) => item.get().id)

      expect(userProjects).toHaveLength(2)
      expect(userProjects).toEqual(
        expect.arrayContaining([targetProjet1, targetProjet2])
      )
    })
  })
})
