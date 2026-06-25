import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers/vérifierQueLeCahierDesChargesPermetUnChangement';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { EnregistrerChangementProducteurPage } from './EnregistrerChangementProducteur.page';

export const metadata: Metadata = { title: 'Changer le producteur' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Producteur.EnregistrerChangementProducteurUseCase>(
        'Lauréat.Producteur.UseCase.EnregistrerChangement',
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

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        producteurActuel.identifiantProjet,
        'information-enregistrée',
        'producteur',
      );

      return (
        <EnregistrerChangementProducteurPage
          identifiantProjet={mapToPlainObject(producteurActuel.identifiantProjet)}
          producteur={producteurActuel.producteur}
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
