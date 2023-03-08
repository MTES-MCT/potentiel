import { UniqueEntityID } from '@core/domain';
import { GestionnaireRéseauRenseigné } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { Raccordements } from '@infra/sequelize/projectionsNext';
import onGestionnaireRéseauRenseigné from './onGestionnaireRéseauRenseigné';

describe('Raccordements.onGestionnaireRéseauRenseigné', () => {
  const projetId = new UniqueEntityID().toString();

  beforeEach(async () => await resetDatabase());

  it(`Lorsque l'événement GestionnaireRéseauRenseigné est émis, 
      alors les données de raccordement devraient être mises à jour avec le code EIC du gestionnaire`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
    });

    await onGestionnaireRéseauRenseigné(
      new GestionnaireRéseauRenseigné({
        payload: {
          projectId: projetId,
          submittedBy: 'id',
          codeEIC: 'codeEICDuGestionnaire',
        },
      }),
    );

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      codeEICGestionnaireRéseau: 'codeEICDuGestionnaire',
    });
  });
});
