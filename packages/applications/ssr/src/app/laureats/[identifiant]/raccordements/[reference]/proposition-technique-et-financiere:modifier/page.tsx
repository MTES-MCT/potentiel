import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Raccordement } from '@potentiel-domain/reseau';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  ModifierPropositionTechniqueEtFinancièrePage,
  ModifierPropositionTechniqueEtFinancièrePageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierPropositionTechniqueEtFinancière/ModifierPropositionTechniqueEtFinancière.page';
import { formatDateForInput } from '@/utils/formatDateForInput';
import { displayDate } from '@/utils/displayDate';

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export const metadata: Metadata = {
  title: 'Modifier la proposition technique et financière - Potentiel',
  description: 'Modifier la proposition technique et financière',
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

    const dossierRaccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>(
      {
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      },
    );

    const props: ModifierPropositionTechniqueEtFinancièrePageProps = {
      projet: {
        ...candidature,
        dateDésignation: displayDate(candidature.dateDésignation),
        identifiantProjet,
      },
      raccordement: {
        reference: referenceDossierRaccordement,
        propositionTechniqueEtFinancière: {
          dateSignature: formatDateForInput(
            dossierRaccordement.propositionTechniqueEtFinancière!.dateSignature.formatter(),
          ),
          propositionTechniqueEtFinancièreSignée:
            dossierRaccordement.propositionTechniqueEtFinancière!.propositionTechniqueEtFinancièreSignée.formatter(),
        },
      },
    };

    return <ModifierPropositionTechniqueEtFinancièrePage {...props} />;
  });
}
