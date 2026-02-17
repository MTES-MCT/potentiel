import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandeEnCoursPage } from '@/components/atoms/menu/DemandeEnCours.page';

import { ModifierReprésentantLégalPage } from './ModifierReprésentantLégal.page';

export const metadata: Metadata = {
  title: 'Modifier le représentant légal du projet - Potentiel',
  description: "Formulaire de modification du représentant légal d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.ReprésentantLégal.ModifierReprésentantLégalUseCase>(
        'Lauréat.ReprésentantLégal.UseCase.ModifierReprésentantLégal',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const représentantLégal =
        await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>({
          type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(représentantLégal)) {
        return notFound();
      }

      if (représentantLégal.demandeEnCours) {
        return (
          <DemandeEnCoursPage
            title="Demande de changement de représentant légal"
            href={Routes.ReprésentantLégal.changement.détails(
              identifiantProjet.formatter(),
              représentantLégal.demandeEnCours.demandéLe,
            )}
          />
        );
      }

      return (
        <ModifierReprésentantLégalPage
          identifiantProjet={mapToPlainObject(représentantLégal.identifiantProjet)}
          nomReprésentantLégal={représentantLégal.nomReprésentantLégal}
          typeReprésentantLégal={mapToPlainObject(représentantLégal.typeReprésentantLégal)}
        />
      );
    }),
  );
}
