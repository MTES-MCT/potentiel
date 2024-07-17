import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type InfoBoxMainlevéeProps = {
  identifiantProjet: DétailsGarantiesFinancièresPageProps['identifiantProjet'];
};

export const InfoBoxMainlevée: FC<InfoBoxMainlevéeProps> = ({ identifiantProjet }) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Vous pouvez accéder à la demande de levée de vos garanties bancaires sur Potentiel si votre
        projet remplit <span className="font-semibold">toutes</span> les conditions suivantes :
        <ul className="list-disc list-inside">
          <li>
            Le projet a des garanties financières validées (l'attestation de constitution doit être
            transmise dans Potentiel)
          </li>
          <li>
            Le projet ne dispose pas de demande de renouvellement ou de modifications de garanties
            financières en cours
          </li>
          <li>
            L'attestation de conformité a été transmise dans Potentiel ou le projet est abandonné
            (abandon accordé par la DGEC). Vous pouvez la transmettre{' '}
            <Link href={Routes.Achèvement.transmettreAttestationConformité(identifiantProjet)}>
              ici
            </Link>
          </li>
        </ul>
      </div>
    }
  />
);
