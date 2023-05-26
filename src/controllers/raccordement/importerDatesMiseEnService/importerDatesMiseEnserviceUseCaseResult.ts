import { IdentifiantProjet } from '@potentiel/domain/src/projet/identifiantProjet';

export type Réussi = {
  référenceDossier: string;
  statut: 'réussi';
  identifiantProjet: IdentifiantProjet;
};
export type Échec = {
  référenceDossier: string;
  statut: 'échec';
  raison: string;
  identifiantsProjet: ReadonlyArray<IdentifiantProjet>;
};
type Résultat = Réussi | Échec;

export type ImporterDatesMiseEnServiceUseCaseResult = Array<Résultat>;
export const isRéussi = (res: Résultat): res is Réussi => res.statut === 'réussi';
export const isÉchec = (res: Résultat): res is Échec => res.statut === 'échec';
