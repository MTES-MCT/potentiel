import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';

import { ÉvaluationCarbonePage } from './ÉvaluationCarbone.page';
import { getÉvaluationCarbone } from './_helpers/getEvaluationCarboneData';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      checkFeatureFlag(identifiantProjet, searchParams);

      const évaluationCarbone = await getÉvaluationCarbone({
        rôle: utilisateur.rôle,
        identifiantProjet,
      });

      return <ÉvaluationCarbonePage évaluationCarbone={évaluationCarbone} />;
    }),
  );
}
