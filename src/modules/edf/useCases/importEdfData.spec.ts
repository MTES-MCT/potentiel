import { okAsync } from 'neverthrow'
import { DomainEvent } from '../../../core/domain'
import { EDFFileUploaded, EDFContractUpdated } from '../events'
import { AO_CODES, makeImportEdfData } from './importEdfData'

describe('importEdfData', () => {
  const fileId = '123'
  const projectId = 'fakeProjectId'
  const numeroContratEDF = 'fakeNumeroContratEDF'
  const typeContrat = AO_CODES.keys().next().value
  const fakeEvent = new EDFFileUploaded({
    payload: {
      fileId,
      uploadedBy: '',
    },
  })

  it('should parse lines from the file', async () => {
    const parseCsvFile = jest.fn(() => Promise.resolve([]))
    const importEdfData = makeImportEdfData({
      publish: jest.fn(),
      parseCsvFile,
      makeSearchIndex: jest.fn(),
    })

    await importEdfData(fakeEvent)

    expect(parseCsvFile).toHaveBeenCalledWith(fileId)
  })

  describe("when the line's numero contrat is linked to a project", () => {
    const dateEffet = '1/1/20'
    const dateSignature = '3/23/21'
    const duree = '2222'

    describe('when the contract data has changed', () => {
      const parseCsvFile = jest.fn(() =>
        Promise.resolve([
          {
            'Contrat - Type (code)': typeContrat,
            'Contrat - Numéro': numeroContratEDF,
            "Contrat - Date d'effet": updatedDateEffet,
            'Contrat - Date de signature': dateSignature,
            'Contrat - Durée': updatedDuree,
          },
        ])
      )
      const updatedDateEffet = 'abcde'
      const updatedDuree = 'nouvelle duree'
      const findByNumeroContrat = jest.fn((numeroContratEDF: string) => ({
        projectId,
        numero: numeroContratEDF,
        dateEffet,
        dateSignature,
        type: typeContrat,
        duree,
      }))

      const publish = jest.fn((event: DomainEvent) => okAsync(null))

      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        makeSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search: () => [],
          })
        ),
      })
      it('should emit EDFContractUpdated with the updated fields', async () => {
        await importEdfData(fakeEvent)

        expect({ publish }).toHavePublishedWithPayload(EDFContractUpdated, {
          numero: numeroContratEDF,
          projectId,
          dateEffet: updatedDateEffet,
          duree: updatedDuree,
        })
      })
    })

    describe('when the contract data has not changed', () => {
      const parseCsvFile = jest.fn(() =>
        Promise.resolve([
          {
            'Contrat - Type (code)': typeContrat,
            'Contrat - Numéro': numeroContratEDF,
            "Contrat - Date d'effet": dateEffet,
            'Contrat - Date de signature': dateSignature,
            'Contrat - Durée': duree,
          },
        ])
      )
      const findByNumeroContrat = jest.fn((numeroContratEDF: string) => ({
        projectId,
        numero: numeroContratEDF,
        dateEffet,
        dateSignature,
        type: typeContrat,
        duree,
      }))

      const publish = jest.fn((event: DomainEvent) => okAsync(null))

      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        makeSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search: () => [],
          })
        ),
      })
      it('should not emit', async () => {
        await importEdfData(fakeEvent)

        expect(publish).not.toHaveBeenCalled()
      })
    })
  })
})
