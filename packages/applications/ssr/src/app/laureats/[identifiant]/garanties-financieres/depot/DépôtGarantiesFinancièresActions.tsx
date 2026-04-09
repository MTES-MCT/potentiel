import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';

import { ActionsList } from '@/components/templates/ActionsList.template';

import { SupprimerDépôtGarantiesFinancièresForm } from './supprimer/SupprimerDépôtGarantiesFinancières.form';
import { ValiderDépôtGarantiesFinancièresForm } from './valider/validerDépôtGarantiesFinancières.form';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = [
  'garantiesFinancières.dépôt.valider',
  'garantiesFinancières.dépôt.supprimer',
  'garantiesFinancières.dépôt.modifier',
] satisfies Role.Policy[];
export type ActionDépôtGarantiesFinancières = (typeof actions)[number];

export type DépôtGarantiesFinancièresActionsProps = {
  actions: ActionDépôtGarantiesFinancières[];
  identifiantProjet: string;
};

export const DépôtGarantiesFinancièresActions = ({
  identifiantProjet,
  actions,
}: DépôtGarantiesFinancièresActionsProps) => (
  <ActionsList actionsListLength={1}>
    {actions.includes('garantiesFinancières.dépôt.valider') && (
      <ValiderDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    )}
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
    {actions.includes('garantiesFinancières.dépôt.supprimer') && (
      <SupprimerDépôtGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    )}
    <Button
      priority="secondary"
      linkProps={{
        href: Routes.GarantiesFinancières.détail(identifiantProjet),
      }}
    >
      Voir les garanties financières
    </Button>
  </ActionsList>
);
