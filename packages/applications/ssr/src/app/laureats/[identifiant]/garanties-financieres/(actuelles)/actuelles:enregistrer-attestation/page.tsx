import { Metadata } from 'next';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { InvalidOperationError, mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { récupérerLauréat } from '@/app/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { récuperérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';

import { EnregistrerAttestationGarantiesFinancièresPage } from './EnregistrerAttestationGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour Enregistrer l'attestation des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
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
