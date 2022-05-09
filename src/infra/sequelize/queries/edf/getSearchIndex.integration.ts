import { UniqueEntityID } from '../../../../core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getSearchIndex } from './getSearchIndex'
const { Project } = models

const projectId = new UniqueEntityID().toString()
describe('getSearchIndex', () => {
  describe('findByNumeroContrat', () => {
    const numeroContratEDF = 'contrat-edf-123'
    describe('when there is a project with this numero contrat', () => {
      beforeAll(async () => {
        await resetDatabase()
        await Project.create(
          makeFakeProject({
            id: projectId,
            contratEDF: {
              numero: numeroContratEDF,
              type: 'type',
              dateEffet: 'dateEffet',
              dateSignature: 'dateSignature',
              duree: '1234',
            },
          })
        )
      })
      it('should return the contract info', async () => {
        const searchIndex = await getSearchIndex()

        expect(searchIndex.findByNumeroContrat(numeroContratEDF)).toEqual({
          projectId,
          numero: numeroContratEDF,
          type: 'type',
          dateEffet: 'dateEffet',
          dateSignature: 'dateSignature',
          duree: '1234',
        })
      })
    })

    describe('when there is no project with this numero contrat', () => {
      beforeAll(async () => {
        await resetDatabase()
      })
      it('should return null', async () => {
        const searchIndex = await getSearchIndex()

        expect(searchIndex.findByNumeroContrat(numeroContratEDF)).toEqual(null)
      })
    })
  })

  describe('search', () => {})
})
