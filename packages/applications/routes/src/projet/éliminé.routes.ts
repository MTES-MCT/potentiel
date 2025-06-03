import { encodeParameter } from '../encodeParameter';

/**
 * Lien vers la page éliminé dans la nouvelle app, à terme cette page déterminera toute seule si elle doit retoruner la page lauréat ou éliminé
 * @param identifiantProjet
 */
export const détails = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;
