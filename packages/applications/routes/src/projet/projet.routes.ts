import { encodeParameter } from '../encodeParameter';

export const details = (identifiantProjet: string) => {
  const url = `/projet/${encodeParameter(identifiantProjet)}/details.html`;
  return url;
};

export const détailÉliminé = (identifiantProjet: string) =>
  new URL(`/projets/${encodeParameter(identifiantProjet)}`).toString();

export const lister = () => `/projets.html`;
