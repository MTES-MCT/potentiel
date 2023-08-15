import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import {
  CahierDesChargesChoisi,
  CahierDesChargesChoisiPayload,
} from '../../../../../modules/project';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from "../..";
import onCahierDesChargesChoisi from './onCahierDesChargesChoisi';

describe('Projecteur de ProjectEvent onCahierDesChargesChoisi', () => {
  describe(`Étant donné des évènements de type "CahierDesChargesChoisi" pour un changement de cahier des charges`, () => {
    describe(`Lorsqu'on émet un évènement CahierDesChargesChoisi pour un CDC`, () => {
      beforeEach(async () => {
        await resetDatabase();
      });
      it(`Si le CDC choisi est de type initial
          Alors le CDC du projet devrait être initial`, async () => {
        const projectId = new UniqueEntityID().toString();
        const occurredAt = new Date('2022-09-29');
        await onCahierDesChargesChoisi(
          new CahierDesChargesChoisi({
            payload: {
              projetId: projectId,
              choisiPar: 'utilisateur',
              type: 'initial',
            } as CahierDesChargesChoisiPayload,
            original: {
              version: 1,
              occurredAt,
            },
          }),
        );

        const projectEvent = await ProjectEvent.findOne({ where: { projectId } });

        expect(projectEvent).not.toBeNull();
        expect(projectEvent).toMatchObject({
          type: 'CahierDesChargesChoisi',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: { choisiPar: 'utilisateur', type: 'initial' },
        });
      });

      it(`Si le CDC choisi est de type modifié
          Alors le CDC du projet devrait être modifié`, async () => {
        const projectId = new UniqueEntityID().toString();
        const occurredAt = new Date('2022-09-29');
        await onCahierDesChargesChoisi(
          new CahierDesChargesChoisi({
            payload: {
              projetId: projectId,
              choisiPar: 'utilisateur',
              type: 'modifié',
              paruLe: '30/07/2021',
            } as CahierDesChargesChoisiPayload,
            original: {
              version: 1,
              occurredAt,
            },
          }),
        );

        const projectEvent = await ProjectEvent.findOne({ where: { projectId } });

        expect(projectEvent).not.toBeNull();
        expect(projectEvent).toMatchObject({
          type: 'CahierDesChargesChoisi',
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: { choisiPar: 'utilisateur', paruLe: '30/07/2021', type: 'modifié' },
        });
      });
    });
  });
});
