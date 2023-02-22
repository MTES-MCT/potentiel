import { UniqueEntityID } from '@core/domain';
import {
  RejetChangementDePuissanceAnnulé,
  RejetChangementDePuissanceAnnuléPayload,
} from '@modules/demandeModification';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from '../projectEvent.model';
import onRejetChangementDePuissanceAnnulé from './onRejetChangementDePuissanceAnnulé';

describe('Projecteur de ProjectEvent onRejetRecoursAnnulé', () => {
  beforeEach(async () => {
    resetDatabase();
  });
  describe(`Étant donné des événements de type "ModificationRequestRejected" et "ModificationRequestInstructionStarted" pour une demande de changment de puissance`, () => {
    describe(`Lorsqu'on émet un événement RejetChangementDePuissanceAnnulé avec la même demande`, () => {
      it(`Alors on ne devrait plus avoir les événements de type "ModificationRequestRejected" et "ModificationRequestInstructionStarted" 
      dans les événements du projet concerné`, async () => {
        const modificationRequestId = new UniqueEntityID().toString();
        const projectId = new UniqueEntityID().toString();
        const occurredAt = new Date().getTime();

        const annuléPar = new UniqueEntityID().toString();

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequested',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationType: 'puissance',
            modificationRequestId,
            authority: 'dreal',
          },
        });

        await ProjectEvent.create({
          id: new UniqueEntityID().toString(),
          projectId,
          type: 'ModificationRequestInstructionStarted',
          valueDate: occurredAt,
          eventPublishedAt: occurredAt,
          payload: {
            modificationRequestId,
          },
        });

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
        });

        await onRejetChangementDePuissanceAnnulé(
          new RejetChangementDePuissanceAnnulé({
            payload: {
              demandeChangementDePuissanceId: modificationRequestId,
              annuléPar,
            } as RejetChangementDePuissanceAnnuléPayload,
            original: {
              version: 1,
              occurredAt: new Date('2022-06-30'),
            },
          }),
        );

        const modificationRequestRejected = await ProjectEvent.findOne({
          where: { type: 'ModificationRequestRejected', payload: { modificationRequestId } },
        });
        const modificationRequestInstruction = await ProjectEvent.findOne({
          where: {
            type: 'ModificationRequestInstructionStarted',
            payload: { modificationRequestId },
          },
        });

        expect(modificationRequestRejected).toBeNull();
        expect(modificationRequestInstruction).toBeNull();
      });
    });
  });
});
