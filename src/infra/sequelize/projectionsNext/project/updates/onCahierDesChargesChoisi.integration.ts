import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onCahierDesChargesChoisi } from './onCahierDesChargesChoisi';
import { CahierDesChargesChoisi } from '@modules/project';
import { UniqueEntityID } from '@core/domain';
import { Project } from '@infra/sequelize/projectionsNext';

describe('Mise à jour du projet suite au choix du nouveau cahier des charges', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  const fixtures = [
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { type: 'modifié', paruLe: '30/07/2021' },
      cahierDesChargesAttendu: '30/07/2021',
    },
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { type: 'modifié', paruLe: '30/08/2022' },
      cahierDesChargesAttendu: '30/08/2022',
    },
    {
      cahierDesChargesActuel: 'initial',
      cahierDesChargesChoisi: { type: 'modifié', paruLe: '30/08/2022', alternatif: true },
      cahierDesChargesAttendu: '30/08/2022-alternatif',
    },
    {
      cahierDesChargesActuel: '30/08/2022',
      cahierDesChargesChoisi: { type: 'initial', paruLe: 'initial' },
      cahierDesChargesAttendu: 'initial',
    },
    {
      cahierDesChargesActuel: '30/08/2022-alternatif',
      cahierDesChargesChoisi: { type: 'initial', paruLe: 'initial' },
      cahierDesChargesAttendu: 'initial',
    },
  ];

  for (const {
    cahierDesChargesActuel,
    cahierDesChargesChoisi,
    cahierDesChargesAttendu,
  } of fixtures) {
    it(`Étant donné un projet avec le cahier des charges ${cahierDesChargesActuel}
      Lorsque le cahier des charges ${
        cahierDesChargesChoisi.alternatif ? 'alternatif' : ''
      } paru le ${cahierDesChargesChoisi.paruLe} est choisi
      Alors le cahier des charges du projet devrait être ${cahierDesChargesAttendu}`, async () => {
      const projetId = new UniqueEntityID().toString();
      await Project.create(makeFakeProject({ id: projetId, cahierDesChargesActuel }));

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            projetId: projetId,
            choisiPar: 'porteur de projet',
            ...cahierDesChargesChoisi,
          } as CahierDesChargesChoisi['payload'],
        }),
      );

      const projetActuel = await Project.findByPk(projetId);
      expect(projetActuel?.cahierDesChargesActuel).toEqual(cahierDesChargesAttendu);
    });
  }
});
