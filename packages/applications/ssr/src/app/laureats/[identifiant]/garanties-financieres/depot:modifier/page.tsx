import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  ModifierDépôtEnCoursGarantiesFinancièresPage,
  ModifierDépôtEnCoursGarantiesFinancièresPageProps,
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
      const { appelOffre, famille, période } =
        IdentifiantProjet.convertirEnValueType(identifiantProjet);

      const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
        appelOffre,
        famille,
        periode: période,
      });

      if (!soumisAuxGarantiesFinancières) {
        return <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjet} />;
      }

      const dépôt =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      if (Option.isNone(dépôt)) {
        return notFound();
      }

      const props = mapToProps({ dépôt, utilisateur });

      return (
        <ModifierDépôtEnCoursGarantiesFinancièresPage
          identifiantProjet={identifiantProjet}
          typesGarantiesFinancières={props.typesGarantiesFinancières}
          dépôtEnCours={props.dépôtEnCours}
          showWarning={props.showWarning}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  utilisateur: Utilisateur.ValueType;
  dépôt: GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresReadModel;
}) => ModifierDépôtEnCoursGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({ utilisateur, dépôt }) => ({
  identifiantProjet: dépôt.identifiantProjet.formatter(),
  typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
  dépôtEnCours: {
    typeGarantiesFinancières: dépôt.dépôt.type.type,
    dateÉchéance: dépôt.dépôt.dateÉchéance?.formatter(),
    dateConstitution: dépôt.dépôt.dateConstitution.formatter(),
    attestation: dépôt.dépôt.attestation.formatter(),
  },
  showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
});
