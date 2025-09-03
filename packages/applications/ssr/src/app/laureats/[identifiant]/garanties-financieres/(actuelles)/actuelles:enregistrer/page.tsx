import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { projetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { EnregistrerGarantiesFinancièresPage } from '@/app/laureats/[identifiant]/garanties-financieres/(actuelles)/actuelles:enregistrer/EnregistrerGarantiesFinancières.page';
import { getCahierDesCharges, récupérerLauréat } from '@/app/_helpers';

import { ProjetNonSoumisAuxGarantiesFinancièresPage } from '../../ProjetNonSoumisAuxGarantiesFinancières.page';
import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';

export const metadata: Metadata = {
  title: `Enregistrer des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour enregistrer des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await récupérerLauréat(identifiantProjetValue);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

    const soumisAuxGarantiesFinancières =
      await projetSoumisAuxGarantiesFinancières(identifiantProjet);

    if (!soumisAuxGarantiesFinancières) {
      return (
        <ProjetNonSoumisAuxGarantiesFinancièresPage identifiantProjet={identifiantProjetValue} />
      );
    }

    return (
      <EnregistrerGarantiesFinancièresPage
        identifiantProjet={identifiantProjetValue}
        typesGarantiesFinancières={typesGarantiesFinancièresPourFormulaire(cahierDesCharges)}
      />
    );
  });
}
