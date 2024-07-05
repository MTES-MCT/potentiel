import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Raccordement } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  TransmettrePropositionTechniqueEtFinancièrePage,
  TransmettrePropositionTechniqueEtFinancièreProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettrePropositionTechniqueEtFinancière/TransmettrePropositionTechniqueEtFinancière.page';

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
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const referenceDossierRaccordement = decodeParameter(reference);

    await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
        référenceDossierRaccordementValue: referenceDossierRaccordement,
      },
    });

    const props: TransmettrePropositionTechniqueEtFinancièreProps = {
      identifiantProjet: identifiantProjet.formatter(),
      referenceDossierRaccordement,
    };

    return <TransmettrePropositionTechniqueEtFinancièrePage {...props} />;
  });
}
