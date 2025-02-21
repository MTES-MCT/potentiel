import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesPageProps,
} from '@/components/pages/garanties-financières/actuelles/modifier/ModifierGarantiesFinancièresActuelles.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

export const metadata: Metadata = {
  title: 'Modifier les garanties financières actuelles - Potentiel',
  description: `Formulaire de modification des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
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

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (Option.isNone(garantiesFinancières)) {
      return notFound();
    }

    const props = mapToProps(garantiesFinancières);

    return (
      <ModifierGarantiesFinancièresActuellesPage
        identifiantProjet={identifiantProjet}
        typesGarantiesFinancières={props.typesGarantiesFinancières}
        actuelles={props.actuelles}
      />
    );
  });
}

type MapToProps = (
  garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel,
) => ModifierGarantiesFinancièresActuellesPageProps;
const mapToProps: MapToProps = ({
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
}) => ({
  identifiantProjet: identifiantProjet.formatter(),
  typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
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
