import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { InvalidOperationError } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { EnregistrerAttestationConformitéPage } from './EnregistrerAttestationConformité.page';

export const metadata: Metadata = { title: `Enregistrer l'attestation de conformité` };

export default async function Page({ params }: IdentifiantParameter) {
  const { identifiant } = await params;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Achèvement.EnregistrerAttestationConformitéUseCase>(
        'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
      );

      const identifiantProjet = decodeParameter(identifiant);

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: { identifiantProjetValue: identifiantProjet },
      });

      if (Option.isNone(achèvement) || !achèvement.estAchevé) {
        throw new InvalidOperationError("Le projet n'est pas achevé");
      }

      return <EnregistrerAttestationConformitéPage identifiantProjet={identifiantProjet} />;
    }),
  );
}
