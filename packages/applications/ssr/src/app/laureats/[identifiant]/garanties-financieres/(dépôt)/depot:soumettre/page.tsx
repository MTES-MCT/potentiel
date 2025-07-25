import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { typesGarantiesFinancièresSansInconnuPourFormulaire } from '@/app/laureats/[identifiant]/garanties-financieres/typesGarantiesFinancièresPourFormulaire';
import { récupérerLauréat } from '@/app/_helpers';

import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '../../ProjetNonSoumisAuxGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';

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
