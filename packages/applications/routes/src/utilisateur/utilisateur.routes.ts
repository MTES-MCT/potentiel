import { encodeParameter } from '../encodeParameter';

export const lister = ({ actif }: { actif?: boolean } = {}) => {
  const url = `/utilisateurs`;
  const searchParams = new URLSearchParams();
  if (actif !== undefined) {
    searchParams.set('actif', actif ? 'true' : 'false');
  }
  return searchParams.size > 0 ? `${url}?${searchParams.toString()}` : url;
};
export const inviter = `/utilisateurs/inviter`;
export const réclamerProjet = `/reclamer`;

/** TODO à déplacer dans /projet */
export const listerPorteurs = (identifiantProjet: string) =>
  `/utilisateurs/${encodeParameter(identifiantProjet)}`;

export const modifierRôle = (identifiantUtilisateur: string) =>
  `/utilisateurs/${encodeParameter(identifiantUtilisateur)}/role:modifier`;
