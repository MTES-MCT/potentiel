import { encodeParameter } from '../encodeParameter';

export const modifierInstallateur = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/installation/installateur/modifier`;

export const modifierTypologie = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/installation/typologie-du-projet/modifier`;

export const modifierDispositifDeStockage = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/installation/dispositif-de-stockage/modifier`;

export const changementInstallateur = {
  détails: (identifiantProjet: string, enregistréLe: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/installation/installateur/changement/${enregistréLe}`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/installation/installateur/changement/enregistrer`,
  lister: `laureats/changements/installateur`,
};
