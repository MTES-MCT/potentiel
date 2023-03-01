import { UniqueEntityID } from '@core/domain';
import { NumeroGestionnaireSubmitted } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { Raccordements } from '../raccordements.model';
import onNumeroGestionnaireSubmitted from './onNumeroGestionnaireSubmitted';

describe('Raccordements.onNumeroGestionnaireSubmitted', () => {
  const projetId = new UniqueEntityID().toString();
  const identifiantGestionnaire = 'identifiant';

  beforeEach(async () => await resetDatabase());

  it(`Lorsque l'event NumeroGestionnaireSubmitted survient, 
      Alors l'identifiant de gestionnaire devrait être mise à jour
      Et le codeEIC du gestionnaire s'il est présent dans l'événement`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
    });

    await onNumeroGestionnaireSubmitted(
      new NumeroGestionnaireSubmitted({
        payload: {
          projectId: projetId,
          numeroGestionnaire: identifiantGestionnaire,
          submittedBy: 'id',
          codeEICGestionnaireRéseau: 'codeEICDuGestionnaire',
        },
      }),
    );

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      identifiantGestionnaire,
      codeEICGestionnaireRéseau: 'codeEICDuGestionnaire',
    });
  });
});
