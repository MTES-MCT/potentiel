import { describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { UniqueEntityID } from '@core/domain';
import { ModificationReceived, ModificationReceivedPayload } from '@modules/modificationRequest';
import { ProjectEvent } from '@infra/sequelize/projectionsNext';
import onModificationReceived from './onModificationReceived';

describe('onModificationReceived', () => {
  const projectId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const user = new UniqueEntityID().toString();
  beforeEach(async () => {
    await resetDatabase();
  });

  describe('when there is an actionnaire modification event', () => {
    it('should create a new project event of type "actionnaire" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'actionnaire',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            actionnaire: 'nouvel actionnaire',
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        }),
      );
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: {
          modificationType: 'actionnaire',
          actionnaire: 'nouvel actionnaire',
          modificationRequestId,
        },
      });
    });
  });

  describe('when there is a producteur modification event', () => {
    it('should create a new project event of type "producteur" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'producteur',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            producteur: 'nouveau producteur',
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        }),
      );
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: {
          modificationType: 'producteur',
          producteur: 'nouveau producteur',
          modificationRequestId,
        },
      });
    });
  });

  describe('when there is a fournisseur modification event', () => {
    it('should create a new project event of type "fournisseur" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'fournisseur',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            fournisseurs: [
              { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
              { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
            ],
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        }),
      );
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: {
          modificationType: 'fournisseur',
          fournisseurs: [
            { kind: 'Nom du fabricant \n(Modules ou films)', name: 'name1' },
            { kind: 'Nom du fabricant \n(Polysilicium)', name: 'name2' },
          ],
          modificationRequestId,
        },
      });
    });
  });

  describe('when there is a puissance modification event', () => {
    it('should create a new project event of type "puissance" in ProjectEvents', async () => {
      await onModificationReceived(
        new ModificationReceived({
          payload: {
            modificationRequestId,
            type: 'puissance',
            projectId,
            requestedBy: user,
            authority: 'dreal',
            puissance: 2,
          } as ModificationReceivedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        }),
      );
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
      expect(projectEvent).toMatchObject({
        type: 'ModificationReceived',
        projectId,
        payload: { modificationType: 'puissance', puissance: 2, modificationRequestId },
      });
    });
  });
});
