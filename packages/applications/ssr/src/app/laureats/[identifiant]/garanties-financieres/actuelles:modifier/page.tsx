import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterGarantiesFinancièresReadModel } from '@potentiel-domain/laureat/src/garantiesFinancières';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesProps,
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

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const projet = { ...candidature, identifiantProjet };

    const soumisAuxGarantiesFinancières = await projetSoumisAuxGarantiesFinancières({
      appelOffre: candidature.appelOffre,
      famille: candidature.famille,
      periode: candidature.période,
    });

    if (!soumisAuxGarantiesFinancières) {
      return <ProjetNonSoumisAuxGarantiesFinancièresPage projet={projet} />;
    }

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (Option.isNone(garantiesFinancières)) {
      return notFound();
    }

    const props = mapToProps({ ...garantiesFinancières, projet });

    return <ModifierGarantiesFinancièresActuellesPage {...props} />;
  });
}

const mapToProps = ({
  projet,
  garantiesFinancières: {
    type,
    dateÉchéance,
    validéLe,
    dernièreMiseÀJour,
    dateConstitution,
    attestation,
  },
}: ConsulterGarantiesFinancièresReadModel & {
  projet: ConsulterCandidatureReadModel & { identifiantProjet: string };
}): ModifierGarantiesFinancièresActuellesProps => ({
  projet,
  typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
  actuelles: {
    type: type.type,
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
