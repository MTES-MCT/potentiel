import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';
import {
  getProducteurData,
  getReprésentantLégalData,
  getPuissanceData,
  getLauréatData,
  getActionnaireData,
} from '../informations-generales/_helpers/getInformationsGénéralesData';
import { getInstallation } from '../installation/_helpers/getInstallation';
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

      const producteur = await getProducteurData({
        identifiantProjet: identifiantProjet,
        rôle,
      });

      const représentantLégal = await getReprésentantLégalData({
        identifiantProjet: identifiantProjet,
        rôle,
      });

      const puissance = await getPuissanceData({
        identifiantProjet: identifiantProjet,
        rôle,
      });

      const { siteDeProduction, coefficientKChoisi, prixRéférence, emailContact, actionnariat } =
        await getLauréatData({ identifiantProjet, rôle });

      const actionnaire = await getActionnaireData({
        identifiantProjet,
        rôle,
        nécessiteInstruction: false,
      });

      const installation = await getInstallation({ rôle: utilisateur.rôle, identifiantProjet });

      const évaluationCarbone = await getÉvaluationCarbone({
        rôle: utilisateur.rôle,
        identifiantProjet,
      });

      // ajouter tableau de bord
      // ajouter des print:hidden
      // attentions aux marges entre ColumnPageTemplate et les SectionPage (PageTemplate)

      return (
        <ImprimerPage
          siteDeProduction={siteDeProduction}
          emailContact={emailContact}
          représentantLégal={représentantLégal}
          producteur={producteur}
          actionnaire={actionnaire}
          prixRéférence={prixRéférence}
          actionnariat={actionnariat}
          puissance={puissance}
          coefficientKChoisi={coefficientKChoisi}
          installation={installation}
          évaluationCarbone={évaluationCarbone}
        />
      );
    }),
  );
}
