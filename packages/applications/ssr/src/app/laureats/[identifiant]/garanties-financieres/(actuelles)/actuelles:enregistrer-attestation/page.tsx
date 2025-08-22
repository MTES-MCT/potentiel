import type { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { récupérerLauréat } from '@/app/_helpers';
import { projetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/app/laureats/[identifiant]/garanties-financieres/ProjetNonSoumisAuxGarantiesFinancières.page';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
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

    const soumisAuxGarantiesFinancières =
      await projetSoumisAuxGarantiesFinancières(identifiantProjet);

    if (!soumisAuxGarantiesFinancières) {
      return (
        <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
      );
    }

    return (
      <EnregistrerAttestationGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
    );
  });
}
