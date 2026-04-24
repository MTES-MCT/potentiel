import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ModifierAttestationConformitéPage } from './ModifierAttestationConformité.page';

export const metadata: Metadata = {
  title: `Transmettre l'attestation de conformité - Potentiel`,
  description: `Formulaire de transmission de l'attestation de conformité du projet et de la preuve de sa transmission au Cocontractant`,
};

export default async function Page({ params }: IdentifiantParameter) {
  const { identifiant } = await params;
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Achèvement.ModifierAttestationConformitéUseCase>(
        'Lauréat.Achèvement.UseCase.ModifierAttestationConformité',
      );
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.DemanderMainlevéeGarantiesFinancièresUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.DemanderMainlevée',
      );

      const identifiantProjet = decodeParameter(identifiant);

      const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
        type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(achèvement) || !achèvement.estAchevé) {
        throw new InvalidOperationError("Le projet n'est pas achevé");
      }

      return <ModifierAttestationConformitéPage identifiantProjet={identifiantProjet} />;
    }),
  );
}
