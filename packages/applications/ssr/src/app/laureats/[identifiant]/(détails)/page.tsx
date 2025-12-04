import { redirect } from 'next/navigation';
import { mediator } from 'mediateur';

import { getContext } from '@potentiel-applications/request-context';
import { IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { PageWithErrorHandling } from '../../../../utils/PageWithErrorHandling';
import { withUtilisateur } from '../../../../utils/withUtilisateur';
import { getLauréatInfos } from '../_helpers/getLauréat';

import { TableauDeBordPage } from './TableauDeBord.page';
import { getAbandonAlert } from './_helpers/getAbandonAlert';
import { getAchèvementAlert } from './_helpers/getAchèvementAlert';
import { getAchèvementData } from './_helpers/getAchèvementData';
import { getCahierDesChargesData } from './_helpers/getCahierDesChargesData';
import { getGarantiesFinancièresData } from './_helpers/getGarantiesFinancièresData';
import { getRaccordementData } from './_helpers/getRaccordementData';
import { getÉtapesData } from './_helpers/getÉtapesData';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const { rôle } = utilisateur;
      const urlSearchParams = new URLSearchParams(searchParams);

      const { features } = getContext() ?? {};

      if (!features?.includes('page-projet')) {
        const legacyUrl = `/projet/${encodeURIComponent(identifiantProjet.formatter())}/details.html`;
        if (urlSearchParams.size === 0) {
          redirect(legacyUrl);
        }
        redirect(`${legacyUrl}?${urlSearchParams.toString()}`);
      }

      // Lauréat
      const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });

      // Abandon
      const abandon = await getAbandon(identifiantProjet);

      // Achèvement
      const achèvementData = await getAchèvementData({ identifiantProjet, rôle });

      // Raccordement
      const raccordement = await getRaccordementData({
        role: rôle,
        identifiantProjet,
        estAbandonné: !!abandon?.statut.estAccordé(),
        aUnAbandonEnCours: !!abandon?.statut.estEnCours(),
      });

      const recours = await getRecours(identifiantProjet);

      const cahierDesChargesData = await getCahierDesChargesData({ identifiantProjet, rôle });

      const étapes = getÉtapesData({
        dateNotification: lauréat.notifiéLe.formatter(),
        dateAchèvementPrévisionnel: achèvementData.value.dateAchèvementPrévisionnel,
        dateAbandonAccordé: abandon && abandon.demande.accord?.accordéLe.formatter(),
        dateRecoursAccordé: recours && recours.demande.accord?.accordéLe.formatter(),
        dateMiseEnService: raccordement.value
          ? raccordement.value.dateMiseEnService?.formatter()
          : undefined,
        dateAchèvementRéel: achèvementData.value.dateAchèvementRéel,
      });

      const abandonAlert = getAbandonAlert(
        !!abandon?.statut.estEnCours(),
        !!abandon?.statut.estAccordé(),
        rôle,
        identifiantProjet.formatter(),
      );

      const achèvementAlert = getAchèvementAlert(achèvementData.value.estAchevé, rôle);

      const garantiesFinancièresData = await getGarantiesFinancièresData({
        identifiantProjet,
        rôle,
        estSoumisAuxGarantiesFinancières:
          !!cahierDesChargesData.value?.estSoumisAuxGarantiesFinancières,
      });

      return (
        <TableauDeBordPage
          frise={{ étapes, doitAfficherAttestationDésignation: !!lauréat.attestationDésignation }}
          raccordement={raccordement}
          identifiantProjet={identifiantProjet.formatter()}
          cahierDesCharges={cahierDesChargesData}
          abandonAlert={abandonAlert}
          achèvementAlert={achèvementAlert}
          garantiesFinancièresData={garantiesFinancièresData}
          achèvementData={achèvementData}
        />
      );
    }),
  );
}

const getAbandon = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
    type: 'Lauréat.Abandon.Query.ConsulterAbandon',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(abandon)) {
    return undefined;
  }

  const { statut } = abandon;

  if (statut.estEnCours() || statut.estRejeté() || statut.estAccordé()) {
    return abandon;
  }
};

export const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if (Option.isNone(recours)) {
    return undefined;
  }

  return recours;
};
