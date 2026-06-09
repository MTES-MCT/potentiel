import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { CorrigerNuméroIdentificationPage } from './CorrigerNuméroIdentification.page';

export const metadata: Metadata = { title: "Corriger le numéro d'identification" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Producteur.CorrigerNuméroIdentificationUseCase>(
        'Lauréat.Producteur.UseCase.CorrigerNuméroIdentification',
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
        <CorrigerNuméroIdentificationPage
          identifiantProjet={mapToPlainObject(identifiantProjet)}
          numéroIdentification={
            producteurActuel.numéroIdentification
              ? mapToPlainObject(producteurActuel.numéroIdentification)
              : undefined
          }
        />
      );
    }),
  );
}
