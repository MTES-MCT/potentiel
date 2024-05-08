import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  SoumettreGarantiesFinancièresPage,
  SoumettreGarantiesFinancièresProps,
} from '@/components/pages/garanties-financières/dépôt/soumettre/SoumettreGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';
import { ProjetADéjàUnDépôtEnCoursPage } from '@/components/pages/garanties-financières/dépôt/soumettre/ProjetADéjàUnDépôtEnCours.page';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/utils/garanties-financières/typesGarantiesFinancièresPourFormulaire';

export const metadata: Metadata = {
  title: 'Soumettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
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

    const props: SoumettreGarantiesFinancièresProps = {
      projet,
      typesGarantiesFinancières: typesGarantiesFinancièresSansInconnuPourFormulaire,
    };

    try {
      const garantiesFinancières =
        await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjet },
        });

      if (garantiesFinancières.dépôts.find((dépôt) => dépôt.statut.estEnCours())) {
        return <ProjetADéjàUnDépôtEnCoursPage projet={projet} />;
      }

      return <SoumettreGarantiesFinancièresPage {...props} />;
    } catch (e) {
      return <SoumettreGarantiesFinancièresPage {...props} />;
    }
  });
}
