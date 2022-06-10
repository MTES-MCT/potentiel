import { okAsync } from 'neverthrow'
import { DomainEvent } from '../../../core/domain'
import {
  ListingEnedisImporté,
  ContratEnedisMisAJour,
  ContratEnedisRapprochéAutomatiquement,
  ContratEnedisAvecPlusieursProjetsPossibles,
  ContratEnedisOrphelin,
} from '../events'
import { makeImportEnedisData } from './importEnedisData'

describe('importEnedisData', () => {
  const fileId = '123'
  const projectId = 'fakeProjectId'
  const numeroContratEnedis = 'fakeNumeroContratEnedis'
  const fakeEvent = new ListingEnedisImporté({
    payload: {
      fileId,
      uploadedBy: '',
    },
  })

  it('should parse lines from the file', async () => {
    const parseCsvFile = jest.fn(() => Promise.resolve([]))
    const importEnedisData = makeImportEnedisData({
      publish: jest.fn(),
      parseCsvFile,
      getSearchIndex: jest.fn(),
    })

    await importEnedisData(fakeEvent)

    expect(parseCsvFile).toHaveBeenCalledWith(fileId)
  })
  describe('when the numero contrat is linked to a project', () => {
    // describe('when the contract data has changed', () => {
    //   const parseCsvFile = jest.fn(() =>
    //     Promise.resolve([
    //       {
    //         'Contrat - Numéro': numeroContratEnedis,
    //         'Contrat - Durée': updatedDuree,
    //         'Date de mise en service du raccordement': dateMiseEnService,
    //       },
    //     ])
    //   )
    //   const updatedDateEffet = 'abcde'
    //   const updatedDuree = 'nouvelle duree'
    //   const updatedStatut = 'nouveau statut'
    //   const findByNumeroContrat = jest.fn((numeroContratEnedis: string) => ({
    //     projectId,
    //     numero: numeroContratEnedis,
    //     dateEffet,
    //     dateSignature,
    //     dateMiseEnService,
    //     type: typeContrat,
    //     duree,
    //     statut,
    //   }))

    //   const publish = jest.fn((event: DomainEvent) => okAsync(null))

    //   const importEnedisData = makeImportEnedisData({
    //     publish,
    //     parseCsvFile,
    //     getSearchIndex: jest.fn(() =>
    //       Promise.resolve({
    //         findByNumeroContrat,
    //         search: () => [],
    //       })
    //     ),
    //   })
    //   it('should emit ContratEnedisMisAJour with the updated fields', async () => {
    //     await importEnedisData(fakeEvent)

    //     expect({ publish }).toHavePublishedWithPayload(ContratEnedisMisAJour, {
    //       numero: numeroContratEnedis,
    //       projectId,
    //     })
    //   })
    // })

    describe('when the contract data has not changed', () => {
      const parseCsvFile = jest.fn(() =>
        Promise.resolve([
          {
            'Contrat - Numéro': numeroContratEnedis,
          },
        ])
      )
      const findByNumeroContrat = jest.fn((numeroContratEnedis: string) => ({
        projectId,
        numero: numeroContratEnedis,
      }))

      const publish = jest.fn((event: DomainEvent) => okAsync(null))

      const importEnedisData = makeImportEnedisData({
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
        await importEnedisData(fakeEvent)

        expect(publish).not.toHaveBeenCalled()
      })
    })
  })

  describe('when the numero contrat is not linked to a project', () => {
    const line = {
      'Contrat - Numéro': numeroContratEnedis,
      param1: 'value1',
      param2: 'value2',
    }
    const parseCsvFile = jest.fn(() => Promise.resolve([line]))
    const findByNumeroContrat = jest.fn((numeroContratEnedis: string) => null)

    it('should call search on the line', async () => {
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const search = jest.fn((line: any) => [])
      const importEnedisData = makeImportEnedisData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      await importEnedisData(fakeEvent)

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
      const importEnedisData = makeImportEnedisData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit ContratEnedisRapprochéAutomatiquement', async () => {
        await importEnedisData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(ContratEnedisRapprochéAutomatiquement, {
          numero: numeroContratEnedis,
          projectId,
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
      const importEnedisData = makeImportEnedisData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit ContratEnedisAvecPlusieursProjetsPossibles', async () => {
        await importEnedisData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(ContratEnedisAvecPlusieursProjetsPossibles, {
          numero: numeroContratEnedis,
          matches,
          rawValues: line,
        })
      })
    })

    describe('when the search returns no matches', () => {
      const search = jest.fn((line: any) => [])
      const publish = jest.fn((event: DomainEvent) => okAsync(null))
      const importEnedisData = makeImportEnedisData({
        publish,
        parseCsvFile,
        getSearchIndex: jest.fn(() =>
          Promise.resolve({
            findByNumeroContrat,
            search,
          })
        ),
      })

      it('should emit ContratEnedisOrphelin', async () => {
        await importEnedisData(fakeEvent)
        expect({ publish }).toHavePublishedWithPayload(ContratEnedisOrphelin, {
          numero: numeroContratEnedis,
          rawValues: line,
        })
      })
    })
  })
})
