
export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon`;

export const transmettrePreuveRecandidature = (identifiantProjet: string) =>
  `/laureats/${encodeURIComponent(identifiantProjet)}/abandon/transmettre-preuve-recandidature`;
