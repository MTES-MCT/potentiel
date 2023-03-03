import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { Project, GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { ProjectNotified } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import onProjectNotified from './onProjectNotified';

describe(`handler onProjectNotified pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');

  describe(`Ne rien enregistrer si le projet est éliminé`, () => {
    it(`Etant donné un événement ProjectNotified émis pour un projet soumis à GF, mais non-lauréat,
    alors aucune entrée ne doit être ajoutée à la table pour le projet`, async () => {
      const projet = makeFakeProject({ id: projetId, classe: 'Eliminé' });
      await Project.create(projet);

      const évènement = new ProjectNotified({
        payload: {
          projectId: projetId,
          candidateEmail: 'candidat@test.test',
          candidateName: 'nom candidat',
          periodeId: '1',
          appelOffreId: 'PPE2 - Eolien', // AO soumis à GF
          notifiedOn: 123,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectNotified(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toBe(null);
    });
  });

  describe(`Ne rien enregistrer si le projet n'est pas soumis à garanties financières`, () => {
    it(`Etant donné un événement ProjectNotified émis pour un projet non soumis à GF,
    alors aucune entrée ne doit être ajoutée à la table pour le projet`, async () => {
      const projet = makeFakeProject({ id: projetId, classe: 'Classé' });
      await Project.create(projet);

      const évènement = new ProjectNotified({
        payload: {
          projectId: projetId,
          candidateEmail: 'candidat@test.test',
          candidateName: 'nom candidat',
          periodeId: '2',
          appelOffreId: 'CRE4 - Autoconsommation ZNI',
          notifiedOn: 123,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectNotified(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toBe(null);
    });
  });

  describe(`Enregistrer une nouvelle ligne si le projet est soumis à GF`, () => {
    it(`Etant donné un événement ProjectNotified émis pour un projet soumis à GF,
    et dont les GF ont été soumises à la candidature (selon l'AO),
    alors une entrée est ajoutée indiquant que les GF ont été soumises à la candidature`, async () => {
      const projet = makeFakeProject({ id: projetId, classe: 'Classé' });
      await Project.create(projet);

      const évènement = new ProjectNotified({
        payload: {
          projectId: projetId,
          candidateEmail: 'candidat@test.test',
          candidateName: 'nom candidat',
          periodeId: '1',
          appelOffreId: 'PPE2 - Eolien',
          notifiedOn: 123,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectNotified(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toMatchObject({ statut: 'en attente', soumisesALaCandidature: true });
    });
  });
});
