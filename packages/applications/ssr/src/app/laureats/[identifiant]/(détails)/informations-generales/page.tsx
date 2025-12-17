import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';

import { getLauréatData } from './_helpers/getInformationsGénéralesData';
import { InformationsGénéralesPage } from './InformationsGénérales.page';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const rôle = utilisateur.rôle;

      checkFeatureFlag(identifiantProjet, searchParams);

      const { siteDeProduction, emailContact } = await getLauréatData({ identifiantProjet, rôle });

      return (
        <InformationsGénéralesPage
          siteDeProduction={siteDeProduction}
          emailContact={emailContact}
          identifiantProjet={identifiantProjet.formatter()}
        />
      );
    }),
  );
}
