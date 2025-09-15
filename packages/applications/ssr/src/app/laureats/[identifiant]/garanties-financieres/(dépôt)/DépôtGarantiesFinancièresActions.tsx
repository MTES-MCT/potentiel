import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';

import { DétailsGarantiesFinancièresPageProps } from '../DétailsGarantiesFinancières.page';

import { SupprimerDépôtGarantiesFinancièresForm } from './supprimer/SupprimerDépôtGarantiesFinancières.form';
import { ValiderDépôtGarantiesFinancièresForm } from './valider/validerDépôtGarantiesFinancières.form';

type DépôtGarantiesFinancièresActionsProps = {
  actions: DétailsGarantiesFinancièresPageProps['actions'];
  infos: DétailsGarantiesFinancièresPageProps['infos'];
  identifiantProjet: string;
};

export const DépôtGarantiesFinancièresActions = ({
  identifiantProjet,
  actions,
  infos,
}: DépôtGarantiesFinancièresActionsProps) => (
  <div className="flex-col gap-2">
    {infos.includes('date-échéance-dépôt-passée') ? (
      <Alert
        severity="info"
        small
        description={
          <p>
            La date d'échéance de ces garanties financières étant passée, elles seront
            automatiquement échues à leur validation.
          </p>
        }
      />
    ) : undefined}
    <div className="flex flex-col md:flex-row gap-4">
      {actions.includes('garantiesFinancières.dépôt.modifier') && (
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet),
          }}
        >
          Modifier
        </Button>
      )}
      {actions.includes('garantiesFinancières.dépôt.valider') && (
        <ValiderDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('garantiesFinancières.dépôt.supprimer') && (
        <SupprimerDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
      )}
    </div>
  </div>
);
