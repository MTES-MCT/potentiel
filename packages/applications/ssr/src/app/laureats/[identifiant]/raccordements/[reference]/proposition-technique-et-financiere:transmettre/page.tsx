import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Raccordement } from '@potentiel-domain/reseau';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettrePropositionTechniqueEtFinancièrePage,
  TransmettrePropositionTechniqueEtFinancièreProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettrePropositionTechniqueEtFinancière/TransmettrePropositionTechniqueEtFinancière.page';
import { mapToProjetBannerProps } from '@/utils/mapToProjetBannerProps';

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
    const identifiantProjet = decodeParameter(identifiant);
    const referenceDossierRaccordement = decodeParameter(reference);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: referenceDossierRaccordement,
      },
    });

    const props: TransmettrePropositionTechniqueEtFinancièreProps = {
      projet: mapToProjetBannerProps({
        identifiantProjet,
        projet: candidature,
      }),
      referenceDossierRaccordement,
    };

    return <TransmettrePropositionTechniqueEtFinancièrePage {...props} />;
  });
}
