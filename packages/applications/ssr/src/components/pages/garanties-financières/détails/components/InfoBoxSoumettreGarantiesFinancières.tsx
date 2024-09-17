import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type Props = {
  identifiantProjet: DétailsGarantiesFinancièresPageProps['identifiantProjet'];
};

export const InfoBoxSoumettreGarantiesFinancières: React.FC<Props> = ({
  identifiantProjet,
}: Props) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Vous pouvez{' '}
        <Link
          href={Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet)}
          className="font-semibold"
        >
          soumettre de nouvelles garanties financières
        </Link>{' '}
        qui seront validées par l'autorité compétente
      </div>
    }
  />
);
