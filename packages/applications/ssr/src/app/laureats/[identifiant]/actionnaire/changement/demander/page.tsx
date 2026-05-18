import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { DemanderChangementActionnairePage } from './DemanderChangementActionnaire.page';

export const metadata: Metadata = { title: "Demander un changement d'actionnaire(s)" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Actionnaire.DemanderChangementUseCase>(
        'Lauréat.Actionnaire.UseCase.DemanderChangement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actionnaire)) {
        return notFound();
      }

      if (actionnaire.aUneDemandeEnCours && actionnaire.dateDernièreDemande) {
        return (
          <DemandeEnCoursPage
            title="Demande de changement d'actionnaire(s)"
            href={Routes.Actionnaire.changement.détails(
              identifiantProjet.formatter(),
              actionnaire.dateDernièreDemande.formatter(),
            )}
          />
        );
      }

      return (
        <DemanderChangementActionnairePage
          identifiantProjet={mapToPlainObject(actionnaire.identifiantProjet)}
          actionnaire={actionnaire.actionnaire}
        />
      );
    }),
  );
}
