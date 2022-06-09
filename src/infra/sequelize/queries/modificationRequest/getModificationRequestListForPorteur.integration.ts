import models from '../../models'
import { resetDatabase } from '../../helpers'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeFile from '../../../../__tests__/fixtures/file'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { getModificationRequestListForPorteur } from './getModificationRequestListForPorteur'
import { UniqueEntityID } from '@core/domain'
import { UnwrapForTest as OldUnwrapForTest } from '../../../../types'
import { makeUser } from '@entities'

/* 
Fonctionnalité : Retourner la liste des demandes de modifications 
associées aux projets auxquels le porteur a accès
*/

const { Project, User, File, ModificationRequest, UserProjects } = models

describe('Obtenir la liste des demandes de modification pour un porteur de projet', () => {
  describe('Etant donnés un projet A accessible par deux utilisateurs, et un projet B accessible par un seul de ces deux utilisateurs', () => {
    const fileId = new UniqueEntityID().toString()

    // Utilisateur 1
    const user1Id = new UniqueEntityID().toString()
    const fakeUser1 = OldUnwrapForTest(
      makeUser(
        makeFakeUser({
          id: user1Id,
          role: 'porteur-projet',
        })
      )
    )

    // Utilisateur 2
    const user2Id = new UniqueEntityID().toString()
    const fakeUser2 = OldUnwrapForTest(
      makeUser(
        makeFakeUser({
          id: user2Id,
          role: 'porteur-projet',
          email: 'email@test.test',
          fullName: 'John Doe',
        })
      )
    )

    // Projets
    const projectAId = new UniqueEntityID().toString()
    const projectBId = new UniqueEntityID().toString()

    const modification1 = new UniqueEntityID().toString()
    const modification2 = new UniqueEntityID().toString()
    const modification3 = new UniqueEntityID().toString()

    beforeAll(async () => {
      await resetDatabase()

      await User.create(fakeUser1)
      await User.create(fakeUser2)

      await Project.create(
        makeFakeProject({
          id: projectAId,
          nomProjet: 'nomProjet',
          communeProjet: 'communeProjet',
          departementProjet: 'departementProjet',
          regionProjet: 'regionProjet',
          appelOffreId: 'Fessenheim',
          periodeId: '1',
          familleId: 'familleId',
          unitePuissance: 'MWc',
        })
      )

      await Project.create(makeFakeProject({ id: projectBId }))

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await UserProjects.bulkCreate([
        { projectId: projectAId, userId: user1Id }, // l'utilisateur 1 a accès au projet A
        { projectId: projectAId, userId: user2Id }, // l'utilisateur 2 a accès au projet A
        { projectId: projectBId, userId: user2Id }, // L'utilisateur 2 a accès au projet B
      ])

      // L'utilisateur 1 demande une modification pour le projet A
      await ModificationRequest.create({
        projectId: projectAId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
        type: 'recours',
        id: modification1,
        userId: user1Id,
        authority: 'dgec',
      })

      // L'utilisateur 2 demande une modification pour le projet A
      await ModificationRequest.create({
        projectId: projectAId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
        type: 'recours',
        id: modification2,
        userId: user2Id,
        authority: 'dgec',
        justification: 'justification',
      })

      // L'utilisateur 2 demande une modification pour le projet B
      await ModificationRequest.create({
        projectId: projectBId,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
        type: 'recours',
        id: modification3,
        userId: user2Id,
        authority: 'dgec',
      })
    })

    it('Alors chaque utilisateur doit recevoir la liste des modifications associées aux projets auxquels il a accès', async () => {
      const resForUser1 = await getModificationRequestListForPorteur({
        user: fakeUser1,
        pagination: { page: 0, pageSize: 10 },
      })

      const resForUser2 = await getModificationRequestListForPorteur({
        user: fakeUser2,
        pagination: { page: 0, pageSize: 10 },
      })

      expect(resForUser1.isOk()).toBe(true)
      expect(resForUser2.isOk()).toBe(true)

      expect(resForUser1._unsafeUnwrap().itemCount).toEqual(2)
      expect(resForUser2._unsafeUnwrap().itemCount).toEqual(3)

      expect(resForUser1._unsafeUnwrap().items[0].id).toEqual(modification2)
      expect(resForUser1._unsafeUnwrap().items[1].id).toEqual(modification1)

      expect(resForUser1._unsafeUnwrap().items[0]).toMatchObject({
        id: modification2,
        status: 'envoyée',
        requestedOn: new Date(123),
        requestedBy: {
          email: 'email@test.test',
          fullName: 'John Doe',
        },
        attachmentFile: {
          filename: 'filename',
          id: fileId,
        },
        project: {
          nomProjet: 'nomProjet',
          communeProjet: 'communeProjet',
          departementProjet: 'departementProjet',
          regionProjet: 'regionProjet',
          appelOffreId: 'Fessenheim',
          periodeId: '1',
          familleId: 'familleId',
          unitePuissance: 'MWc', // see fessenheim.ts
        },
        type: 'recours',
        justification: 'justification',
      })
    })
  })
})
