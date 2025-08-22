import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import type { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréat } from '@/app/_helpers';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/app/laureats/[identifiant]/garanties-financieres/typesGarantiesFinancièresPourFormulaire';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { projetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '../../ProjetNonSoumisAuxGarantiesFinancières.page';
import { ProjetADéjàUnDépôtEnCoursPage } from './ProjetADéjàUnDépôtEnCours.page';
import { SoumettreDépôtGarantiesFinancièresPage } from './SoumettreDépôtGarantiesFinancières.page';

export const metadata: Metadata = {
  title: 'Soumettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await récupérerLauréat(identifiantProjetValue);

    const soumisAuxGarantiesFinancières =
      await projetSoumisAuxGarantiesFinancières(identifiantProjet);

    if (!soumisAuxGarantiesFinancières) {
      return (
        <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
      );
    }

    const dépôtGarantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjetValue },
      });

    return Option.match(dépôtGarantiesFinancières)
      .some(() => <ProjetADéjàUnDépôtEnCoursPage identifiantProjet={identifiantProjetValue} />)
      .none(() => (
        <SoumettreDépôtGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
          typesGarantiesFinancières={typesGarantiesFinancièresSansInconnuPourFormulaire}
        />
      ));
  });
}
