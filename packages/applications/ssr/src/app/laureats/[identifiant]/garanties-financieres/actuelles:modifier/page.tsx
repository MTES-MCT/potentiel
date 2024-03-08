import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import {
  ModifierGarantiesFinancièresActuellesPage,
  ModifierGarantiesFinancièresActuellesProps,
} from '@/components/pages/garanties-financières/actuelles/modifier/ModifierGarantiesFinancièresActuelles.page';

export const metadata: Metadata = {
  title: 'Modifier les garanties financières actuelles - Potentiel',
  description: `Formulaire de modification des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  if (!process.env.FEATURE_FLAG_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: { identifiantProjet },
    });

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    if (!garantiesFinancières.actuelles) {
      return notFound();
    }

    const props: ModifierGarantiesFinancièresActuellesProps = {
      projet: {
        ...candidature,
        identifiantProjet,
      },
      typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map(
        (type) => ({
          label: getGarantiesFinancièresTypeLabel(type),
          value: type,
        }),
      ),
      actuelles: {
        type: garantiesFinancières.actuelles.type.type,
        dateÉchéance: garantiesFinancières.actuelles.dateÉchéance?.formatter(),
        dateConstitution: garantiesFinancières.actuelles.dateConstitution?.formatter(),
        validéLe: garantiesFinancières.actuelles.validéLe?.formatter(),
        attestation: garantiesFinancières.actuelles.attestation?.formatter(),
        dernièreMiseÀJour: {
          date: garantiesFinancières.actuelles.dernièreMiseÀJour.date.formatter(),
          par: garantiesFinancières.actuelles.dernièreMiseÀJour.par.formatter(),
        },
      },
    };

    return <ModifierGarantiesFinancièresActuellesPage {...props} />;
  });
}
