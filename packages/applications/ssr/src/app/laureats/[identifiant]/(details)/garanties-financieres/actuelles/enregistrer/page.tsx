import type { Metadata } from 'next';

import { InvalidOperationError } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges, getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '../../_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';
import { EnregistrerGarantiesFinancièresPage } from './EnregistrerGarantiesFinancières.page';

export const metadata: Metadata = { title: `Enregistrer des garanties financières actuelles` };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.EnregistrerGarantiesFinancièresUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
      );

      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      await getLauréatInfos(identifiantProjet.formatter());
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const garantiesFinancières = await récupérerGarantiesFinancièresActuelles(
        identifiantProjet.formatter(),
      );
      if (Option.isSome(garantiesFinancières)) {
        throw new InvalidOperationError('Le projet possède déjà des garanties financières.');
      }

      return (
        <EnregistrerGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
          typesGarantiesFinancières={typesGarantiesFinancièresPourFormulaire(cahierDesCharges)}
        />
      );
    }),
  );
}
