import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProjectGFDueDateCancelled } from '@modules/project';
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { onProjectGFDueDateCancelled } from './onProjectGFDueDateCancelled';

describe(`handler onProjectGFDueDateCancelled pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const id = new UniqueEntityID().toString();
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const gfDate = new Date('2020-01-01');
  const fichierId = new UniqueEntityID().toString();
  const envoyéesPar = new UniqueEntityID().toString();
  const dateExpiration = new Date('2020-01-01');
  const dateLimiteEnvoi = new Date();

  const évènement = new ProjectGFDueDateCancelled({
    payload: {
      projectId: projetId,
    },
    original: {
      version: 1,
      occurredAt,
    },
  });

  it(`Etant donné un projet existant dans la projection garantiesFinancières,
    lorsqu'un événement ProjectGFDueDateCancelled est émis pour ce projet,
    alors la date limite d'envoi devrait être supprimée dans la projection
    et le reste de données devrait être conservé`, async () => {
    await GarantiesFinancières.create({
      id,
      projetId,
      statut: 'à traiter',
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
      dateLimiteEnvoi,
    });

    await onProjectGFDueDateCancelled(évènement);

    const GF = await GarantiesFinancières.findOne({ where: { projetId } });

    expect(GF).toMatchObject({
      id,
      projetId,
      statut: 'à traiter',
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
    });

    expect(GF?.dateLimiteEnvoi).toBeNull();
  });
});
