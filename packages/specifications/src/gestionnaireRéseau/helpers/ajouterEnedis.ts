import { GestionnaireRéseauWorld } from '../gestionnaireRéseau.world';

export async function ajouterEnedis(this: GestionnaireRéseauWorld) {
  await this.ajouterGestionnaireRéseau({
    codeEIC: '17X100A100A0001A',
    raisonSociale: 'Enedis',
    aideSaisieRéférenceDossierRaccordement: {
      format: '',
      légende: '',
      expressionReguliere: `[a-zA-Z]{3}-RP-2[0-9]{3}-[0-9]{6}`,
    },
  });
}
