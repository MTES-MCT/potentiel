import { Metadata } from 'next';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { vérifierProjetSoumisAuxGarantiesFinancières } from '@/app/laureats/[identifiant]/garanties-financieres/_helpers/vérifierAppelOffreSoumisAuxGarantiesFinancières';
import { EnregistrerGarantiesFinancièresPage } from '@/app/laureats/[identifiant]/garanties-financieres/(actuelles)/actuelles:enregistrer/EnregistrerGarantiesFinancières.page';
import { getCahierDesCharges, récupérerLauréat } from '@/app/_helpers';

import { typesGarantiesFinancièresPourFormulaire } from '../../typesGarantiesFinancièresPourFormulaire';
import { récuperérerGarantiesFinancièresActuelles } from '../../_helpers/récupérerGarantiesFinancièresActuelles';

export const metadata: Metadata = {
  title: `Enregistrer des garanties financières actuelles - Potentiel`,
  description: `Formulaire pour enregistrer des garanties financières actuelles`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await récupérerLauréat(identifiantProjetValue);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    await vérifierProjetSoumisAuxGarantiesFinancières(identifiantProjet);

    const garantiesFinancières = await récuperérerGarantiesFinancièresActuelles(
      identifiantProjet.formatter(),
    );
    if (Option.isSome(garantiesFinancières)) {
      throw new Error('Le projet possède déjà des garanties financières.');
    }

    return (
      <EnregistrerGarantiesFinancièresPage
        identifiantProjet={identifiantProjetValue}
        typesGarantiesFinancières={typesGarantiesFinancièresPourFormulaire(cahierDesCharges)}
      />
    );
  });
}
