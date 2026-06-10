import type { Metadata } from 'next';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { TransmettreDateAchèvementPage } from './TransmettreDateAchèvement.page';

export const metadata: Metadata = { title: `Transmettre la date d'achèvement` };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>(
        'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
      );

      const projet = await récupérerLauréatNonAbandonné(
        IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant)).formatter(),
      );

      return (
        <TransmettreDateAchèvementPage
          identifiantProjet={projet.identifiantProjet.formatter()}
          lauréatNotifiéLe={projet.notifiéLe.formatter()}
        />
      );
    }),
  );
}
