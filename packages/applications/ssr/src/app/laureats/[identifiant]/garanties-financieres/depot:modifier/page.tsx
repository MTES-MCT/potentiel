import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';
import { featureFlags } from '@potentiel-applications/feature-flags';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ModifierDépôtEnCoursGarantiesFinancièresPage,
  ModifierDépôtEnCoursGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/dépôt/modifier/ModifierDépôtEnCoursGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

export const metadata: Metadata = {
  title: 'Modifier dépôt des garanties financières en cours - Potentiel',
  description: `Formulaire de modification d'un dépôt de garanties financières en cours de traitement`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!featureFlags.SHOW_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet },
      });

      const projet = { ...candidature, identifiantProjet };

      if (
        !projetSoumisAuxGarantiesFinancières({
          appelOffre: candidature.appelOffre,
          famille: candidature.famille,
        })
      ) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
      }

      const garantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const dépôtEnCours = garantiesFinancières.dépôts.find((dépôt) => dépôt.statut.estEnCours());

      if (!dépôtEnCours) {
        return notFound();
      }

      const props: ModifierDépôtEnCoursGarantiesFinancièresProps = {
        projet,
        typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
        dépôtEnCours: {
          type: dépôtEnCours.type.type,
          statut: dépôtEnCours.statut.statut,
          dateÉchéance: dépôtEnCours.dateÉchéance?.formatter(),
          dateConstitution: dépôtEnCours.dateConstitution.formatter(),
          soumisLe: dépôtEnCours.soumisLe.formatter(),
          attestation: dépôtEnCours.attestation.formatter(),
          dernièreMiseÀJour: {
            date: dépôtEnCours.dernièreMiseÀJour.date.formatter(),
            par: dépôtEnCours.dernièreMiseÀJour.par.formatter(),
          },
        },
        showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
        actions: utilisateur.role.estÉgaleÀ(Role.porteur)
          ? ['supprimer']
          : utilisateur.role.estÉgaleÀ(Role.dreal)
          ? ['valider']
          : [],
      };

      return <ModifierDépôtEnCoursGarantiesFinancièresPage {...props} />;
    }),
  );
}
