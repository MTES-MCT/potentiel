import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';

import { ModifierActionnairePage } from './ModifierActionnaire.page';

export const metadata: Metadata = {
  title: "Changement d'actionnaire(s) du projet - Potentiel",
  description: "Formulaire de changement d'actionnaire(s) d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Actionnaire.ModifierActionnaireUseCase>(
        'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
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
            title="Demande de changement d'actionnaire"
            href={Routes.Actionnaire.changement.détails(
              identifiantProjet.formatter(),
              actionnaire.dateDernièreDemande.formatter(),
            )}
          />
        );
      }

      return (
        <ModifierActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          actionnaire={actionnaire.actionnaire}
        />
      );
    }),
  );
}
