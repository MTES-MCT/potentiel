import { UniqueEntityID } from '../../../../core/domain'
import { AO_BY_CONTRACT, AO_CODES } from '../../../../modules/edf/useCases'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getEDFSearchIndex } from './getEDFSearchIndex'
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
        const searchIndex = await getEDFSearchIndex()

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
        const searchIndex = await getEDFSearchIndex()

        expect(searchIndex.findByNumeroContrat(numeroContratEDF)).toEqual(null)
      })
    })
  })

  describe('search', () => {
    const typeContrat = AO_CODES.keys().next().value
    const project = {
      typeContrat: AO_CODES.keys().next().value,
      nomProjet: 'nomProjet',
      nomCandidat: 'nomCandidat',
      adresseProjet: 'adresseProjet',
      communeProjet: 'communeProjet',
      puissance: 123,
      prixReference: 12.3,
      details: {
        'Numéro SIREN ou SIRET*': '123456789',
      },
      codePostalProjet: '12345',
      appelOffreId: AO_BY_CONTRACT[typeContrat],
    }

    const makeLine = (overrides?: any) => {
      const projectWithOverrides = { ...project, ...(overrides || {}) }
      const {
        nomProjet,
        nomCandidat,
        adresseProjet,
        communeProjet,
        puissance,
        prixReference,
        details: { 'Numéro SIREN ou SIRET*': siret },
        codePostalProjet,
      } = projectWithOverrides
      return {
        'Contrat - Type (code)': typeContrat,
        'Installation - Nom': nomProjet,
        'Acteur - Titulaire - Nom': nomCandidat,
        'Installation - Adresse1': adresseProjet,
        'Installation - Commune': communeProjet,
        "Pmax d'achat": (puissance * 1000).toString(),
        'Tarif de référence': (prixReference / 10).toString(),
        'Installation - Siret': `${siret}00000`,
        'Installation - Code Postal': codePostalProjet,
      }
    }

    const makeProjetType = (overrides?: any) =>
      makeFakeProject({
        ...project,
        contratEDF: null,
        ...(overrides ? overrides : {}),
      })

    it('should return only projects that are not linked to contract', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          contratEDF: null,
        }),
        makeProjetType({
          contratEDF: {
            // this result should be ignored
            numero: 'numeroContratEDF',
          },
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine())
      expect(results).toHaveLength(1)

      expect(results[0].projectId).toEqual(projectId)
    })

    it('should return only projects that are in the appelOffre corresponding to the contract type', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          appelOffreId: AO_BY_CONTRACT[typeContrat],
        }),
        makeProjetType({
          // this result should be ignored
          appelOffreId: 'other',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine())
      expect(results).toHaveLength(1)

      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with similar nomProjet', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          nomProjet: 'ceci est ma requete',
        }),
        makeProjetType({
          nomProjet: 'ceci en est une autre',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ nomProjet: 'ceci est ma requete' }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with similar nomCandidat', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          nomCandidat: 'ceci est ma requete',
        }),
        makeProjetType({
          nomCandidat: 'ceci en est une autre',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ nomCandidat: 'ceci est ma requete' }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with similar adresseProjet', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          adresseProjet: 'ceci est ma requete',
        }),
        makeProjetType({
          adresseProjet: 'ceci en est une autre',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ adresseProjet: 'ceci est ma requete' }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with similar communeProjet', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          communeProjet: 'ceci est ma requete',
        }),
        makeProjetType({
          communeProjet: 'ceci en est une autre',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ communeProjet: 'ceci est ma requete' }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with the exact same codePostalProjet', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          codePostalProjet: '12345',
        }),
        makeProjetType({
          codePostalProjet: '12346',
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ codePostalProjet: '12345' }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with a more similar puissance', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          puissance: 123,
        }),
        makeProjetType({
          puissance: 122,
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ puissance: 123 }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with a more similar tarif', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          prixReference: 123,
        }),
        makeProjetType({
          prixReference: 122,
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(makeLine({ prixReference: 123 }))
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with the exact same siret', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          details: { 'Numéro SIREN ou SIRET*': '123456' },
        }),
        makeProjetType({
          details: { 'Numéro SIREN ou SIRET*': '123457' },
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(
        makeLine({ details: { 'Numéro SIREN ou SIRET*': '123456' } })
      )
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })

    it('should give a higher score to projects with the same first 4 digits', async () => {
      await resetDatabase()
      await Project.bulkCreate([
        makeProjetType({
          id: projectId,
          details: { 'Numéro SIREN ou SIRET*': '123456' },
        }),
        makeProjetType({
          details: { 'Numéro SIREN ou SIRET*': '121456' },
        }),
      ])

      const searchIndex = await getEDFSearchIndex()

      const results = searchIndex.search(
        makeLine({ details: { 'Numéro SIREN ou SIRET*': '123478' } })
      )
      expect(results).toHaveLength(2)

      expect(results[0].score).toBeGreaterThan(results[1].score)
      expect(results[0].projectId).toEqual(projectId)
    })
  })
})
