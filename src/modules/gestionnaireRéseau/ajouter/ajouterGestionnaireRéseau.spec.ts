import { okAsync } from 'neverthrow';
import { fakeRepo } from '../../../__tests__/fixtures/aggregates';
import { ajouterGestionnaireRéseauFactory } from './ajouterGestionnaireRéseau';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';

describe(`Ajouter un gestionnaire de réseau`, () => {
  const publish = jest.fn(() => okAsync(null));

  const codeEIC = '17X100A100A0001A';
  const raisonSociale = 'Enedis';
  const format = 'XX-YY-ZZ';
  const légende = 'la légende';

  beforeEach(() => {
    publish.mockClear();
  });

  it(`Lorsqu'un administrateur ajoute un gestionnaire de réseau, 
        alors, le gestionnaire devrait être ajouté.`, async () => {
    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauFactory({
      publish,
      repository: fakeRepo(),
    });

    const résultat = await ajouterGestionnaireRéseau({
      codeEIC,
      raisonSociale,
      format,
      légende,
    });

    const type = 'GestionnaireRéseauAjouté';
    const payload: GestionnaireRéseauAjouté['payload'] = {
      codeEIC: 'autre code',
      raisonSociale,
      format,
      légende,
    };
    expect(résultat.isOk()).toBe(true);
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type,
        payload,
      }),
    );
  });

  it(`Etant donné un gestionnaire de réseau,
    Lorsqu'un admin ajoute un gestionnaire ayant le même code EIC,
    alors le gestionnaire de réseau devrait pas être ajouté,
    et l'admin devrait être informé que le gestionnaire existe déjà,`, async () => {
    const agrégat = {
      codeEIC: '17X100A100A0001A',
      raisonSociale: 'Enedis',
      format: 'XX-YY-ZZ',
      légende: 'la légende',
    };

    const repository = fakeRepo(agrégat);

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauFactory({
      publish,
      repository,
    });

    const résultat = await ajouterGestionnaireRéseau({ codeEIC, raisonSociale, format, légende });

    const type = 'GestionnaireRéseauAjouté';
    const payload: GestionnaireRéseauAjouté['payload'] = {
      codeEIC,
      raisonSociale,
      format,
      légende,
    };
    expect(résultat.isErr()).toBe(true);
    expect(publish).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type,
        payload,
      }),
    );
  });
});
