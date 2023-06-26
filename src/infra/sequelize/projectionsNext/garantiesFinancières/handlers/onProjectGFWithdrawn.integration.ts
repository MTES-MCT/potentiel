import { UniqueEntityID } from '@core/domain';
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProjectGFWithdrawn } from '@modules/project';
import { onProjectGFWithdrawn } from './onProjectGFWithdrawn';

describe(`handler onProjectGFWithdrawn pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const id = new UniqueEntityID().toString();
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const gfDate = new Date('2020-01-01');
  const fichierId = new UniqueEntityID().toString();
  const retiréPar = new UniqueEntityID().toString();
  const envoyéesPar = new UniqueEntityID().toString();
  const dateExpiration = new Date('2020-01-01');
  const dateLimiteEnvoi = new Date();

  const évènement = new ProjectGFWithdrawn({
    payload: {
      projectId: projetId,
      removedBy: retiréPar,
    },
    original: {
      version: 1,
      occurredAt,
    },
  });

  it(`Etant donné un projet existant dans la projection garantiesFinancières,
    Lorsqu'un événement ProjectGFWithdrawn est émis pour ce projet,
    alors la ligne devrait être mise à jour avec le statut 'en attente' 
    et les données du fichier envoyé devraient être retirées`, async () => {
    await GarantiesFinancières.create({
      id,
      projetId,
      statut: 'validé',
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
      dateLimiteEnvoi,
    });

    await onProjectGFWithdrawn(évènement);

    const GF = await GarantiesFinancières.findOne({ where: { projetId } });

    expect(GF).toMatchObject({
      id,
      projetId,
      statut: 'en attente',
      soumisesALaCandidature: true,
      envoyéesPar: null,
      dateEchéance: dateExpiration,
      dateEnvoi: null,
      dateConstitution: null,
      fichierId: null,
      dateLimiteEnvoi,
    });
  });
});
