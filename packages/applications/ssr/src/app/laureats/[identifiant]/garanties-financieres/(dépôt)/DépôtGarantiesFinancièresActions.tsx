import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { GarantiesFinancièresProps } from '../components/GarantiesFinancières';

import { DépôtGarantiesFinancières } from './dépôtGarantiesFinancières.type';
import { SupprimerDépôtGarantiesFinancièresForm } from './supprimer/SupprimerDépôtGarantiesFinancières.form';
import { ValiderDépôtGarantiesFinancièresForm } from './valider/validerDépôtGarantiesFinancières.form';

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
      <ValiderDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    )}
    {actions.includes('supprimer') && (
      <SupprimerDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    )}
  </div>
);
