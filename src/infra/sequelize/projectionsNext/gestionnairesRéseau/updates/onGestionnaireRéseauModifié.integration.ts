import { resetDatabase } from '../../../helpers';
import { GestionnaireRéseau } from '@infra/sequelize/projectionsNext';
import onGestionnaireRéseauModifié, {
  GestionnaireRéseauModifié,
} from './onGestionnaireRéseauModifié';

describe('gestionnaireRéseau.onGestionnaireRéseauModifié', () => {
  beforeEach(resetDatabase);

  it(`
    Étant donné un gestionnaire réseau existant
    Lorsqu'un évenement GestionnaireRéseauModifié est émis
    Alors le détail du gestionnaire de réseau devrait être modifié
  `, async () => {
    const codeEIC = 'codeEIC';
    const raisonSociale = 'Enedis';
    const format = 'XX-YY-ZZ';
    const légende = 'la légende';

    await GestionnaireRéseau.create({
      codeEIC,
      raisonSociale: 'RaisonSociale',
      format: 'ABC',
      légende: 'légende initiale',
    });

    await onGestionnaireRéseauModifié(
      new GestionnaireRéseauModifié({
        payload: {
          streamId: `gestionnaireRéseau#${codeEIC}`,
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
