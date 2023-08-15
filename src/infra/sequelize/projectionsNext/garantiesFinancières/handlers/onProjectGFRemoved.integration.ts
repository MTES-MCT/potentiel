import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { resetDatabase } from "../../../helpers";
import { ProjectGFRemoved } from '../../../../../modules/project';
import { GarantiesFinancières } from "../..";
import { onProjectGFRemoved } from './onProjectGFRemoved';

describe(`handler onProjectGFRemoved pour la projection garantiesFinancières`, () => {
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

  const évènement = new ProjectGFRemoved({
    payload: {
      projectId: projetId,
      removedBy: retiréPar,
    },
    original: {
      version: 1,
      occurredAt,
    },
  });

  it(`Etant donné un projet avec des garanties financières validées
    Lorsqu'un événement ProjectGFRemoved est émis pour ce projet
    Alors les garanties financières devraient être "en attente" 
    Et les données des anciennes garanties financières devraient être retirées`, async () => {
    await GarantiesFinancières.create({
      id,
      projetId,
      statut: 'validé',
      soumisesALaCandidature: false,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
      validéesLe: occurredAt,
      validéesPar: new UniqueEntityID().toString(),
      fichierId,
      dateLimiteEnvoi,
    });

    await onProjectGFRemoved(évènement);

    const GF = await GarantiesFinancières.findOne({ where: { projetId } });

    expect(GF).toMatchObject({
      id,
      projetId,
      soumisesALaCandidature: false,
      statut: 'en attente',
      dateLimiteEnvoi,
      envoyéesPar: null,
      dateEnvoi: null,
      dateConstitution: null,
      validéesLe: null,
      validéesPar: null,
    });
  });
});
