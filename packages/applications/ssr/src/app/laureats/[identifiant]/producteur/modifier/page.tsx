import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierProducteurPage } from './ModifierProducteur.page';

export const metadata: Metadata = {
  title: 'Changement de producteur du projet - Potentiel',
  description: "Formulaire de changement de producteur d'un projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Producteur.ModifierProducteurUseCase>(
        'Lauréat.Producteur.UseCase.ModifierProducteur',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const producteurActuel = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
        type: 'Lauréat.Producteur.Query.ConsulterProducteur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(producteurActuel)) {
        return notFound();
      }

      return (
        <ModifierProducteurPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          producteur={producteurActuel.producteur}
        />
      );
    }),
  );
}
