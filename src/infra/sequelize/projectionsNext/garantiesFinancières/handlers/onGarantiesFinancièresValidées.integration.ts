import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { resetDatabase } from "../../../helpers";
import { GarantiesFinancièresValidées } from '../../../../../modules/project';
import { GarantiesFinancières } from "../..";
import { onGarantiesFinancièresValidées } from './onGarantiesFinancièresValidées';

describe(`handler onGarantiesFinancièresValidées pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  const id = new UniqueEntityID().toString();
  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const gfDate = new Date('2020-01-01');
  const fichierId = new UniqueEntityID().toString();
  const envoyéesPar = new UniqueEntityID().toString();
  const validéesPar = new UniqueEntityID().toString();
  const dateExpiration = new Date('2020-01-01');
  const dateLimiteEnvoi = new Date('2020-01-01');

  it(`Etant donné un projet existant dans la projection garantiesFinancières avec le statut 'à traiter',
      lorsqu'un événement GarantiesFinancièresValidées est émis pour ce projet,
      alors le statut devrait passer à 'validé' etles infos du contexte de validation (validéesLe, validéesPar) devrait être renseignées. Le reste des données devrait être conservé`, async () => {
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

    await onGarantiesFinancièresValidées(
      new GarantiesFinancièresValidées({
        payload: {
          projetId,
          validéesPar,
        },
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const GF = await GarantiesFinancières.findOne({ where: { projetId } });

    expect(GF).toMatchObject({
      id,
      projetId,
      statut: 'validé',
      validéesPar,
      validéesLe: occurredAt,
      soumisesALaCandidature: true,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      fichierId,
    });
  });
});
