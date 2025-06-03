import { encodeParameter } from '../encodeParameter';

/**
 *
 * @deprecated Lien vers la page lauréat legacy
 */
export const details = (identifiantProjet: string) => {
  const url = `/projet/${encodeParameter(identifiantProjet)}/details.html`;
  return url;
};

export const lister = () => `/projets.html`;

export * as Éliminé from './éliminé.routes';
