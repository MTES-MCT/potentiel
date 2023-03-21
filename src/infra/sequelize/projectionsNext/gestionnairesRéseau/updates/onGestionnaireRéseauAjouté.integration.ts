import onGestionnaireRéseauAjouté from './onGestionnaireRéseauAjouté';
import { GestionnaireRéseauAjouté } from './gestionnaireRéseauAjouté.deprecated';
import { resetDatabase } from '../../../helpers';
import { GestionnaireRéseau } from '@infra/sequelize/projectionsNext';

describe('gestionnaireRéseau.onGestionnaireRéseauAjouté', () => {
  beforeEach(resetDatabase);

  it(`
    Lorsqu'un évenement GestionnaireRéseauAjouté est emis
    Alors le détail du gestionnaire de réseau est créé
  `, async () => {
    const codeEIC = '17X100A100A0001A';
    const raisonSociale = 'Enedis';
    const format = 'XX-YY-ZZ';
    const légende = 'la légende';

    await onGestionnaireRéseauAjouté(
      new GestionnaireRéseauAjouté({
        payload: {
          streamId: `gestionnaireRéseau#${codeEIC}`,
          codeEIC,
          raisonSociale,
          aideSaisieRéférenceDossierRaccordement: {
            format,
            légende,
          },
        },
      }),
    );

    const actualDetails = await GestionnaireRéseau.findOne({ where: { codeEIC }, raw: true });
    expect(actualDetails).toEqual({
      codeEIC,
      raisonSociale,
      format,
      légende,
    });
  });
});
