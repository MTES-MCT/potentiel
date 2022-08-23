import { UniqueEntityID } from '@core/domain'
import { RejetRecoursAnnulé, RejetRecoursAnnuléPayload } from '@modules/demandeModification'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onRejetRecoursAnnulé from './onRejetRecoursAnnulé'

describe('Projecteur de ProjectEvent onRejetRecoursAnnulé', () => {
  beforeEach(async () => {
    resetDatabase()
  })
  describe(`Etant donné un événement RejetRecoursAnnulé émis`, () => {
    describe(`Lorsqu'il y a un événement de type "ModificationRequestRejected" 
      et un événement de type "ModificationRequestInstructionStarted"
      avec le même modificationRequestId`, () => {
      it(`Alors ces événements devraient être supprimés`, async () => {
        const modificationRequestId = new UniqueEntityID().toString()
        const projectId = new UniqueEntityID().toString()
        const occurredAt = new Date().getTime()

        const annuléPar = new UniqueEntityID().toString()

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationType: 'recours',
            modificationRequestId,
            authority: 'dgec-validateur',
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestInstructionStarted',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
          },
        })

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestRejected',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
            file: { id: 'id-fichier-reponse', name: 'nom-fichier-reponse' },
          },
        })

        const preModificationRequestRejected = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestRejected', payload: { modificationRequestId } },
        })
        const preModificationRequestInstruction = await ProjectEvent.findOne({
          where: {
            type: 'ModificationRequestInstructionStarted',
            payload: { modificationRequestId },
          },
        })

        expect(preModificationRequestRejected).toMatchObject({
          type: 'ModificationRequestRejected',
        })
        expect(preModificationRequestInstruction).toMatchObject({
          type: 'ModificationRequestInstructionStarted',
        })

        await onRejetRecoursAnnulé(
          new RejetRecoursAnnulé({
            payload: {
              demandeRecoursId: modificationRequestId,
              annuléPar,
            } as RejetRecoursAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          })
        )

        const modificationRequestRejected = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestRejected', payload: { modificationRequestId } },
        })
        const modificationRequestInstruction = await ProjectEvent.findOne({
          where: {
            type: 'ModificationRequestInstructionStarted',
            payload: { modificationRequestId },
          },
        })

        expect(modificationRequestRejected).toBeNull()
        expect(modificationRequestInstruction).toBeNull()
      })
    })
  })
})
