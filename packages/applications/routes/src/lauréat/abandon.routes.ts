import { encodeParameter } from '../encodeParameter';

export const lister = '/abandons';

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/modele-reponse`;

/**
 * @deprecated Cette route est conservée pour la retrocompatibilité avec les mails préalablement envoyés
 */
export const transmettrePreuveRecandidature = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/abandon/transmettre-preuve-recandidature`;
