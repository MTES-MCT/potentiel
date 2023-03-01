import { UniqueEntityID } from '@core/domain';
import { NumeroGestionnaireSubmitted } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { Raccordements } from '../raccordements.model';
import onNumeroGestionnaireSubmitted from './onNumeroGestionnaireSubmitted';

describe('Raccordements.onNumeroGestionnaireSubmitted', () => {
  const projetId = new UniqueEntityID().toString();

  beforeEach(async () => await resetDatabase());

  it(`Lorsque l'événement NumeroGestionnaireSubmitted est émis avec un identifiant et un code EIC, 
      Alors des deux données devraient être enregistrée`, async () => {
    const identifiantGestionnaire = 'identifiant';

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

  it(`Etant donné un projet avec un identifiant gestionnaire et un code EIC gestionnaire,
      Lorsque l'événement NumeroGestionnaireSubmitted est émis avec un nouvel identifiant gestionnaire, 
      Alors seul l'identifiant gestionaire devrait être mis à jour`, async () => {
    await Raccordements.create({
      id: new UniqueEntityID().toString(),
      projetId,
      identifiantGestionnaire: 'identifiant-gestionnaire',
      codeEICGestionnaireRéseau: 'code-EIC-gestionnaire',
    });

    await onNumeroGestionnaireSubmitted(
      new NumeroGestionnaireSubmitted({
        payload: {
          projectId: projetId,
          numeroGestionnaire: 'nouvel-identifiant',
          submittedBy: 'id',
          codeEICGestionnaireRéseau: undefined,
        },
      }),
    );

    expect(await Raccordements.findOne({ where: { projetId } })).toMatchObject({
      identifiantGestionnaire: 'nouvel-identifiant',
      codeEICGestionnaireRéseau: 'code-EIC-gestionnaire',
    });
  });
});
