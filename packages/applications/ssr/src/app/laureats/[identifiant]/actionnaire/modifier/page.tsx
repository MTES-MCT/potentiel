import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ModifierActionnairePage } from '@/components/pages/actionnaire/modifier/ModifierActionnaire.page';

export const metadata: Metadata = {
  title: "Modifier l'actionnaire du projet - Potentiel",
  description: "Formulaire de modification de l'actionnaire d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actionnaireActuel = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actionnaireActuel)) {
        return notFound();
      }

      return (
        <ModifierActionnairePage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          actionnaire={actionnaireActuel.actionnaire}
          hasToUploadDocument={utilisateur.role.estÉgaleÀ(Role.porteur)}
        />
      );
    }),
  );
}
