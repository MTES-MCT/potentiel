export const lister = '/laureats/abandon';

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon`;

export const demander = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon/demander`;

export const téléchargerModèleRéponse = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon/modele-reponse`;

export const transmettrePreuveRecandidature = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon/transmettre-preuve-recandidature`;
