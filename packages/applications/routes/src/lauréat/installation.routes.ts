import { encodeParameter } from '../encodeParameter';

export const modifierInstallateur = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/installation/installateur/modifier`;

export const modifierTypologie = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/installation/typologie-installation/modifier`;
