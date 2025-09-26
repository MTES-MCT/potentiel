import { Metadata } from 'next';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { InvalidOperationError, mapToPlainObject } from '@potentiel-domain/core';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { récupérerLauréat } from '@/app/_helpers';

import { EnregistrerAttestationGarantiesFinancièresPage } from './EnregistrerAttestationGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour Enregistrer l'attestation des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await récupérerLauréat(identifiantProjetValue);

    await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

    const garantiesFinancières =
      await mediator.send<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    if (Option.isNone(garantiesFinancières)) {
      throw new InvalidOperationError(`Garanties financières introuvables.`);
    }

    return (
      <EnregistrerAttestationGarantiesFinancièresPage
        identifiantProjet={identifiantProjetValue}
        garantiesFinancièresActuelles={mapToPlainObject(garantiesFinancières)}
      />
    );
  });
}
