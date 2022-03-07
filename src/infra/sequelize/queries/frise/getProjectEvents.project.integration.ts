import { UniqueEntityID } from '@core/domain'
import { User } from '@entities'
import { resetDatabase } from '../../helpers'
import { getProjectEvents } from './getProjectEvents'
import { models } from '../../models'
import makeFakeProject from '../../../../__tests__/fixtures/project'

describe('getProjectEvents project property', () => {
  const { Project } = models
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`when the project classe is 'Classé'`, () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Classé' })

    it('should return a project which is lauréat', async () => {
      await Project.create(fakeProject)

      const fakeUser = { role: 'porteur-projet' } as User
      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        project: {
          id: projectId,
          isLaureat: true,
        },
      })
    })

    describe(`when the project abandonedOn date is set`, () => {
      it('should return a project which is not lauréat', async () => {
        await Project.create({ ...fakeProject, abandonedOn: '1234' })

        const fakeUser = { role: 'porteur-projet' } as User
        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          project: {
            id: projectId,
            isLaureat: false,
          },
        })
      })
    })

    describe('when the project is subject to "garanties financières"', () => {
      it('should return a project which is soumisAuxGF', async () => {
        const appelOffreId = 'PPE2 - Eolien'
        const familleId = '1'
        const periodeId = '1'
        const fakeProject = makeFakeProject({
          id: projectId,
          classe: 'Classé',
          appelOffreId,
          familleId,
          periodeId,
        })
        await Project.create(fakeProject)
        const fakeUser = { role: 'porteur-projet' } as User
        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          project: {
            id: projectId,
            isLaureat: true,
            isSoumisAuxGF: true,
          },
        })
      })
      describe('when GF has been submitted at application', () => {
        it('should return a isGarantiesFinancieresDeposeesALaCandidature property', async () => {
          const fakeUser = { role: 'porteur-projet' } as User
          const appelOffreId = 'PPE2 - Eolien'
          const familleId = '1'
          const periodeId = '1'
          const fakeProject = makeFakeProject({
            id: projectId,
            classe: 'Classé',
            appelOffreId,
            familleId,
            periodeId,
          })
          await Project.create(fakeProject)
          const res = await getProjectEvents({ projectId, user: fakeUser })

          expect(res._unsafeUnwrap()).toMatchObject({
            project: {
              id: projectId,
              isLaureat: true,
              isSoumisAuxGF: true,
              isGarantiesFinancieresDeposeesALaCandidature: true,
            },
          })
        })
      })
    })

    describe('when the project is NOT subject to "garanties financières"', () => {
      it('should return a project which NOT is soumisAuxGF', async () => {
        const appelOffreId = 'PPE2 - Innovation'
        const familleId = '1'
        const periodeId = '1'
        const fakeProject = makeFakeProject({
          id: projectId,
          classe: 'Classé',
          appelOffreId,
          familleId,
          periodeId,
        })
        await Project.create(fakeProject)
        const fakeUser = { role: 'porteur-projet' } as User
        const res = await getProjectEvents({ projectId, user: fakeUser })

        expect(res._unsafeUnwrap()).toMatchObject({
          project: {
            id: projectId,
            isLaureat: true,
            isSoumisAuxGF: false,
          },
        })
      })
    })
  })

  describe(`when the project classe is 'Eliminé'`, () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Eliminé' })

    it('should return a project which is not lauréat', async () => {
      await Project.create(fakeProject)

      const fakeUser = { role: 'porteur-projet' } as User
      const res = await getProjectEvents({ projectId, user: fakeUser })

      expect(res._unsafeUnwrap()).toMatchObject({
        project: {
          id: projectId,
          isLaureat: false,
        },
      })
    })
  })
})
