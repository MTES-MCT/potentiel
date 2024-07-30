import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type Props = {
  identifiantProjet: DétailsGarantiesFinancièresPageProps['identifiantProjet'];
  action: DétailsGarantiesFinancièresPageProps['action'];
};

export const GarantiesFinancièresManquantes: React.FC<Props> = ({
  identifiantProjet,
  action,
}: Props) => (
  <p className="p-3">
    Aucunes garanties financières pour ce projet.
    {action === 'soumettre' && (
      <>
        {' '}
        Vous pouvez en{' '}
        <Link
          href={Routes.GarantiesFinancières.dépôt.soumettre(identifiantProjet)}
          className="font-semibold"
        >
          soumettre des nouvelles
        </Link>{' '}
        qui seront validées par l'autorité compétente
      </>
    )}
    {action === 'enregistrer' && (
      <>
        {' '}
        Vous pouvez enregistrer des garanties financières en{' '}
        <Link
          href={Routes.GarantiesFinancières.actuelles.enregistrer(identifiantProjet)}
          className="font-semibold"
        >
          suivant ce lien
        </Link>
      </>
    )}
  </p>
);
