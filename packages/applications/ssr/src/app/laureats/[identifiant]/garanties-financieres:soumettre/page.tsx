import { Metadata } from 'next';
import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  SoumettreGarantiesFinancièresPage,
  SoumettreGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/soumettre/SoumettreGarantiesFinancières.page';

export const metadata: Metadata = {
  title: 'Transmettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
};

const getLabelByType = (type: GarantiesFinancières.TypeGarantiesFinancières.RawType) => {
  switch (type) {
    case 'consignation':
      return 'Consignation';
    case 'avec-date-échéance':
      return "Avec date d'échéance";
    case 'six-mois-après-achèvement':
      return 'Six mois après achèvement';
  }
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
    let garantiesFinancièresÀTraiterExistante: true | undefined = undefined;

    try {
      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });
      if (gf.àTraiter) {
        garantiesFinancièresÀTraiterExistante = true;
      }
    } catch (e) {
    } finally {
      const props: SoumettreGarantiesFinancièresProps = {
        projet: { ...candidature, identifiantProjet },
        garantiesFinancièresÀTraiterExistante,
        typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map(
          (type) => ({
            label: getLabelByType(type),
            value: type,
          }),
        ),
      };

      return <SoumettreGarantiesFinancièresPage {...props} />;
    }
  });
}
