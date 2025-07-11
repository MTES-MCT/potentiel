import { encodeParameter } from '../encodeParameter';

/**
 *
 * @deprecated Lien vers la page projet legacy
 */
export const details = (
  identifiantProjet: string,
  feedback?: {
    type: 'success' | 'error';
    message: string;
  },
) =>
  `/projet/${encodeParameter(identifiantProjet)}/details.html${feedback ? `?${feedback.type === 'success' ? `success=${feedback.message}` : `error=${feedback.message}`}` : ''}`;

export const détailsÉliminé = (identifiantProjet: string) =>
  `/projets/${encodeParameter(identifiantProjet)}`;

export const lister = () => `/projets.html`;
