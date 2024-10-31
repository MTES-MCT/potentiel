import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { SupprimerDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/supprimer/SupprimerDépôtEnCoursGarantiesFinancières';
import { ValiderDépôtEnCoursGarantiesFinancières } from '../../pages/garanties-financières/dépôt/valider/validerDépôtEnCoursGarantiesFinancières';

import { GarantiesFinancièresProps } from './GarantiesFinancières';
import { DépôtGarantiesFinancières } from './types';

type DépôtGarantiesFinancièresActionsProps = {
  actions: DépôtGarantiesFinancières['actions'];
  identifiantProjet: GarantiesFinancièresProps['identifiantProjet'];
};

export const DépôtGarantiesFinancièresActions = ({
  identifiantProjet,
  actions,
}: DépôtGarantiesFinancièresActionsProps) => (
  <div className="flex flex-col md:flex-row gap-4">
    {actions.includes('modifier') && (
      <Button
        priority="secondary"
        linkProps={{
          href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet),
        }}
      >
        Modifier
      </Button>
    )}
    {actions.includes('instruire') && (
      <ValiderDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('supprimer') && (
      <SupprimerDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
    )}
  </div>
);
