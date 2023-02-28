import onGestionnaireRéseauAjouté from './onGestionnaireRéseauAjouté';
import { GestionnaireRéseauAjouté } from '@modules/gestionnaireRéseau';
import { resetDatabase } from '../../../../helpers';
import { GestionnairesRéseauListe } from '../gestionnairesRéseauListe.model';

describe('gestionnaireRéseau.onGestionnaireRéseauAjouté', () => {
  beforeEach(resetDatabase);

  it(`
    Lorsqu'un évenement GestionnaireRéseauAjouté est emis
    Alors la liste des gestionnaire de réseau est mise à jour
  `, async () => {
    const codeEIC = '17X100A100A0001A';
    const raisonSociale = 'Enedis';
    const format = 'XX-YY-ZZ';
    const légende = 'la légende';

    await onGestionnaireRéseauAjouté(
      new GestionnaireRéseauAjouté({
        payload: {
          codeEIC,
          raisonSociale,
          format,
          légende,
        },
      }),
    );

    const actualDetails = await GestionnairesRéseauListe.findOne({ where: { codeEIC }, raw: true });
    expect(actualDetails).toEqual({
      codeEIC,
      raisonSociale,
    });
  });
});
