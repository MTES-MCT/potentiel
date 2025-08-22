import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatSansAbandon } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import {
  ModifierPropositionTechniqueEtFinancièrePage,
  type ModifierPropositionTechniqueEtFinancièrePageProps,
} from './ModifierPropositionTechniqueEtFinancière.page';

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

    await récupérerLauréatSansAbandon(identifiantProjet.formatter());

    const referenceDossierRaccordement = decodeParameter(reference);

    const dossierRaccordement =
      await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: referenceDossierRaccordement,
        },
      });

    if (Option.isNone(dossierRaccordement)) {
      return notFound();
    }

    const props = mapToProps({ identifiantProjet, dossierRaccordement });

    return (
      <ModifierPropositionTechniqueEtFinancièrePage
        identifiantProjet={props.identifiantProjet}
        raccordement={props.raccordement}
      />
    );
  });
}

type MapToProps = (params: {
  identifiantProjet: IdentifiantProjet.ValueType;
  dossierRaccordement: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
}) => ModifierPropositionTechniqueEtFinancièrePageProps;

const mapToProps: MapToProps = ({ identifiantProjet, dossierRaccordement }) => ({
  identifiantProjet: identifiantProjet.formatter(),
  raccordement: {
    reference: dossierRaccordement.référence.formatter(),
    propositionTechniqueEtFinancière: {
      dateSignature:
        dossierRaccordement.propositionTechniqueEtFinancière!.dateSignature.formatter(),
      propositionTechniqueEtFinancièreSignée:
        dossierRaccordement.propositionTechniqueEtFinancière!.propositionTechniqueEtFinancièreSignée.formatter(),
    },
  },
});
