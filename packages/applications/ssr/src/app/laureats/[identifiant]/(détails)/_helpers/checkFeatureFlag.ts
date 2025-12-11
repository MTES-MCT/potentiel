import { redirect } from 'next/navigation';

import { getContext } from '@potentiel-applications/request-context';
import { IdentifiantProjet } from '@potentiel-domain/projet';

export const checkFeatureFlag = (
  identifiantProjet: IdentifiantProjet.ValueType,
  searchParams?: Record<string, string>,
) => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const { features } = getContext() ?? {};

  // Redirection vers la page projet legacy
  if (!features?.includes('page-projet')) {
    const legacyUrl = `/projet/${encodeURIComponent(identifiantProjet.formatter())}/details.html`;
    if (urlSearchParams.size === 0) {
      redirect(legacyUrl);
    }
    redirect(`${legacyUrl}?${urlSearchParams.toString()}`);
  }
};
