import { okAsync } from 'neverthrow'
import { DomainEvent } from '../../../core/domain'
import {
  EDFFileUploaded,
  EDFContractUpdated,
  EDFContractAutomaticallyLinkedToProject,
  EDFContractHasMultipleMatches,
  EDFContractHasNoMatch,
} from '../events'
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
      getSearchIndex: jest.fn(),
    })

    await importEdfData(fakeEvent)

    expect(parseCsvFile).toHaveBeenCalledWith(fileId)
  })
  const dateEffet = '1/1/20'
  const dateSignature = '3/23/21'
  const duree = '2222'

  describe('when the numero contrat is linked to a project', () => {
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
        getSearchIndex: jest.fn(() =>
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
        getSearchIndex: jest.fn(() =>
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

  describe('when the numero contrat is not linked to a project', () => {
    const line = {
      'Contrat - Type (code)': typeContrat,
      'Contrat - Numéro': numeroContratEDF,
      "Contrat - Date d'effet": dateEffet,
      'Contrat - Date de signature': dateSignature,
      'Contrat - Durée': duree,
      param1: 'value1',
      param2: 'value2',
    }
    const parseCsvFile = jest.fn(() => Promise.resolve([line]))
    const findByNumeroContrat = jest.fn((numeroContratEDF: string) => null)

    it('should call search on the line', async () => {
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const search = jest.fn((line: any) => [])
      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      await importEdfData(fakeEvent)

      expect(search).toHaveBeenCalledWith(line)
    })

    describe('when the search returns a single result', () => {
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const score = 123
      const result = {
        projectId,
        score,
      }
      const search = jest.fn((line: any) => [result])
      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit EDFContractAutomaticallyLinkedToProject', async () => {
        await importEdfData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(EDFContractAutomaticallyLinkedToProject, {
          numero: numeroContratEDF,
          projectId,
          type: typeContrat,
          dateSignature,
          dateEffet,
          duree,
          rawValues: line,
        })
      })
    })

    describe('when the search returns multiple matches', () => {
      const matches = [
        {
          projectId: '1',
          score: 1,
        },
        {
          projectId: '2',
          score: 2,
        },
      ]
      const search = jest.fn((line: any) => matches)
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit EDFContractAutomaticallyLinkedToProject', async () => {
        await importEdfData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(EDFContractHasMultipleMatches, {
          numero: numeroContratEDF,
          matches,
          rawValues: line,
        })
      })
    })

    describe('when the search returns no matches', () => {
      const search = jest.fn((line: any) => [])
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const importEdfData = makeImportEdfData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit EDFContractHasNoMatch', async () => {
        await importEdfData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(EDFContractHasNoMatch, {
          numero: numeroContratEDF,
          rawValues: line,
        })
      })
    })
  })
})
