import { encodeParameter } from '../encodeParameter';

/**
 *
 * @deprecated Lien vers la page lauréat legacy
 */
export const details = (identifiantProjet: string) => {
  const url = `/projet/${encodeParameter(identifiantProjet)}/details.html`;
  return url;
};

export const détailsÉliminé = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;

export const lister = () => `/projets.html`;
