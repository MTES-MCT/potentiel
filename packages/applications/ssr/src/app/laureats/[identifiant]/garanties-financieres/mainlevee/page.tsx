import { notFound } from 'next/navigation';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { getCahierDesCharges, récupérerLauréat } from '@/app/_helpers';

import { getMainlevéeGarantiesFinancières } from '../../_helpers/getMainlevéeGarantiesFinancières';
import { getAbandonInfos, getAchèvement, getGarantiesFinancières } from '../../_helpers';

import { DétailsMainlevéePage, DétailsMainlevéePageProps } from './DétailsMainlevée.page';

export default async function Page({ params }: IdentifiantParameter) {
  const { identifiant } = await params;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const lauréat = await récupérerLauréat(identifiantProjet);

      const mainlevée = await getMainlevéeGarantiesFinancières(
        lauréat.identifiantProjet.formatter(),
      );

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

      const { actuelles: garantiesFinancières } = await getGarantiesFinancières(
        lauréat.identifiantProjet.formatter(),
      );

      if (!mainlevée || !garantiesFinancières) {
        return notFound();
      }

      const achèvement = lauréat.statut.estAchevé()
        ? await getAchèvement(lauréat.identifiantProjet.formatter())
        : undefined;

      const abandon = lauréat.statut.estAbandonné()
        ? await getAbandonInfos(lauréat.identifiantProjet.formatter())
        : undefined;

      const mainlevéesRejetées =
        await mediator.send<Lauréat.GarantiesFinancières.ListerMainlevéesQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ListerMainlevées',
          data: {
            identifiantProjet: lauréat.identifiantProjet.formatter(),
            identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            statut: [
              Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
            ],
          },
        });

      const actions: DétailsMainlevéePageProps['actions'] = [];
      if (mainlevée.statut.estDemandé()) {
        actions.push('garantiesFinancières.mainlevée.annuler');
        actions.push('garantiesFinancières.mainlevée.démarrerInstruction');
      }
      if (!mainlevée.statut.estAccordé() && !mainlevée.statut.estRejeté()) {
        actions.push('garantiesFinancières.mainlevée.accorder');
        actions.push('garantiesFinancières.mainlevée.rejeter');
      }

      return (
        <DétailsMainlevéePage
          identifiantProjet={mainlevée.identifiantProjet}
          mainlevée={mapToPlainObject(mainlevée)}
          actions={actions.filter((action) => utilisateur.rôle.aLaPermission(action))}
          urlAppelOffre={cahierDesCharges.appelOffre.cahiersDesChargesUrl}
          garantiesFinancières={mapToPlainObject(garantiesFinancières)}
          achèvement={achèvement ? mapToPlainObject(achèvement) : undefined}
          abandon={abandon ? mapToPlainObject(abandon) : undefined}
          mainlevéesRejetées={mainlevéesRejetées.items.map(mapToPlainObject)}
        />
      );
    }),
  );
}
