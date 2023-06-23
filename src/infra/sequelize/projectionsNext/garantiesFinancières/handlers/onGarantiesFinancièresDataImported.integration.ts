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

  it(`Etant donné un événement GarantiesFinancièresDataImported émis,
    alors une entrée est ajoutée dans la table GarantiesFinancières`, async () => {
    const dateEchéance = new Date('2030-01-01').toISOString();
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
});
