import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  ModifierPropositionTechniqueEtFinancièrePage,
  ModifierPropositionTechniqueEtFinancièrePageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierPropositionTechniqueEtFinancière/ModifierPropositionTechniqueEtFinancière.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

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

    const projet = await récupérerProjet(identifiantProjet.formatter());
    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        "Vous ne pouvez pas modifier la proposition technique et financière d'un dossier de raccordement pour un projet éliminé ou abandonné",
    });

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

    if (Option.isNone(dossierRaccordement)) {
      return notFound();
    }

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
