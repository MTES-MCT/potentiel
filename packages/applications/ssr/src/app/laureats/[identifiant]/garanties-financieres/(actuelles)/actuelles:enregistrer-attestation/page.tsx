import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { récupérerLauréat } from '@/app/_helpers';

import { vérifierProjetNonExemptDeGarantiesFinancières } from '../../_helpers/vérifierProjetNonExemptDeGarantiesFinancières';

import { EnregistrerAttestationGarantiesFinancièresPage } from './EnregistrerAttestationGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation de constitution des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour Enregistrer l'attestation de constitution des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await récupérerLauréat(identifiantProjetValue);

    await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);
    await vérifierProjetNonExemptDeGarantiesFinancières(identifiantProjet);

    return (
      <EnregistrerAttestationGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
    );
  });
}
