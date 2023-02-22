import { UniqueEntityID } from '@core/domain';
import { resetDatabase } from '@infra/sequelize/helpers';
import { ProjectGFRemoved } from '@modules/project';
import { GarantiesFinancières } from '../garantiesFinancières.model';
import onProjectGFRemoved from './onProjectGFRemoved';

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

  it(`Etant donné un projet existant dans la projection garantiesFinancières,
    Lorsqu'un événement ProjectGFRemoved est émis pour ce projet,
    alors la ligne devrait être mise à jour avec le statut 'en attente' 
    et les données du fichier envoyé devraient être retirées`, async () => {
    await GarantiesFinancières.create({
      id,
      projetId,
      statut: 'à traiter',
      soumisesALaCandidature: false,
      envoyéesPar,
      dateEchéance: dateExpiration,
      dateEnvoi: occurredAt,
      dateConstitution: gfDate,
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
    });
  });
});
