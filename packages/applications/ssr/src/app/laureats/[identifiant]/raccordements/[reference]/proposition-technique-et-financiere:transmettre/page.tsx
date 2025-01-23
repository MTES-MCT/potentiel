import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { TransmettrePropositionTechniqueEtFinancièrePage } from '@/components/pages/réseau/raccordement/transmettre/transmettrePropositionTechniqueEtFinancière/TransmettrePropositionTechniqueEtFinancière.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

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

    const projet = await récupérerProjet(identifiantProjet);
    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        "Vous ne pouvez pas transmettre la proposition technique et financière d'un dossier de raccordement pour un projet éliminé ou abandonné",
    });

    const referenceDossierRaccordement = decodeParameter(reference);

    const dossierRaccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>(
      {
        type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      },
    );

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
