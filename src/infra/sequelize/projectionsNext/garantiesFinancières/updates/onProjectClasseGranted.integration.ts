import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { models } from '../../../models';
import { ProjectClasseGranted } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import onProjectClasseGranted from './onProjectClasseGranted';

describe(`handler onProjectClasseGranted pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const grantedBy = new UniqueEntityID().toString();

  const { Project } = models;

  describe(`Ne rien enregistrer si le projet n'est pas soumis à garanties financières`, () => {
    it(`Etant donné un événement ProjectClasseGranted émis pour un projet non soumis à GF,
    alors aucune entrée ne doit être ajoutée à la table pour le projet`, async () => {
      const projet = makeFakeProject({
        id: projetId,
        classe: 'Classé',
        appelOffreId: 'CRE4 - Autoconsommation ZNI',
        periodeId: '2',
      });
      await Project.create(projet);
      const évènement = new ProjectClasseGranted({
        payload: {
          projectId: projetId,
          grantedBy,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectClasseGranted(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toBe(null);
    });
  });

  describe(`Enregistrer une nouvelle ligne si le projet est soumis à GF`, () => {
    it(`Etant donné un événement ProjectClasseGranted émis pour un projet soumis à GF,
    et dont les GF ont été soumises à la candidature (selon l'AO),
    alors une entrée est ajoutée indiquant que les GF ont été soumises à la candidature`, async () => {
      const projet = makeFakeProject({
        id: projetId,
        classe: 'Classé',
        appelOffreId: 'PPE2 - Eolien',
        periodeId: '1',
      });
      await Project.create(projet);
      const évènement = new ProjectClasseGranted({
        payload: {
          projectId: projetId,
          grantedBy,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectClasseGranted(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toMatchObject({ statut: 'en attente', soumisesALaCandidature: true });
    });
  });
});
