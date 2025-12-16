import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';
import {
  getPuissanceData,
  getLauréatData,
  getActionnaireData,
} from '../informations-generales/_helpers/getInformationsGénéralesData';
import { getÉvaluationCarbone } from '../evaluation-carbone/_helpers/getEvaluationCarboneData';

import { ImprimerPage } from './Imprimer.page';

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

      const puissance = await getPuissanceData({
        identifiantProjet: identifiantProjet,
        rôle,
      });

      const { siteDeProduction, coefficientKChoisi, prixRéférence, emailContact, actionnariat } =
        await getLauréatData({ identifiantProjet, rôle });

      const actionnaire = await getActionnaireData({
        identifiantProjet,
        rôle,
      });

      const évaluationCarbone = await getÉvaluationCarbone({
        rôle: utilisateur.rôle,
        identifiantProjet,
      });

      // ajouter des print:hidden
      // attentions aux marges entre ColumnPageTemplate et les SectionPage (PageTemplate)

      return (
        <ImprimerPage
          siteDeProduction={siteDeProduction}
          emailContact={emailContact}
          actionnaire={actionnaire}
          prixRéférence={prixRéférence}
          actionnariat={actionnariat}
          puissance={puissance}
          coefficientKChoisi={coefficientKChoisi}
          évaluationCarbone={évaluationCarbone}
          identifiantProjet={identifiantProjet.formatter()}
        />
      );
    }),
  );
}
