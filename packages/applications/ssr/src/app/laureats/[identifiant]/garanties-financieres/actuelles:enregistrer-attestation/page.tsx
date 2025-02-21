import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { EnregistrerAttestationGarantiesFinancièresPage } from '@/components/pages/garanties-financières/actuelles/enregistrerAttestation/EnregistrerAttestationGarantiesFinancières.page';
import { projetSoumisAuxGarantiesFinancières } from '@/utils/garanties-financières/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '@/components/pages/garanties-financières/ProjetNonSoumisAuxGarantiesFinancières.page';

export const metadata: Metadata = {
  title: `Enregistrer l'attestation de constitution des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour Enregistrer l'attestation de constitution des garanties financières actuelles`,
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

    return <EnregistrerAttestationGarantiesFinancièresPage identifiantProjet={identifiantProjet} />;
  });
}
