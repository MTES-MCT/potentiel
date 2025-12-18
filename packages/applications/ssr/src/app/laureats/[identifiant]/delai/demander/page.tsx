import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  récupérerLauréatSansAbandon,
  vérifierQueLeCahierDesChargesPermetUnChangement,
} from '@/app/_helpers';

import { withUtilisateur } from '../../../../../utils/withUtilisateur';
import { DemandeEnCoursPage } from '../../(détails)/(components)/DemandeEnCours.page';

import { DemanderDélaiPage } from './DemanderDélai.page';

export const metadata: Metadata = {
  title: 'Demander un délai de force majeure - Potentiel',
  description: 'Formulaire de demande de délai',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await récupérerLauréatSansAbandon(identifiantProjet.formatter());

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
