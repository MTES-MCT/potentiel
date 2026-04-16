import { match } from 'ts-pattern';

import { PotentielWorld } from '../potentiel.world.js';

export type RôleUtilisateur = 'le porteur' | 'la dreal' | 'la dgec';

export function getRôle(this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
  const { role } = match(rôleUtilisateur)
    .with('le porteur', () => this.utilisateurWorld.porteurFixture)
    .with('la dreal', () => this.utilisateurWorld.drealFixture)
    .with('la dgec', () => this.utilisateurWorld.dgecFixture)
    .exhaustive();
  return role;
}
