import { redirect } from 'next/navigation';

import { getContext } from '@potentiel-applications/request-context';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { InformationsGénéralesSection } from './InformationsGénéralesSection';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const urlSearchParams = new URLSearchParams(searchParams);

  const { features } = getContext() ?? {};

  // Redirection vers la page projet legacy
  if (!features?.includes('page-projet')) {
    const legacyUrl = `/projet/${encodeURIComponent(identifiantProjet)}/details.html`;
    if (urlSearchParams.size === 0) {
      redirect(legacyUrl);
    }
    redirect(`${legacyUrl}?${urlSearchParams.toString()}`);
  }

  // const lauréat = await getLauréat({ identifiantProjet });

  return <InformationsGénéralesSection />;
}
