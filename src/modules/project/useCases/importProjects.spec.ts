import { IllegalProjectDataError } from '..'
import { DomainEvent, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { AppelOffreRepo } from '../../../dataAccess'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { InfraNotAvailableError } from '../../shared'
import { ImportExecuted, ProjectRawDataImported } from '../events'
import { makeImportProjects } from './importProjects'

const validLine = {
  "Appel d'offres": 'appelOffreId',
  Période: 'periodeId',
  Famille: 'familleId',
  'Nom (personne physique) ou raison sociale (personne morale) :': 'nomCandidat',
  Candidat: '',
  'Nom projet': 'nomProjet',
  'N°CRE': 'numeroCRE',
  'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)': '1.234',
  'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)': '3.456',
  'Note totale': '10.10',
  'Nom et prénom du représentant légal': 'nomRepresentantLegal',
  'Adresse électronique du contact': 'test@test.test',
  'N°, voie, lieu-dit': 'adresseProjet',
  CP: '69100 / 01390',
  Commune: 'communeProjet',
  'Classé ?': 'Eliminé',
  "Motif d'élimination": 'motifsElimination',
  'Investissement ou financement participatif ?': '',
  Notification: '',
  'Engagement de fourniture de puissance à la pointe\n(AO ZNI)': '',
  'Territoire\n(AO ZNI)': '',
  'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)':
    '230.50',
  'Valeur de l’évaluation carbone des modules (kg eq CO2/kWc)': '',
  Autre: 'valeur',
}

const appelOffreRepo = {
  findAll: async () => [
    {
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', isNotifiedOnPotentiel: true }],
      familles: [{ id: 'familleId' }],
    },
  ],
} as AppelOffreRepo

const user = makeFakeUser()

describe('importProjects', () => {
  describe('when given only valid lines', () => {
    const lines = [validLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    beforeAll(async () => {
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        console.log(error)
      }
    })

    it('should trigger a single ImportExecuted', () => {
      expect(eventBus.publish).toHaveBeenCalled()

      const targetEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ImportExecuted.type) as ImportExecuted

      expect(targetEvent).toBeDefined()

      expect(targetEvent.payload.importId).toEqual(importId)
      expect(targetEvent.payload.importedBy).toEqual(user.id)
    })

    it('should trigger a ProjectRawDataImported event for each line', async () => {
      expect(eventBus.publish).toHaveBeenCalled()

      const targetEvent = eventBus.publish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectRawDataImported.type) as ProjectRawDataImported

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return
      expect(targetEvent.payload.importId).toEqual(importId)
      expect(targetEvent.payload.data).toMatchObject({
        appelOffreId: 'appelOffreId',
        periodeId: 'periodeId',
        familleId: 'familleId',
        numeroCRE: 'numeroCRE',
        nomProjet: 'nomProjet',
        nomCandidat: 'nomCandidat',
        puissance: 1.234,
        prixReference: 3.456,
        note: 10.1,
        nomRepresentantLegal: 'nomRepresentantLegal',
        email: 'test@test.test',
        adresseProjet: 'adresseProjet',
        codePostalProjet: '69100 / 01390',
        departementProjet: 'Rhône / Ain',
        regionProjet: 'Auvergne-Rhône-Alpes',
        communeProjet: 'communeProjet',
        classe: 'Eliminé',
        motifsElimination: 'motifsElimination',
        isInvestissementParticipatif: false,
        isFinancementParticipatif: false,
        notifiedOn: 0,
        engagementFournitureDePuissanceAlaPointe: false,
        territoireProjet: '',
        evaluationCarbone: 230.5,
        details: {
          Autre: 'valeur',
        },
      })
    })
  })

  describe('when given at least one invalid line', () => {
    const invalidLine = {
      ...validLine,
      'Classé ?': 'illegal value',
    }
    const lines = [validLine, invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(Object.keys(error.errors)).toHaveLength(1)
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line has an illegal appelOffreId', () => {
    const invalidLine = {
      ...validLine,
      "Appel d'offres": 'illegal appelOffreId',
    }
    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain('Appel d’offre inconnu')
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line has an illegal periodeId', () => {
    const invalidLine = {
      ...validLine,
      Période: 'illegal periodeId',
    }
    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain('Période inconnue')
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line has a familleId but the appel d’offre doesn’t have familles', () => {
    const appelOffreRepo = {
      findAll: async () => [
        {
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId' }],
          familles: [],
        },
      ],
    } as AppelOffreRepo

    const invalidLine = {
      ...validLine,
      Famille: 'familleId',
    }
    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain('pas de familles')
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line has a familleId but the appel d’offre doesn’t have that famille', () => {
    const invalidLine = {
      ...validLine,
      Famille: 'illegal familleId',
    }
    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain('n’existe pas')
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line has no familleId but the appel d’offre requires a famille', () => {
    const invalidLine = {
      ...validLine,
      Famille: undefined,
    }
    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain('requiert une famille')
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line is from a legacy periode but has no notification date', () => {
    const invalidLine = {
      ...validLine,
      "Appel d'offres": 'appelOffreId',
      Période: 'periodeId',
      Notification: '',
    }

    const appelOffreRepo = {
      findAll: async () => [
        {
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', isNotifiedOnPotentiel: false }],
          familles: [{ id: 'familleId' }],
        },
      ],
    } as AppelOffreRepo

    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain(
          'historique (non notifiée sur Potentiel) et requiert donc une date de notification'
        )
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })

  describe('when a line is from a non-legacy periode and has a notification date', () => {
    const invalidLine = {
      ...validLine,
      "Appel d'offres": 'appelOffreId',
      Période: 'periodeId',
      Notification: '12/12/2020',
    }

    const appelOffreRepo = {
      findAll: async () => [
        {
          id: 'appelOffreId',
          periodes: [{ id: 'periodeId', isNotifiedOnPotentiel: true }],
          familles: [{ id: 'familleId' }],
        },
      ],
    } as AppelOffreRepo

    const lines = [invalidLine]
    const importId = new UniqueEntityID().toString()

    const eventBus = {
      publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
      subscribe: jest.fn(),
    }

    const importProjects = makeImportProjects({
      eventBus,
      appelOffreRepo,
    })

    it('should throw an error', async () => {
      expect.assertions(4)
      try {
        await importProjects({ lines, importId, importedBy: user })
      } catch (error) {
        expect(error).toBeDefined()
        expect(error).toBeInstanceOf(IllegalProjectDataError)
        expect(error.errors[1]).toContain(
          'notifiée sur Potentiel. Le projet concerné ne doit pas comporter de date de notification.'
        )
        expect(eventBus.publish).not.toHaveBeenCalled()
      }
    })
  })
})
