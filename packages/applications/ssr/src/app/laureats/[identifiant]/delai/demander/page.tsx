import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import {
  getLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';
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

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        lauréat.identifiantProjet,
        'demande',
        'délai',
      );

      const demandeEnCours = (
        await mediator.send<Lauréat.Délai.ListerDemandeDélaiQuery>({
          type: 'Lauréat.Délai.Query.ListerDemandeDélai',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
            range: { startPosition: 0, endPosition: 1 },
            utilisateur: utilisateur.identifiantUtilisateur.formatter(),
            statuts: Lauréat.Délai.StatutDemandeDélai.statutsEnCours,
          },
        })
      ).items[0];

      if (demandeEnCours) {
        return (
          <DemandeEnCoursPage
            title="Demande de délai"
            href={Routes.Délai.détail(
              identifiantProjet.formatter(),
              demandeEnCours.demandéLe.formatter(),
            )}
          />
        );
      }

      return (
        <DemanderDélaiPage
          identifiantProjet={identifiantProjet.formatter()}
          dateAchèvementPrévisionnelActuelle={mapToPlainObject(
            achèvement.dateAchèvementPrévisionnel,
          )}
        />
      );
    }),
  );
}
