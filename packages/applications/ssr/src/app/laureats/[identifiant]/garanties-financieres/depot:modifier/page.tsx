import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

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
          periode: candidature.période,
        })
      ) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
      }

      const dépôtGarantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      if (Option.isNone(dépôtGarantiesFinancières)) {
        return notFound();
      }

      const props = mapToProps({ ...dépôtGarantiesFinancières, projet, utilisateur });

      return <ModifierDépôtEnCoursGarantiesFinancièresPage {...props} />;
    }),
  );
}

const mapToProps = ({
  projet,
  dépôt: { type, dateÉchéance, dateConstitution, attestation },
  utilisateur,
}: GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel & {
  projet: ConsulterCandidatureReadModel & { identifiantProjet: string };
  utilisateur: Utilisateur.ValueType;
}): ModifierDépôtEnCoursGarantiesFinancièresProps => ({
  projet,
  typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
  dépôtEnCours: {
    typeGarantiesFinancières: type.type,
    dateÉchéance: dateÉchéance?.formatter(),
    dateConstitution: dateConstitution.formatter(),
    attestation: attestation.formatter(),
  },
  showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
});
