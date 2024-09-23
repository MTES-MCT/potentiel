import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { resetDatabase } from '../../../helpers';
import { LegacyModificationImported } from '../../../../../modules/modificationRequest';
import { ProjectEvent } from '../..';
import onLegacyModificationImported from './onLegacyModificationImported';

describe('onLegacyModificationImported', () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  describe('when there already are events in ProjectEvents table', () => {
    it("should remove only the same project's legacy events", async () => {
      const targetProjectId = new UniqueEntityID().toString();
      const legacyTargetProject1 = new UniqueEntityID().toString();
      const legacyTargetProject2 = new UniqueEntityID().toString();
      const nonLegacyTargetProject = new UniqueEntityID().toString();
      const importId = new UniqueEntityID().toString();

      await ProjectEvent.create({
        // non legacy event, same project
        id: nonLegacyTargetProject,
        projectId: targetProjectId,
        eventPublishedAt: new Date('2022-03-03').getTime(),
        valueDate: new Date('2022-03-03').getTime(),
        type: 'ProjectImported',
        payload: { notifiedOn: 123 },
      });

      const projectEvents = await ProjectEvent.findAll();
      expect(projectEvents).toHaveLength(1);

      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId: targetProjectId,
            importId,
            modifications: [],
          },
          original: {
            occurredAt: new Date('2022-01-01'),
            version: 1,
          },
        }),
      );

      const res = await ProjectEvent.findAll();
      expect(res).toHaveLength(1);

      expect(res).not.toContainEqual(expect.objectContaining({ id: legacyTargetProject1 }));
      expect(res).not.toContainEqual(expect.objectContaining({ id: legacyTargetProject2 }));

      expect(res).toContainEqual(expect.objectContaining({ id: nonLegacyTargetProject }));
    });
  });

  describe('when a LegacyModificationImported event is emitted with modifications', () => {
    const projectId = new UniqueEntityID();
    const importId = new UniqueEntityID();
    const occurredAt = new Date('2022-01-01');

    it('should save a new event in ProjectEvent for each modification', async () => {
      await onLegacyModificationImported(
        new LegacyModificationImported({
          payload: {
            projectId: projectId.toString(),
            importId: importId.toString(),
            modifications: [
              {
                modifiedOn: new Date('2020-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'delai',
                nouvelleDateLimiteAchevement: new Date('2021-07-01').getTime(),
                ancienneDateLimiteAchevement: new Date('2021-01-01').getTime(),
                status: 'acceptée',
              },
              {
                modifiedOn: new Date('2021-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'actionnaire',
                actionnairePrecedent: 'nom ancien actionnaire',
                siretPrecedent: 'siret',
                status: 'acceptée',
              },
              {
                modifiedOn: new Date('2022-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'producteur',
                producteurPrecedent: 'nom ancien producteur',
                status: 'acceptée',
              },
              {
                modifiedOn: new Date('2022-01-01').getTime(),
                modificationId: new UniqueEntityID().toString(),
                type: 'autre',
                column: 'col',
                value: 'val',
                status: 'acceptée',
              },
            ],
          },
          original: {
            occurredAt,
            version: 1,
          },
        }),
      );

      const projectEvent = await ProjectEvent.findAll({
        where: { projectId: projectId.toString() },
      });

      expect(projectEvent).toHaveLength(4);
      expect(projectEvent[0]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: {
          modificationType: 'delai',
          nouvelleDateLimiteAchevement: new Date('2021-07-01').getTime(),
          ancienneDateLimiteAchevement: new Date('2021-01-01').getTime(),
          status: 'acceptée',
        },
      });
      expect(projectEvent[1]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: {
          modificationType: 'actionnaire',
          actionnairePrecedent: 'nom ancien actionnaire',
          status: 'acceptée',
        },
      });
      expect(projectEvent[2]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: {
          modificationType: 'producteur',
          producteurPrecedent: 'nom ancien producteur',
          status: 'acceptée',
        },
      });
      expect(projectEvent[3]).toMatchObject({
        type: 'LegacyModificationImported',
        payload: { modificationType: 'autre', column: 'col', value: 'val', status: 'acceptée' },
      });
    });
  });
});
