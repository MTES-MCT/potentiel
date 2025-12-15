import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';

import { getLauréatInfos } from '../_helpers/getLauréat';

import { TableauDeBordPage } from './TableauDeBord.page';
import { getAbandonAlert } from './_helpers/getAbandonAlert';
import { getAchèvementAlert } from './_helpers/getAchèvementAlert';
import { getAchèvementData } from './_helpers/getAchèvementData';
import { getGarantiesFinancièresData } from './_helpers/getGarantiesFinancièresData';
import { getRaccordementData } from './_helpers/getRaccordementData';
import { getÉtapesData } from './_helpers/getÉtapesData';
import { checkFeatureFlag } from './_helpers/checkFeatureFlag';
import { getAlertesRaccordement } from './_helpers/getRaccordementAlert';

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

      checkFeatureFlag(identifiantProjet, searchParams);

      const lauréat = await getLauréatInfos({ identifiantProjet: identifiantProjet.formatter() });

      const abandon = await getAbandon(identifiantProjet);

      const achèvementData = await getAchèvementData({ identifiantProjet, rôle });

      const recours = await getRecours(identifiantProjet);

      const raccordement = await getRaccordementData({
        role: rôle,
        identifiantProjet,
        estAbandonné: !!abandon?.estAbandonné,
        aUnAbandonEnCours: !!abandon?.demandeEnCours,
      });

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      const raccordementAlerts = getAlertesRaccordement({
        CDC2022Choisi: cahierDesCharges.cahierDesChargesModificatif?.paruLe === '30/08/2022',
        raccordement,
      });

      const étapes = getÉtapesData({
        dateNotification: lauréat.notifiéLe.formatter(),
        dateAchèvementPrévisionnel: achèvementData.value.dateAchèvementPrévisionnel,
        abandon:
          abandon && abandon.accordéLe
            ? {
                dateAbandonAccordé: abandon.accordéLe.formatter(),
                dateDemandeAbandon: abandon.demandéLe.formatter(),
              }
            : undefined,
        dateRecoursAccordé: recours && recours.demande.accord?.accordéLe.formatter(),
        dateMiseEnService: raccordement.value
          ? raccordement.value.dateMiseEnService?.formatter()
          : undefined,
        dateAchèvementRéel: achèvementData.value.dateAchèvementRéel,
      });

      const abandonAlert = getAbandonAlert({
        estAbandonné: !!abandon?.estAbandonné,
        rôle,
        identifiantProjet: identifiantProjet.formatter(),
        demandeEnCours: abandon?.demandeEnCours
          ? {
              dateDemandeEnCours: abandon.demandéLe.formatter(),
            }
          : undefined,
      });

      const achèvementAlert = getAchèvementAlert(achèvementData.value.estAchevé, rôle);

      const garantiesFinancièresData = await getGarantiesFinancièresData({
        identifiantProjet,
        rôle,
        estSoumisAuxGarantiesFinancières: cahierDesCharges.estSoumisAuxGarantiesFinancières(),
      });

      return (
        <TableauDeBordPage
          frise={{ étapes, doitAfficherAttestationDésignation: !!lauréat.attestationDésignation }}
          raccordement={raccordement}
          identifiantProjet={identifiantProjet.formatter()}
          garantiesFinancièresData={garantiesFinancièresData}
          achèvementData={achèvementData}
          raccordementAlerts={raccordementAlerts}
          abandonAlert={abandonAlert}
          achèvementAlert={achèvementAlert}
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

  return Option.isNone(abandon) ? undefined : abandon;
};

const getRecours = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<Éliminé.Recours.ConsulterRecoursReadModel | undefined> => {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  return Option.isNone(recours) ? undefined : recours;
};
