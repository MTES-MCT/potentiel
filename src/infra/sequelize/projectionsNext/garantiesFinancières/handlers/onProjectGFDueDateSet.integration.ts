import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProjectGFDueDateSet } from '@modules/project';
import { GarantiesFinancières, Project } from '@infra/sequelize/projectionsNext';
import { onProjectGFDueDateSet } from './onProjectGFDueDateSet';
import makeFakeProject from '../../../../../__tests__/fixtures/project';

describe(`handler onProjectGFDueDateSet pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const id = new UniqueEntityID().toString();
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const dateLimiteEnvoi = new Date('2022-12-28');

  describe(`Mise à jour d'une ligne dans la projection`, () => {
    it(`Etant donné un projet existant dans la projection garantiesFinancières,
    lorsqu'un événement ProjectGFDueDateSet est émis pour ce projet,
    alors la ligne devrait être mise à jour avec une nouvelle date limite d'envoi`, async () => {
      await GarantiesFinancières.create({
        id,
        projetId,
        statut: 'en attente',
        soumisesALaCandidature: false,
      });

      const évènement = new ProjectGFDueDateSet({
        payload: {
          projectId: projetId,
          garantiesFinancieresDueOn: dateLimiteEnvoi.getTime(),
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectGFDueDateSet(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toMatchObject({ id, dateLimiteEnvoi, soumisesALaCandidature: false });
    });
  });

  describe(`Création d'une ligne dans la projection`, () => {
    it(`Etant donné un projet non présent dans la projection garantiesFinancières,
    Lorsqu'un évènement ProjectGFDueDateSet est émis pour ce projet,
    alors une nouvelle ligne devrait être insérée dans la projection avec la date limite d'envoi de l'évènement`, async () => {
      const projet = makeFakeProject({
        id: projetId,
        appelOffreId: 'Fessenheim',
        periodeId: '2',
        familleId: '1',
      });

      await Project.create(projet);

      const évènement = new ProjectGFDueDateSet({
        payload: {
          projectId: projetId,
          garantiesFinancieresDueOn: dateLimiteEnvoi.getTime(),
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectGFDueDateSet(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toMatchObject({ soumisesALaCandidature: false, dateLimiteEnvoi });
    });
  });
});
