import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges, getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAchèvement, getGarantiesFinancières, getOptionalAbandon } from '../../_helpers';
import { getMainlevéeGarantiesFinancières } from '../../_helpers/getMainlevéeGarantiesFinancières';
import { DétailsMainlevéePage, type DétailsMainlevéePageProps } from './DétailsMainlevée.page';

export const metadata: Metadata = { title: 'Mainlevée des garanties financières' };

export default async function Page({ params }: IdentifiantParameter) {
  const { identifiant } = await params;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const lauréat = await getLauréatInfos(
        IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant)).formatter(),
      );

      const { actuelles: garantiesFinancières } = await getGarantiesFinancières(
        lauréat.identifiantProjet.formatter(),
      );
      if (!garantiesFinancières) {
        return notFound();
      }
      const mainlevée = await getMainlevéeGarantiesFinancières(
        lauréat.identifiantProjet.formatter(),
      );

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

      const achèvement = lauréat.statut.estAchevé()
        ? await getAchèvement(lauréat.identifiantProjet.formatter())
        : undefined;

      const abandon = lauréat.statut.estAbandonné()
        ? await getOptionalAbandon(lauréat.identifiantProjet.formatter())
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

      if (!mainlevée && mainlevéesRejetées.items.length === 0) {
        return notFound();
      }

      const actions: DétailsMainlevéePageProps['actions'] = [];
      if (mainlevée?.statut.estEnInstruction()) {
        actions.push('garantiesFinancières.mainlevée.annuler');
        actions.push('garantiesFinancières.mainlevée.accorder');
        actions.push('garantiesFinancières.mainlevée.rejeter');
      }
      if (mainlevée?.statut.estDemandé()) {
        actions.push('garantiesFinancières.mainlevée.annuler');
        actions.push('garantiesFinancières.mainlevée.démarrerInstruction');
        actions.push('garantiesFinancières.mainlevée.accorder');
        actions.push('garantiesFinancières.mainlevée.rejeter');
      }

      return (
        <DétailsMainlevéePage
          identifiantProjet={lauréat.identifiantProjet}
          mainlevée={mainlevée ? mapToPlainObject(mainlevée) : undefined}
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
