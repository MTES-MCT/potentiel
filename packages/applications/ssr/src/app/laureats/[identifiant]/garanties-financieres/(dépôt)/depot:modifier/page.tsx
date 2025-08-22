import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Role, type Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/app/laureats/[identifiant]/garanties-financieres/typesGarantiesFinancièresPourFormulaire';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { projetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '../../ProjetNonSoumisAuxGarantiesFinancières.page';
import {
  ModifierDépôtGarantiesFinancièresPage,
  type ModifierDépôtGarantiesFinancièresPageProps,
} from './ModifierDépôtGarantiesFinancières.page';

export const metadata: Metadata = {
  title: 'Modifier dépôt des garanties financières en cours - Potentiel',
  description: `Formulaire de modification d'un dépôt de garanties financières en cours de traitement`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const soumisAuxGarantiesFinancières =
        await projetSoumisAuxGarantiesFinancières(identifiantProjet);

      if (!soumisAuxGarantiesFinancières) {
        return (
          <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
        );
      }

      const dépôt =
        await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjetValue },
        });

      if (Option.isNone(dépôt)) {
        return notFound();
      }

      const props = mapToProps({ dépôt, utilisateur });

      return (
        <ModifierDépôtGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
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
}) => ModifierDépôtGarantiesFinancièresPageProps;

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
