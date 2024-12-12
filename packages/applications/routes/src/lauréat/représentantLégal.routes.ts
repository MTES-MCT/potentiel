import { encodeParameter } from '../encodeParameter';

export const modifier = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/representant-legal/modifier`;

export const demandeChangement = {
  détail: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/demande-changement/representant-legal`,
  demander: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/demande-changement/representant-legal/demander`,
};
