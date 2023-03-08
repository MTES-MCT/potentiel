import { UniqueEntityID } from '@core/domain';
import { ProjectDCRSubmitted } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { Raccordements } from '@infra/sequelize/projectionsNext';
import onProjectDCRSubmitted from './onProjectDCRSubmitted';

describe('Raccordements.onProjectDCRSubmitted', () => {
  const projetId = new UniqueEntityID().toString();
  const identifiantGestionnaire = 'identifiant';

  beforeEach(async () => await resetDatabase());

  it(`Lorsque l'event ProjectDCRSubmitted survient avec un numéro de dossier renseigné, 
      Alors l'identifiant de gestionnaire devrait être mise à jour`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
    });

    await onProjectDCRSubmitted(
      new ProjectDCRSubmitted({
        payload: {
          projectId: projetId,
          numeroDossier: identifiantGestionnaire,
          submittedBy: 'id',
          dcrDate: new Date('2022-01-01'),
          fileId: '123',
        },
      }),
    );

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      identifiantGestionnaire,
    });
  });
});
