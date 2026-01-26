import { encodeParameter } from '../encodeParameter';

/**
 * Redirige vers lauréat ou éliminé selon le cas.
 * Utiliser Routes.Lauréat.détails ou Routes.Éliminé.détails si le statut est connu.
 **/
export const details = (
  identifiantProjet: string,
  feedback?: {
    type: 'success' | 'error';
    message: string;
  },
) => {
  const url = `/projets/${encodeParameter(identifiantProjet)}`;
  const searchParams = new URLSearchParams();

  if (feedback?.type === 'success') {
    searchParams.append('success', feedback.message);
  }
  if (feedback?.type === 'error') {
    searchParams.append('error', feedback.message);
  }

  if (searchParams.size === 0) {
    return url;
  }
  return `${url}?${searchParams.toString()}`;
};
