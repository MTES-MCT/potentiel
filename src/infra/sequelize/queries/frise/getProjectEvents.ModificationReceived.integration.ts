import { User } from '@entities'
import { UniqueEntityID } from '@core/domain'
import { USER_ROLES } from '@modules/users'
import { getProjectEvents } from '.'
import { ProjectEvent } from '../../projectionsNext'
import { resetDatabase } from '../../helpers'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents for ModificationReceived events', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()
  const fakeProject = makeFakeProject({
    id: projectId,
    potentielIdentifier: 'pot-id',
  })

  beforeEach(async () => {
    await resetDatabase()
    await Project.create(fakeProject)
  })

  describe('when there is a modification received of type "producteur"', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return the "producteur" modification', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationReceived',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'producteur',
                producteur: 'nom producteur',
                modificationRequestId: 'id',
              },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationReceived',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'producteur',
                  producteur: 'nom producteur',
                  modificationRequestId: 'id',
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the producteur modification', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationReceived',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'producteur',
            producteur: 'nom producteur',
            modificationRequestId: 'id',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification received of type "actionnaire"', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return the "actionnaire" modification', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationReceived',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'actionnaire',
                actionnaire: 'nom actionnaire',
                modificationRequestId: 'id',
              },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationReceived',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'actionnaire',
                  actionnaire: 'nom actionnaire',
                  modificationRequestId: 'id',
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the actionnaire modification', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationReceived',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'actionnaire',
            actionnaire: 'nom actionnaire',
            modificationRequestId: 'id',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification received of type "fournisseur"', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return the "fournisseur" modification', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationReceived',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'fournisseur',
                fournisseurs: [
                  { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
                  { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
                ],
                modificationRequestId: 'id',
              },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationReceived',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'fournisseur',
                  fournisseurs: [
                    { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
                    { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
                  ],
                  modificationRequestId: 'id',
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the fournisseur modification', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationReceived',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'fournisseur',
            fournisseurs: [
              { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
              { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
            ],
            modificationRequestId: 'id',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })

  describe('when there is a modification received of type "puissance"', () => {
    describe('when user is not ademe', () => {
      for (const role of USER_ROLES.filter((role) => role !== 'ademe')) {
        describe(`when the user is ${role}`, () => {
          const fakeUser = { role } as User

          it('should return the "puissance" modification', async () => {
            const date = new Date('2022-02-09')

            await ProjectEvent.create({
              id: new UniqueEntityID().toString(),
              projectId,
              type: 'ModificationReceived',
              valueDate: date.getTime(),
              eventPublishedAt: date.getTime(),
              payload: {
                modificationType: 'puissance',
                puissance: 2,
                modificationRequestId: 'id',
              },
            })

            const result = await getProjectEvents({ projectId, user: fakeUser })
            expect(result._unsafeUnwrap()).toMatchObject({
              events: [
                {
                  type: 'ModificationReceived',
                  date: date.getTime(),
                  variant: role,
                  modificationType: 'puissance',
                  puissance: 2,
                  unitePuissance: 'MWc', // unitePuissance for Fessenheim AO
                  modificationRequestId: 'id',
                },
              ],
            })
          })
        })
      }
    })
    describe('when the user is ademe', () => {
      it('should not return the producteur modification', async () => {
        const fakeUser = { role: 'ademe' } as User
        const date = new Date('2022-02-09')
        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationReceived',
          valueDate: date.getTime(),
          eventPublishedAt: date.getTime(),
          payload: {
            modificationType: 'producteur',
            producteur: 2,
            modificationRequestId: 'id',
          },
        })

        const result = await getProjectEvents({ projectId, user: fakeUser })
        expect(result._unsafeUnwrap()).toMatchObject({
          events: [],
        })
      })
    })
  })
})
