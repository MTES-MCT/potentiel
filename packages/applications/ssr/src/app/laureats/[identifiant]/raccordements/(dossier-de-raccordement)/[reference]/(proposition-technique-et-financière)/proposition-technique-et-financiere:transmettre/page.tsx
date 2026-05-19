import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { TransmettrePropositionTechniqueEtFinancièrePage } from './TransmettrePropositionTechniqueEtFinancière.page';
import { getLauréat } from '@/app/laureats/[identifiant]/_helpers';
import { vérifierSiModificationRaccordementPossible } from '../../../../(raccordement-du-projet)/(détails)/_helpers';
import { Routes } from '@potentiel-applications/routes';

type PageProps = {
  params: Promise<{
    identifiant: string;
    reference: string;
  }>;
};

export const metadata: Metadata = { title: 'Transmettre la proposition technique et financière' };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, reference } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.TransmettrePropositionTechniqueEtFinancièreUseCase>(
        'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();

      const lauréat = await getLauréat(identifiantProjet);
      const peutModifierRaccordement = vérifierSiModificationRaccordementPossible(lauréat);
      if (!peutModifierRaccordement) {
        return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet));
      }

      const referenceDossierRaccordement = decodeParameter(reference);

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
            référenceDossierRaccordementValue: referenceDossierRaccordement,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      return (
        <TransmettrePropositionTechniqueEtFinancièrePage
          identifiantProjet={identifiantProjet}
          referenceDossierRaccordement={referenceDossierRaccordement}
        />
      );
    }),
  );
}
