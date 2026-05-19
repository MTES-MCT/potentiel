import type { Metadata } from 'next';

import { InvalidOperationError, mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { récupérerLauréat } from '@/app/_helpers';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récuperérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';
import { EnregistrerAttestationGarantiesFinancièresPage } from './EnregistrerAttestationGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation des garanties financières actuelles`,
};

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.GarantiesFinancières.EnregistrerAttestationGarantiesFinancièresUseCase>(
        'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
      );

      const identifiantProjetValue = decodeParameter(identifiant);
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      await récupérerLauréat(identifiantProjetValue);

      await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

      const garantiesFinancières = await récuperérerGarantiesFinancièresActuelles(
        identifiantProjet.formatter(),
      );

      if (Option.isNone(garantiesFinancières)) {
        throw new InvalidOperationError(`Garanties financières introuvables.`);
      }

      return (
        <EnregistrerAttestationGarantiesFinancièresPage
          identifiantProjet={identifiantProjetValue}
          garantiesFinancièresActuelles={mapToPlainObject(garantiesFinancières)}
        />
      );
    }),
  );
}
