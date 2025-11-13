import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type Props = {
  actions: DétailsGarantiesFinancièresPageProps['actions'];
  identifiantProjet: string;
};

export const InfoBoxMainlevée: FC<Props> = ({ actions, identifiantProjet }: Props) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Vous pouvez accéder à la demande de levée de vos garanties bancaires sur Potentiel si votre
        projet remplit <span className="font-semibold">toutes</span> les conditions suivantes :
        <ul className="list-disc list-inside mb-2">
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
            (abandon accordé par la DGEC).
          </li>
        </ul>
        {actions.includes('achèvement.transmettre') && (
          <Link href={Routes.Achèvement.transmettreAttestationConformité(identifiantProjet)}>
            Transmettre l'attestation de conformité
          </Link>
        )}
      </div>
    }
  />
);
