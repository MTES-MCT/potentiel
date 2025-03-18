import { encodeParameter } from '../encodeParameter';

export const lister = `/utilisateurs`;
export const inviter = `/utilisateurs/inviter`;
export const réclamerProjet = `/reclamer`;

export const listerPorteurs = (identifiantProjet: string) =>
  `/utilisateurs/${encodeParameter(identifiantProjet)}`;
