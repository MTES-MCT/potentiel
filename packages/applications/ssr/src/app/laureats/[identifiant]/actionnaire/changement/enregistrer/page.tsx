import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { vérifierQueLeCahierDesChargesPermetUnChangement } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { EnregistrerChangementActionnairePage } from './EnregistrerChangementActionnaire.page';

export const metadata: Metadata = { title: "Enregistrer un changement d'actionnaire(s)" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Actionnaire.EnregistrerChangementActionnaireUseCase>(
        'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const actionnaireActuel = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actionnaireActuel)) {
        return notFound();
      }

      await vérifierQueLeCahierDesChargesPermetUnChangement(
        actionnaireActuel.identifiantProjet,
        'information-enregistrée',
        'actionnaire',
      );

      return (
        <EnregistrerChangementActionnairePage
          identifiantProjet={mapToPlainObject(actionnaireActuel.identifiantProjet)}
          actionnaire={actionnaireActuel.actionnaire}
        />
      );
    }),
  );
}
