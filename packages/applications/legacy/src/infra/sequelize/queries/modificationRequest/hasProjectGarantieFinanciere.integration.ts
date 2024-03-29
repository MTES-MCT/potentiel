import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import { resetDatabase } from '../../helpers';
import { hasGarantiesFinancières } from './hasGarantiesFinancières';
import { v4 as uuid } from 'uuid';
import { GarantiesFinancières } from '../../projectionsNext';

const projetId = new UniqueEntityID().toString();

describe('Sequelize hasGarantiesFinancières', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Etant donné un projet avec garanties financières avec statut 'à traiter'
      Alors la fonction devrait retourner true`, async () => {
    await GarantiesFinancières.create({
      id: uuid(),
      projetId,
      soumisesALaCandidature: false,
      statut: 'à traiter',
    });

    expect((await hasGarantiesFinancières(projetId))._unsafeUnwrap()).toEqual(true);
  });

  it(`Etant donné un projet avec garanties financières avec statut 'validé'
      Alors la fonction devrait retourner true`, async () => {
    await GarantiesFinancières.create({
      id: uuid(),
      projetId,
      soumisesALaCandidature: false,
      statut: 'validé',
    });

    expect((await hasGarantiesFinancières(projetId))._unsafeUnwrap()).toEqual(true);
  });

  it(`Etant donné un projet avec garanties financières avec statut 'en attente'
      Alors la fonction devrait retourner false`, async () => {
    await GarantiesFinancières.create({
      id: uuid(),
      projetId,
      soumisesALaCandidature: false,
      statut: 'en attente',
    });

    expect((await hasGarantiesFinancières(projetId))._unsafeUnwrap()).toEqual(false);
  });

  it(`Etant donné un projet sans garanties financières
      Alors la fonction devrait retourner false`, async () => {
    expect((await hasGarantiesFinancières(projetId))._unsafeUnwrap()).toEqual(false);
  });
});
