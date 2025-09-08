import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { CahierDesCharges, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { projetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { getCahierDesCharges } from '@/app/_helpers';

import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '../../ProjetNonSoumisAuxGarantiesFinancières.page';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';

import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesPageProps,
} from './ModifierGarantiesFinancièresActuelles.page';

export const metadata: Metadata = {
  title: 'Modifier les garanties financières actuelles - Potentiel',
  description: `Formulaire de modification des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
    const soumisAuxGarantiesFinancières =
      await projetSoumisAuxGarantiesFinancières(identifiantProjet);

    if (!soumisAuxGarantiesFinancières) {
      return (
        <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
      );
    }

    const garantiesFinancières =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjetValue },
      });

    if (Option.isNone(garantiesFinancières)) {
      return notFound();
    }

    const props = mapToProps(garantiesFinancières, cahierDesCharges);

    return (
      <ModifierGarantiesFinancièresActuellesPage
        identifiantProjet={identifiantProjetValue}
        typesGarantiesFinancières={props.typesGarantiesFinancières}
        actuelles={props.actuelles}
      />
    );
  });
}

type MapToProps = (
  garantiesFinancières: Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel,
  cahierDesCharges: CahierDesCharges.ValueType,
) => ModifierGarantiesFinancièresActuellesPageProps;

const mapToProps: MapToProps = (
  {
    identifiantProjet,
    garantiesFinancières: {
      type,
      dateÉchéance,
      validéLe,
      dernièreMiseÀJour,
      dateConstitution,
      attestation,
      statut,
    },
  },
  cahierDesCharges,
) => ({
  identifiantProjet: identifiantProjet.formatter(),
  typesGarantiesFinancières: typesGarantiesFinancièresPourFormulaire(cahierDesCharges),
  actuelles: {
    type: type.type,
    statut: statut.statut,
    dateÉchéance: dateÉchéance?.formatter(),
    dateConstitution: dateConstitution?.formatter(),
    validéLe: validéLe?.formatter(),
    attestation: attestation?.formatter(),
    dernièreMiseÀJour: {
      date: dernièreMiseÀJour.date.formatter(),
      par: dernièreMiseÀJour.par?.formatter(),
    },
  },
});
