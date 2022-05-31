import { v4 as uuid } from 'uuid'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { userRepo, projectRepo, resetDatabase } from './'
import { sequelizeInstance } from '../../sequelize.config'

describe('userRepo sequelizeInstance', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('addToDreal', () => {
    const userId = uuid()
    beforeAll(async () => {
      const UserModel = sequelizeInstance.model('user')

      await UserModel.create({
        id: userId,
        fullName: '',
        email: '',
        role: 'dreal',
      })
    })

    it('should add the dreal to the user', async () => {
      await userRepo.addToDreal(userId, 'Corse')

      const UserDrealModel = sequelizeInstance.model('userDreal')

      const userDreals = await UserDrealModel.findAll({ where: { userId } })

      expect(userDreals).toHaveLength(1)
      expect(userDreals[0].dreal).toEqual('Corse')
    })
  })

  describe('findUsersForDreal', () => {
    const userId = uuid()

    it('return the users associated to the dreal', async () => {
      const UserModel = sequelizeInstance.model('user')
      const UserDrealModel = sequelizeInstance.model('userDreal')

      await UserModel.create({
        id: userId,
        fullName: 'fullName',
        email: 'email@test.test',
        role: 'dreal',
      })

      await UserDrealModel.create({
        userId,
        dreal: 'Corse',
      })

      const drealUsers = await userRepo.findUsersForDreal('Corse')

      expect(drealUsers).toHaveLength(1)
      expect(drealUsers[0].fullName).toEqual('fullName')
      expect(drealUsers[0].email).toEqual('email@test.test')
      expect(drealUsers[0].role).toEqual('dreal')
    })
  })

  describe('findDrealsForUser', () => {
    const userId = uuid()

    it('return the dreals associated to the user', async () => {
      const UserModel = sequelizeInstance.model('user')
      const UserDrealModel = sequelizeInstance.model('userDreal')

      await UserModel.create({
        id: userId,
        fullName: 'fullName',
        email: 'email@test.test',
        role: 'dreal',
      })

      await UserDrealModel.create({
        userId,
        dreal: 'Corse',
      })

      const dreals = await userRepo.findDrealsForUser(userId)

      expect(dreals).toHaveLength(1)
      expect(dreals[0]).toEqual('Corse')
    })
  })

  describe('addProjectToUserWithEmail(projectId, email)', () => {
    describe('when a user with this email exists', () => {
      it('should add the user to the project', async () => {
        const userId = uuid()
        const targetEmail = 'test@test.test'

        await userRepo.insert(
          makeFakeUser({
            id: userId,
            email: targetEmail,
          })
        )

        const targetProjetId = uuid()

        await Promise.all(
          [
            {
              id: targetProjetId,
              email: targetEmail,
            },
          ]
            .map(makeFakeProject)
            .map(projectRepo.save)
        )

        const result = await userRepo.addProjectToUserWithEmail(targetProjetId, targetEmail)

        expect(result.isOk()).toBeTruthy()

        const UserModel = sequelizeInstance.model('user')
        const ProjectModel = sequelizeInstance.model('project')
        const userInstance = await UserModel.findByPk(userId)
        const projectInstance = await ProjectModel.findByPk(targetProjetId)

        expect(await userInstance.hasProject(projectInstance)).toEqual(true)
      })
    })
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

      const result = await userRepo.addUserToProjectsWithEmail(userId, targetEmail)

      expect(result.isOk()).toBeTruthy()

      const UserModel = sequelizeInstance.model('user')
      const ProjectModel = sequelizeInstance.model('project')
      const userProjects = (
        await ProjectModel.findAll({
          attributes: ['id'],
          include: [{ model: UserModel, where: { id: userId } }],
        })
      ).map((item) => item.get().id)

      expect(userProjects).toHaveLength(2)
      expect(userProjects).toEqual(expect.arrayContaining([targetProjet1, targetProjet2]))
    })
  })
})
