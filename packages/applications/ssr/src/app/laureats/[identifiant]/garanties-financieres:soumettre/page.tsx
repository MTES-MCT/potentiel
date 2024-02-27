import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat/';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  SoumettreGarantiesFinancièresPage,
  SoumettreGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/dépôt/soumettre/SoumettreGarantiesFinancières.page';

export const metadata: Metadata = {
  title: 'Transmettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: { identifiantProjet },
    });

    const garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'CONSULTER_GARANTIES_FINANCIÈRES_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

    const props: SoumettreGarantiesFinancièresProps = {
      projet: { ...candidature, identifiantProjet },
      garantiesFinancièresÀTraiterExistante: garantiesFinancières!.àTraiter ? true : undefined,
    };

    return <SoumettreGarantiesFinancièresPage {...props} />;
  });
}
