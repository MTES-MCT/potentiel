import { match } from 'ts-pattern';

import { PotentielWorld } from '../potentiel.world';

export type RôleUtilisateur = 'le porteur' | 'la dreal' | "l'administrateur";

export function getRôle(this: PotentielWorld, rôleUtilisateur: RôleUtilisateur) {
  const { role } = match(rôleUtilisateur)
    .with('le porteur', () => this.utilisateurWorld.porteurFixture)
    .with('la dreal', () => this.utilisateurWorld.drealFixture)
    .with("l'administrateur", () => this.utilisateurWorld.adminFixture)
    .exhaustive();
  return role;
}
