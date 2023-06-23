import { DomainUseCase, convertirEnIdentifiantGestionnaireRéseau } from '@potentiel/domain';
import { mediator } from 'mediateur';
import { sleep } from '../../helpers/sleep';
import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';
import { GestionnaireRéseau } from './gestoinnaireRéseau';

export async function modifierGestionnaireRéseau(
  this: GestionnaireRéseauWorld,
  gestionnaireRéseau: GestionnaireRéseau,
) {
  const { codeEIC, raisonSociale, aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;

  await mediator.send<DomainUseCase>({
    type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
    data: {
      identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    },
  });

  this.gestionnairesRéseauFixtures.set(raisonSociale, {
    codeEIC,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
  });
  await sleep(100);
}
