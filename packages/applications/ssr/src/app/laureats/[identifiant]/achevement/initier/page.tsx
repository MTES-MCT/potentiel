import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getLauréatNonAchevé } from '@/app/_helpers/lauréat';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { InitierAchèvementPage } from './initierAchèvement.page';

export const metadata: Metadata = { title: `Initier l'achèvement` };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Achèvement.InitierAchèvementUseCase>(
        'Lauréat.Achèvement.UseCase.InitierAchèvement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();

      await getLauréatNonAchevé(identifiantProjet);

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: { identifiantProjetValue: identifiantProjet },
      });

      if (Option.isNone(achèvement) || achèvement.estAchevé) {
        return notFound();
      }

      return <InitierAchèvementPage identifiantProjet={identifiantProjet} />;
    }),
  );
}
