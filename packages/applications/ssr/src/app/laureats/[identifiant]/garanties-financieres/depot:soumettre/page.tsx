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
} from '@/components/pages/garanties-financières/dépôt/soumettre/SoumettreGarantiesFinancières.page';
import { getGarantiesFinancièresTypeLabel } from '@/components/pages/garanties-financières/getGarantiesFinancièresTypeLabel';
import { tryToGetResource } from '@/utils/tryToGetRessource';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/utils/pages/vérifierProjetSoumisAuxGarantiesFinancières';

export const metadata: Metadata = {
  title: 'Soumettre des garanties financières - Potentiel',
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

    const projet = { ...candidature, identifiantProjet };

    return vérifierProjetSoumisAuxGarantiesFinancières({
      projet,
      callback: async () => {
        const gf = await tryToGetResource(
          async () =>
            await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
              type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
              data: { identifiantProjetValue: identifiantProjet },
            }),
        );

        const props: SoumettreGarantiesFinancièresProps = {
          projet,
          dépôtEnCoursExistant: gf?.dépôts.find((dépôt) => dépôt.statut.estEnCours())
            ? true
            : undefined,
          typesGarantiesFinancières: GarantiesFinancières.TypeGarantiesFinancières.types.map(
            (type) => ({
              label: getGarantiesFinancièresTypeLabel(type),
              value: type,
            }),
          ),
        };

        return <SoumettreGarantiesFinancièresPage {...props} />;
      },
    });
  });
}
