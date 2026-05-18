import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { vérifierProjetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';
import {
  ModifierDépôtGarantiesFinancièresPage,
  ModifierDépôtGarantiesFinancièresPageProps,
} from './ModifierDépôtGarantiesFinancières.page';

export const metadata: Metadata = { title: 'Modifier le dépôt de garanties financières' };

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.ModifierDépôtGarantiesFinancièresEnCoursUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
      );

      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

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
  showWarning: utilisateur.estPorteur() ? true : undefined,
});
