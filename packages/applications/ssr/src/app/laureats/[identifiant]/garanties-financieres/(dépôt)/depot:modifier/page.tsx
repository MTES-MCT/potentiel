import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';

import { vérifierProjetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';

import {
  ModifierDépôtGarantiesFinancièresPage,
  ModifierDépôtGarantiesFinancièresPageProps,
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
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const dépôt =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjetValue },
        });

      if (Option.isNone(dépôt)) {
        return notFound();
      }

      const props = mapToProps({ dépôt, utilisateur, cahierDesCharges });

      return (
        <ModifierDépôtGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
          typesGarantiesFinancières={props.typesGarantiesFinancières}
          dépôt={props.dépôt}
          showWarning={props.showWarning}
        />
      );
    }),
  );
}

type MapToProps = (params: {
  utilisateur: Utilisateur.ValueType;
  dépôt: Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel;
  cahierDesCharges: CahierDesCharges.ValueType;
}) => ModifierDépôtGarantiesFinancièresPageProps;

const mapToProps: MapToProps = ({ utilisateur, dépôt, cahierDesCharges }) => ({
  identifiantProjet: dépôt.identifiantProjet.formatter(),
  typesGarantiesFinancières: typesGarantiesFinancièresPourFormulaire(cahierDesCharges),
  dépôt: mapToPlainObject(dépôt),
  showWarning: utilisateur.role.estÉgaleÀ(Role.porteur) ? true : undefined,
});
