import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  ModifierPropositionTechniqueEtFinancièrePage,
  ModifierPropositionTechniqueEtFinancièrePageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierPropositionTechniqueEtFinancière/ModifierPropositionTechniqueEtFinancière.page';

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
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const referenceDossierRaccordement = decodeParameter(reference);

    const dossierRaccordement = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>(
      {
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      },
    );

    const props: ModifierPropositionTechniqueEtFinancièrePageProps = {
      identifiantProjet: identifiantProjet.formatter(),
      raccordement: {
        reference: referenceDossierRaccordement,
        propositionTechniqueEtFinancière: {
          dateSignature:
            dossierRaccordement.propositionTechniqueEtFinancière!.dateSignature.formatter(),
          propositionTechniqueEtFinancièreSignée:
            dossierRaccordement.propositionTechniqueEtFinancière!.propositionTechniqueEtFinancièreSignée.formatter(),
        },
      },
    };

    return <ModifierPropositionTechniqueEtFinancièrePage {...props} />;
  });
}
