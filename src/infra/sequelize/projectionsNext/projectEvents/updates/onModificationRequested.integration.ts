import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequested, ModificationRequestedPayload } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import onModificationRequested from './onModificationRequested'

describe(`Handler onModificationRequested`, () => {
  const projetId = new UniqueEntityID().toString()
  const demandeId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })
  describe(`Traitement des demandes de délai`, () => {
    describe(`Etant donné un événement ModificationRequested de type 'délai' émis`, () => {
      const nouvelEvénementEmis = new ModificationRequested({
        payload: {
          type: 'delai',
          modificationRequestId: demandeId,
          projectId: projetId,
          requestedBy: 'id-demandeur',
          authority: 'dgec',
          fileId: 'id-fichier',
          justification: 'en retard',
          delayInMonths: 10,
        } as ModificationRequestedPayload,
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })

      describe(`S'il y a déjà un événement DemandeDélai de statut 'envoyée' 
      et du même modificationRequestId dans ProjectEvent`, () => {
        const événementDéjàDansProjectEvent = {
          id: demandeId,
          projectId: projetId,
          type: 'DemandeDélai',
          valueDate: new Date().getTime(),
          eventPublishedAt: new Date().getTime(),
          payload: {
            statut: 'envoyée',
            autorité: 'dgec',
            dateAchèvementDemandée: new Date().getTime(),
            demandeur: 'id-demandeur',
          },
        }

        it(`Alors aucune modification ne doit avoir lieu sur ProjectEvent`, async () => {
          await ProjectEvent.create(événementDéjàDansProjectEvent)

          // Vérification de l'état initial
          const étatInitial = await ProjectEvent.findAll({ where: { id: demandeId } })
          expect(étatInitial).toHaveLength(1)
          expect(étatInitial[0]).toMatchObject(événementDéjàDansProjectEvent)

          await onModificationRequested(nouvelEvénementEmis)

          const demandeDélai = await ProjectEvent.findAll({ where: { id: demandeId } })
          expect(demandeDélai).toHaveLength(1)
          expect(demandeDélai[0]).toMatchObject(événementDéjàDansProjectEvent)
        })
      })

      describe(`S'il n'y a pas d'événement DemandeDélai de statut 'envoyée
      et du même modificationRequestId dans ProjectEvent`, () => {
        it(`Alors un nouvel événement DemandeDélai devrait être créé dans ProjectEvent`, async () => {
          // Vérification de l'état initial
          const étatInitial = await ProjectEvent.findAll({ where: { id: demandeId } })
          expect(étatInitial).toHaveLength(0)

          await onModificationRequested(nouvelEvénementEmis)

          const demandeDélai = await ProjectEvent.findAll({ where: { id: demandeId } })
          expect(demandeDélai).toHaveLength(1)
          expect(demandeDélai[0]).toMatchObject({
            id: demandeId,
            type: 'DemandeDélai',
            projectId: projetId,
            payload: {
              autorité: 'dgec',
              délaiEnMoisDemandé: 10,
              demandeur: 'id-demandeur',
              statut: 'envoyée',
            },
          })
        })
      })
    })
  })

  describe(`Traitement des demandes d'abandon`, () => {
    describe(`Etant donné un événement ModificationRequested de type 'abandon' émis`, () => {
      it('Alors un nouvel événement de type ModificationRequested devrait être ajouté à ProjectEvent', async () => {
        await onModificationRequested(
          new ModificationRequested({
            payload: {
              type: 'abandon',
              modificationRequestId: demandeId,
              projectId: projetId,
              requestedBy: 'user-id',
              authority: 'dgec',
              fileId: 'file-id',
              justification: 'plus possible',
            } as ModificationRequestedPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequested',
          projectId: projetId,
          payload: {
            modificationType: 'abandon',
            modificationRequestId: demandeId,
            authority: 'dgec',
          },
        })
      })
    })
  })

  describe(`Traitement des demandes de recours`, () => {
    describe(`Etant donné un événement ModificationRequested de type 'recours' émis`, () => {
      it('Alors un nouvel événement de type ModificationRequested devrait être ajouté à ProjectEvent', async () => {
        await onModificationRequested(
          new ModificationRequested({
            payload: {
              type: 'recours',
              modificationRequestId: demandeId,
              projectId: projetId,
              requestedBy: 'user-id',
              authority: 'dgec',
              fileId: 'file-id',
              justification: 'justification',
            } as ModificationRequestedPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequested',
          projectId: projetId,
          payload: {
            modificationType: 'recours',
            modificationRequestId: demandeId,
            authority: 'dgec',
          },
        })
      })
    })
  })

  describe(`Traitement des demandes de changement de puissance installée`, () => {
    describe(`Etant donné un événement ModificationRequested de type 'puissance' émis`, () => {
      it('Alors un nouvel événement de type ModificationRequested devrait être ajouté à ProjectEvent', async () => {
        await onModificationRequested(
          new ModificationRequested({
            payload: {
              type: 'puissance',
              modificationRequestId: demandeId,
              projectId: projetId,
              requestedBy: 'user-id',
              authority: 'dgec',
              fileId: 'file-id',
              justification: 'justification',
              puissance: 100,
            } as ModificationRequestedPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-02-09'),
            },
          })
        )
        const projectEvent = await ProjectEvent.findOne({ where: { projectId: projetId } })
        expect(projectEvent).toMatchObject({
          type: 'ModificationRequested',
          projectId: projetId,
          payload: {
            modificationType: 'puissance',
            modificationRequestId: demandeId,
            authority: 'dgec',
            puissance: 100,
          },
        })
      })
    })
  })
})
