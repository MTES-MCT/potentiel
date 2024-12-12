import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const demandeChangement = {
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement-representant-legal:demander`,
  détail: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/changement-representant-legal`,
};
