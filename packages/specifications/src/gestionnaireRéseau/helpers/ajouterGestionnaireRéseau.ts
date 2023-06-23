import { mediator } from 'mediateur';
import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';
import { sleep } from '../../helpers/sleep';
import { GestionnaireRéseau } from './gestoinnaireRéseau';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';

export async function ajouterGestionnaireRéseau(
  this: GestionnaireRéseauWorld,
  gestionnaireRéseau: Partial<GestionnaireRéseau> & { codeEIC: string },
) {
  const { codeEIC, raisonSociale = 'Une raison sociale' } = gestionnaireRéseau;
  const aideSaisieRéférenceDossierRaccordement =
    gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement ?? {
      format: '',
      légende: '',
      expressionReguliere: '.',
    };

  await mediator.send<DomainUseCase>({
    type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
    data: {
      identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    },
  });

  //   this.gestionnairesRéseauFixtures.set(raisonSociale, {
  //     codeEIC,
  //     raisonSociale,
  //     aideSaisieRéférenceDossierRaccordement,
  //   });
  await sleep(100);
}
