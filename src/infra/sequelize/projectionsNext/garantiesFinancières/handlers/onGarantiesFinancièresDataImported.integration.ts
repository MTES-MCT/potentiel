import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { GarantiesFinancièresDataImported } from '@modules/project';
import { onGarantiesFinancièresDataImported } from './onGarantiesFinancièresDataImported';

describe(`handler onGarantiesFinancièresDataImported pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const dateEchéance = new Date('2030-01-01').toISOString();

  it(`
    Lorsqu'un événement GarantiesFinancièresDataImported émis
    Alors une entrée est ajoutée dans la table GarantiesFinancières`, async () => {
    const évènement = new GarantiesFinancièresDataImported({
      payload: {
        projectId: projetId,
        type: "Garantie financière avec date d'échéance et à renouveler",
        dateEchéance,
      },
      original: {
        version: 1,
        occurredAt,
      },
    });

    await onGarantiesFinancièresDataImported(évènement);

    const garantiesFinancières = await GarantiesFinancières.findOne({ where: { projetId } });

    expect(garantiesFinancières).toMatchObject({
      statut: 'en attente',
      soumisesALaCandidature: true,
      type: "Garantie financière avec date d'échéance et à renouveler",
      dateEchéance: new Date(dateEchéance),
    });
  });

  it(`
    Etant donné des garanties financières "en attente"
    Lorsqu'un événement GarantiesFinancièresDataImported émis
    Alors l'entrée dans la projection est mise à jour`, async () => {
    const dateEnvoi = new Date('2020-01-01');
    const id = new UniqueEntityID().toString();
    const fichierId = new UniqueEntityID().toString();
    const envoyéesPar = new UniqueEntityID().toString();

    await GarantiesFinancières.create({
      id,
      statut: 'à traiter',
      projetId,
      soumisesALaCandidature: true,
      fichierId,
      dateEnvoi,
      envoyéesPar,
    });

    const évènement = new GarantiesFinancièresDataImported({
      payload: {
        projectId: projetId,
        type: "Garantie financière avec date d'échéance et à renouveler",
        dateEchéance,
      },
      original: {
        version: 1,
        occurredAt,
      },
    });

    await onGarantiesFinancièresDataImported(évènement);

    const garantiesFinancières = await GarantiesFinancières.findOne({ where: { projetId, id } });

    expect(garantiesFinancières).toMatchObject({
      id,
      statut: 'à traiter',
      projetId,
      soumisesALaCandidature: true,
      fichierId,
      dateEnvoi,
      envoyéesPar,
      type: "Garantie financière avec date d'échéance et à renouveler",
      dateEchéance: new Date(dateEchéance),
    });
  });
});
