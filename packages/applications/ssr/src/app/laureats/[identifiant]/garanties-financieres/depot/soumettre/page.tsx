import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { InvalidOperationError } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getCahierDesCharges, récupérerLauréat } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { vérifierProjetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';
import { vérifierProjetNonExemptDeGarantiesFinancières } from '../../_helpers/vérifierProjetNonExemptDeGarantiesFinancières';

import { SoumettreDépôtGarantiesFinancièresPage } from './SoumettreDépôtGarantiesFinancières.page';

export const metadata: Metadata = {
  title: 'Soumettre des garanties financières - Potentiel',
  description: 'Formulaire de transmission des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.SoumettreDépôtGarantiesFinancièresUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.SoumettreDépôtGarantiesFinancières',
      );

      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      await récupérerLauréat(identifiantProjetValue);
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);
      await vérifierProjetNonExemptDeGarantiesFinancières(identifiantProjet);

      const dépôtGarantiesFinancières =
        await mediator.send<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresQuery>({
          type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtGarantiesFinancières',
          data: { identifiantProjetValue: identifiantProjetValue },
        });

      if (Option.isSome(dépôtGarantiesFinancières)) {
        throw new InvalidOperationError('Le projet a déjà un dépôt en attente de validation');
      }

      return (
        <SoumettreDépôtGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
          typesGarantiesFinancières={typesGarantiesFinancièresPourFormulaire(cahierDesCharges)}
        />
      );
    }),
  );
}
