import models from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeFile from '../../../../__tests__/fixtures/file'
import { getModificationRequestListForPorteur } from './getModificationRequestListForPorteur'
import { UniqueEntityID } from '@core/domain'
import { User as userEntity } from '@entities'

/* 
Fonctionnalité : Retourner la liste des demandes de modifications 
associées aux projets auxquels le porteur a accès
*/

const { Project, User, File, ModificationRequest, UserProjects } = models

describe('Obtenir la liste des demandes de modification pour un porteur de projet.', () => {
  // Scenario 1
  describe('Afficher les données des modifications non-legacy.', () => {
    describe(`Etant donnés un projet accessible par un porteur, 
              et deux modifications faites par ce porteur sur le projet : 
              - une modification non-legacy,
              - une modification legacy, `, () => {
      it(`alors le porteur devrait recevoir les détails de la modification non-legacy.`, async () => {
        const user = _creerPorteurProjet('email@test.test', 'John Doe')
        await User.create(user)

        const projectId = new UniqueEntityID().toString()
        await Project.create(
          makeFakeProject({
            id: projectId,
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
        await UserProjects.create({ projectId, userId: user.id })

        const fileId = new UniqueEntityID().toString()
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        const modificationId = new UniqueEntityID().toString()
        await ModificationRequest.create({
          projectId,
          fileId,
          requestedOn: 123,
          status: 'envoyée',
          type: 'recours',
          id: modificationId,
          userId: user.id,
          authority: 'dgec',
          justification: 'justification',
        })

        await ModificationRequest.create({
          projectId,
          fileId,
          requestedOn: 123,
          status: 'envoyée',
          type: 'recours',
          id: new UniqueEntityID().toString(),
          userId: user.id,
          authority: 'dgec',
          justification: 'justification',
          isLegacy: true,
        })

        const res = await getModificationRequestListForPorteur({
          user: user,
          pagination: { page: 0, pageSize: 10 },
        })

        expect(res.isOk()).toBe(true)
        expect(res._unsafeUnwrap().itemCount).toEqual(1)
        expect(res._unsafeUnwrap().items[0]).toMatchObject({
          id: modificationId,
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
  //Scenario 2
  describe(`Afficher les modifications faites par un autre porteur pour un porteur ayant accès au même projet`, () => {
    describe(`Etant donnés un project accessible pour deux porteurs A et B, 
              et une modification faite par le porteur A sur le projet, `, () => {
      it(`alors le porteur B devrait recevoir cette modification.`, async () => {
        const userA = _creerPorteurProjet('email@test.test', 'John Doe')
        await User.create(userA)

        const userB = _creerPorteurProjet('other-email@test.test', 'John Smith')
        await User.create(userB)

        const projectId = new UniqueEntityID().toString()
        await Project.create(
          makeFakeProject({
            id: projectId,
          })
        )
        await UserProjects.bulkCreate([
          { projectId, userId: userA.id },
          { projectId, userId: userB.id },
        ])

        const modificationId = new UniqueEntityID().toString()
        await ModificationRequest.create({
          projectId,
          fileId: new UniqueEntityID().toString(),
          requestedOn: 123,
          status: 'envoyée',
          type: 'recours',
          id: modificationId,
          userId: userA.id,
          authority: 'dgec',
          justification: 'justification',
        })

        const res = await getModificationRequestListForPorteur({
          user: userB,
          pagination: { page: 0, pageSize: 10 },
        })

        expect(res.isOk()).toBe(true)
        expect(res._unsafeUnwrap().itemCount).toEqual(1)
        expect(res._unsafeUnwrap().items[0]).toMatchObject({ id: modificationId })
      })
    })
  })
  //Scenario 3
  describe(`Ne pas afficher les modifications si le porteur n'a pas accès au projet.`, () => {
    describe(`Etant donnés un projet accessible par un porteur A uniquement,
              et une modification faite par le porteur A sur le projet, `, () => {
      it(`alors un porteur B qui n'a pas accès au projet ne devrait pas recevoir la modification.`, async () => {
        const userA = _creerPorteurProjet('email@test.test', 'John Doe')
        await User.create(userA)

        const userB = _creerPorteurProjet('other-email@test.test', 'John Smith')
        await User.create(userB)

        const projectId = new UniqueEntityID().toString()
        await Project.create(
          makeFakeProject({
            id: projectId,
          })
        )
        await UserProjects.bulkCreate({ projectId, userId: userA.id })

        const modificationId = new UniqueEntityID().toString()
        await ModificationRequest.create({
          projectId,
          fileId: new UniqueEntityID().toString(),
          requestedOn: 123,
          status: 'envoyée',
          type: 'recours',
          id: modificationId,
          userId: userA.id,
          authority: 'dgec',
          justification: 'justification',
        })

        const res = await getModificationRequestListForPorteur({
          user: userB,
          pagination: { page: 0, pageSize: 10 },
        })

        expect(res.isOk()).toBe(true)
        expect(res._unsafeUnwrap().itemCount).toEqual(0)
      })
    })
  })
})

const _creerPorteurProjet = (
  email: string,
  fullName: string
): userEntity & { role: 'porteur-projet' } => {
  return {
    role: 'porteur-projet',
    email,
    fullName,
    id: new UniqueEntityID().toString(),
  }
}
