import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProjectReimported, ProjectReimportedPayload } from '@modules/project';
import { ProjectEvent } from '../projectEvent.model';
import onProjectReimported from './onProjectReimported';

describe(`Handler onProjectReimported`, () => {
  const projectId = new UniqueEntityID().toString();
  beforeEach(async () => {
    await resetDatabase();
  });

  describe(`Si les changements contiennent le passage au statut "Classé"`, () => {
    it(`Etant donné un projet passant du statut "Eliminé" à "Classé'
    alors un item 'DateMisEnService' devrait être ajouté à ProjectEvent`, async () => {
      await onProjectReimported(
        new ProjectReimported({
          payload: { projectId, data: { classe: 'Classé' } } as ProjectReimportedPayload,
        }),
      );

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      });

      expect(projectEvent).toMatchObject({ payload: { statut: 'non-renseignée' } });
    });
  });

  describe(`Si les changements contiennent le passage au statut "Eliminé"`, () => {
    it(`Etant donné un projet passant du statut "Classé" à Eliminé'
    alors l'item 'DateMisEnService' devrait être supprimé`, async () => {
      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        type: 'DateMiseEnService',
        valueDate: new Date().getTime(),
        eventPublishedAt: new Date().getTime(),
        projectId,
        payload: { statut: 'renseignée', date: '01/01/2024' },
      });

      await onProjectReimported(
        new ProjectReimported({
          payload: { projectId, data: { classe: 'Eliminé' } } as ProjectReimportedPayload,
        }),
      );

      const projectEvent = await ProjectEvent.findOne({
        where: { projectId, type: 'DateMiseEnService' },
      });

      expect(projectEvent).toBe(null);
    });
  });
});
