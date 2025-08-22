import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { TransmettrePropositionTechniqueEtFinancièrePage } from './TransmettrePropositionTechniqueEtFinancière.page';

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export const metadata: Metadata = {
  title: 'Transmettre la proposition technique et financière - Potentiel',
  description: 'Transmettre la proposition technique et financière',
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(identifiant),
    ).formatter();

    await récupérerLauréatNonAbandonné(identifiantProjet);

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
  });
}
