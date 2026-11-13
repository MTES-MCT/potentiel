import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import {
  getLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';
import { isFeatureEnabled } from '@/app/_helpers/getFeatureFlag';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemanderDélaiPage } from './DemanderDélai.page';

export const metadata: Metadata = { title: 'Demander un délai de force majeure' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Délai.DemanderDélaiUseCase>(
        'Lauréat.Délai.UseCase.DemanderDélai',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatSansAbandon(identifiantProjet.formatter());

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        lauréat.identifiantProjet,
        'demande',
        'délai',
      );

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(achèvement)) {
        return notFound();
      }

      const règlesChangement = (await vérifierQueLeCahierDesChargesPermetUnChangement(
        lauréat.identifiantProjet,
        'demande',
        'délai',
      )) as AppelOffre.RèglesMiseÀJourPorteur['délai'];

      const motifsProposésParLeCahierDesCharges = isFeatureEnabled('delai-phase-essai')
        ? règlesChangement.demande && Object.keys(règlesChangement.motifs)
        : ['prolongation-délai-achèvement'];

      if (!motifsProposésParLeCahierDesCharges?.length) {
        return notFound();
      }

      const demandesEnCours = await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
        type: 'Lauréat.Délai.Query.ListerDemandeDélai',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
          range: { startPosition: 0, endPosition: 1 },
          utilisateur: utilisateur.identifiantUtilisateur.formatter(),
          statuts: Lauréat.Délai.StatutDemandeDélai.statutsEnCours,
        },
      });

      const motifsDisponibles = motifsProposésParLeCahierDesCharges
        ?.map((m) => Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(m))
        .filter((motif) => !demandesEnCours.items.some((d) => d.motif.estÉgaleÀ(motif)))
        .map((m) => m.motif);

      return motifsDisponibles.length ? (
        <DemanderDélaiPage
          identifiantProjet={identifiantProjet.formatter()}
          dateAchèvementPrévisionnelActuelle={mapToPlainObject(
            achèvement.dateAchèvementPrévisionnel,
          )}
          motifsDisponibles={motifsDisponibles}
        />
      ) : (
        <DemandeEnCoursPage
          title="Demande de délai"
          href={
            demandesEnCours.items.length === 1
              ? Routes.Délai.détail(
                  identifiantProjet.formatter(),
                  demandesEnCours.items[0].demandéLe.formatter(),
                )
              : Routes.Délai.lister({ statut: ['demandé', 'en-instruction'] })
          }
          hrefLabel={
            demandesEnCours.items.length === 1
              ? 'Voir ma demande de délai en cours'
              : 'Voir mes demandes de délai en cours'
          }
        />
      );
    }),
  );
}
