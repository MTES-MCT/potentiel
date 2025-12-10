import { redirect } from 'next/navigation';

import { getContext } from '@potentiel-applications/request-context';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ÉvaluationCarbonePage } from './ÉvaluationCarbone.page';
import { getÉvaluationCarbone } from './_helpers/getEvaluationCarbone';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
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

      const évaluationCarbone = await getÉvaluationCarbone({
        rôle: utilisateur.rôle,
        identifiantProjet,
      });

      return <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />;
    }),
  );
}
