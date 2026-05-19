import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréatSansAbandon } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ModifierPropositionTechniqueEtFinancièrePage,
  type ModifierPropositionTechniqueEtFinancièrePageProps,
} from './ModifierPropositionTechniqueEtFinancière.page';
import { getLauréat } from '@/app/laureats/[identifiant]/_helpers';
import { vérifierSiModificationRaccordementPossible } from '../../../../(raccordement-du-projet)/(détails)/_helpers';
import { Routes } from '@potentiel-applications/routes';

type PageProps = {
  params: Promise<{
    identifiant: string;
    reference: string;
  }>;
};

export const metadata: Metadata = { title: 'Modifier la proposition technique et financière' };

export default async function Page(props0: PageProps) {
  const params = await props0.params;

  const { identifiant, reference } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierPropositionTechniqueEtFinancièreUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierPropositionTechniqueEtFinancière',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréat(identifiantProjet.formatter());
      const peutModifierRaccordement = vérifierSiModificationRaccordementPossible(lauréat);
      if (!peutModifierRaccordement) {
        return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter()));
      }

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

      if (!dossierRaccordement.propositionTechniqueEtFinancière) {
        return notFound();
      }

      const props = mapToProps({
        identifiantProjet,
        référence: dossierRaccordement.référence,
        propositionTechniqueEtFinancière: dossierRaccordement.propositionTechniqueEtFinancière,
      });

      return (
        <ModifierPropositionTechniqueEtFinancièrePage
          identifiantProjet={props.identifiantProjet}
          raccordement={props.raccordement}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  identifiantProjet: IdentifiantProjet.ValueType;
  référence: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['référence'];
  propositionTechniqueEtFinancière: NonNullable<
    Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['propositionTechniqueEtFinancière']
  >;
}) => ModifierPropositionTechniqueEtFinancièrePageProps;

const mapToProps: MapToProps = ({
  identifiantProjet,
  référence,
  propositionTechniqueEtFinancière,
}) => ({
  identifiantProjet: identifiantProjet.formatter(),
  raccordement: {
    reference: référence.formatter(),
    propositionTechniqueEtFinancière: {
      dateSignature: propositionTechniqueEtFinancière.dateSignature.formatter(),
      propositionTechniqueEtFinancièreSignée:
        propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
    },
  },
});
