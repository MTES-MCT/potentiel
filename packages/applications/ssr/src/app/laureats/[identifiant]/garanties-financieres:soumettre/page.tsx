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
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';

export const metadata: Metadata = {
  title: 'Transmettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
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

    /**
     * @todo : à voir si on peut faire une query pour savoir si on a des dépôts de garanties financières sont en cours de traitement
     */
    try {
      const gf = await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });
      if (gf.dépôts.find((dépôt) => dépôt.statut.estEnCours())) {
        garantiesFinancièresÀTraiterExistante = true;
      }
    } catch (e) {
    } finally {
      const props: SoumettreGarantiesFinancièresProps = {
        projet: { ...candidature, identifiantProjet },
        garantiesFinancièresÀTraiterExistante,
        typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map(
          (type) => ({
            label: getGarantiesFinancièresTypeLabel(type),
            value: type,
          }),
        ),
      };

      return <SoumettreGarantiesFinancièresPage {...props} />;
    }
  });
}
