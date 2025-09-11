import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

type Props = {
  identifiantProjet: DétailsGarantiesFinancièresPageProps['identifiantProjet'];
  actions: DétailsGarantiesFinancièresPageProps['actions'];
};

export const GarantiesFinancièresManquantes: React.FC<Props> = ({
  identifiantProjet,
  actions,
}: Props) => (
  <p className="p-3">
    Aucunes garanties financières pour ce projet.
    {actions.includes('garantiesFinancières.dépôt.soumettre') && (
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
    {actions.includes('garantiesFinancières.actuelles.enregistrer') && (
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
