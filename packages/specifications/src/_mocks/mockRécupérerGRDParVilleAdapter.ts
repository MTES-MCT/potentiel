import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../potentiel.world.js';

export async function mockRécupérerGRDParVilleAdapter(
  this: PotentielWorld,
  search: { codePostal: string; commune: string },
) {
  return this.gestionnaireRéseauWorld.rechercherOREParVille(search) ?? Option.none;
}
