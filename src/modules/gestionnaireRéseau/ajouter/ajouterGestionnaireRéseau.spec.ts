import { okAsync } from 'neverthrow';
import { ajouterGestionnaireRéseauFactory } from './ajouterGestionnaireRéseau';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';

describe(`Ajouter un gestionnaire de réseau`, () => {
  it(`Lorsqu'un administrateur ajoute un gestionnaire de réseau, 
        alors, le gestionnaire devrait être ajouté.`, async () => {
    const publishToEventStore = jest.fn(() => okAsync(null));

    const codeEIC = '17X100A100A0001A';
    const raisonSociale = 'Enedis';
    const format = 'XX-YY-ZZ';
    const légende = 'la légende';

    const ajouterGestionnaireRéseau = ajouterGestionnaireRéseauFactory({
      publish: publishToEventStore,
    });

    const résultat = await ajouterGestionnaireRéseau({ codeEIC, raisonSociale, format, légende });

    const type = 'GestionnaireRéseauAjouté';
    const payload: GestionnaireRéseauAjouté['payload'] = {
      codeEIC,
      raisonSociale,
      format,
      légende,
    };
    expect(résultat.isOk()).toBe(true);
    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        type,
        payload,
      }),
    );
  });
});
