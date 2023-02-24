import { makeAjouterGestionnaireRéseau } from './ajouterGestionnaireRéseau';
import { GestionnaireRéseauAjouté } from './events/gestionnaireRéseauAjouté';

describe(`Ajouter un gestionnaire de réseau`, () => {
  it(`Lorsqu'un administrateur ajoute un gestionnaire de réseau, 
        alors, le gestionnaire devrait être ajouté.`, async () => {
    const publishToEventStore = jest.fn();

    const nom = 'Enedis';
    const format = 'XX-YY-ZZ';
    const légende = 'la légende';

    const ajouterGestionnaireRéseau = makeAjouterGestionnaireRéseau({ publishToEventStore });

    const résultat = await ajouterGestionnaireRéseau({ nom, format, légende });

    expect(résultat.isOk()).toBe(true);
    expect(publishToEventStore).toHaveBeenCalledWith(GestionnaireRéseauAjouté);
  });
});
