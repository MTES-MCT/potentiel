import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { SoumettreGarantiesFinancièresPage } from '@/components/pages/garanties-financières/dépôt/soumettre/SoumettreGarantiesFinancières.page';
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

    const dépôtGarantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet },
      });

    return Option.match(dépôtGarantiesFinancières)
      .some(() => <ProjetADéjàUnDépôtEnCoursPage identifiantProjet={identifiantProjet} />)
      .none(() => (
        <SoumettreGarantiesFinancièresPage
          identifiantProjet={identifiantProjet}
          typesGarantiesFinancières={typesGarantiesFinancièresSansInconnuPourFormulaire}
        />
      ));
  });
}
