import React, { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import {
  ActionMap,
  Actions,
  ActionsPageTemplate,
} from '@/components/templates/ActionsPage.template';
import { ConfirmationAction } from '@/components/molecules/ConfirmationAction';
import { LinkAction } from '@/components/molecules/LinkAction';

import { GarantiesFinancières } from '../components/GarantiesFinancières';

import { validerDépôtGarantiesFinancièresAction } from './valider/validerDépôtGarantiesFinancières.action';
import { supprimerDépôtGarantiesFinancièresAction } from './supprimer/supprimerDépôtGarantiesFinancières.action';

type ActionDépôtGarantiesFinancières = Actions<
  | 'garantiesFinancières.dépôt.valider'
  | 'garantiesFinancières.dépôt.supprimer'
  | 'garantiesFinancières.dépôt.modifier'
>;

export type DétailsDépôtGarantiesFinancièresPageProps = {
  identifiantProjet: string;
  dépôt: PlainType<Lauréat.GarantiesFinancières.ConsulterDépôtGarantiesFinancièresReadModel>;
  actions: ActionDépôtGarantiesFinancières[];
};

export const DétailsDépôtGarantiesFinancièresPage: FC<
  DétailsDépôtGarantiesFinancièresPageProps
> = ({ identifiantProjet, dépôt, actions }) => {
  const gf = Lauréat.GarantiesFinancières.GarantiesFinancières.bind(dépôt.garantiesFinancières);

  const actionMap: ActionMap<ActionDépôtGarantiesFinancières> = {
    'garantiesFinancières.dépôt.valider': () => (
      <ConfirmationAction
        label="Valider"
        action={validerDépôtGarantiesFinancièresAction}
        id="valider-dépôt-garanties-financières"
        confirmation={{
          title: 'Valider les garanties financières',
          description: 'Êtes-vous sûr de vouloir valider ces garanties financières ?',
        }}
        formValues={{ identifiantProjet }}
        buttonProps={{
          title: 'Valider le dépôt de garanties financières',
        }}
      />
    ),
    'garantiesFinancières.dépôt.modifier': () => (
      <LinkAction
        linkProps={{ href: Routes.GarantiesFinancières.dépôt.modifier(identifiantProjet) }}
        buttonProps={{
          title: 'Modifier le dépôt de garanties financières',
          priority: 'secondary',
        }}
        label="Modifier"
      />
    ),
    'garantiesFinancières.dépôt.supprimer': () => (
      <ConfirmationAction
        action={supprimerDépôtGarantiesFinancièresAction}
        label="Supprimer"
        id="supprimer-dépôt-garanties-financières"
        confirmation={{
          title: 'Supprimer les garanties financières en attente de validation',
          description: 'Êtes-vous sûr de vouloir supprimer ces garanties financières ?',
        }}
        formValues={{ identifiantProjet }}
        buttonProps={{ priority: 'secondary' }}
      />
    ),
  };

  return (
    <ActionsPageTemplate<ActionDépôtGarantiesFinancières>
      heading="Détail du dépôt de garanties financières"
      actions={actions}
      actionMap={actionMap}
    >
      {gf.estÉchu() && (
        <Notice
          severity="warning"
          title="Garanties Financières échues"
          className="mb-2"
          description="La date d'échéance de ces garanties financières étant passée, elles seront automatiquement échues à leur validation."
        />
      )}
      <GarantiesFinancières
        garantiesFinancières={dépôt.garantiesFinancières}
        document={dépôt.document}
        soumisLe={dépôt.soumisLe}
        peutModifier
      />
      <Button
        priority="secondary"
        iconId="fr-icon-arrow-left-line"
        linkProps={{
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
        }}
      >
        Retour aux Garanties Financières
      </Button>
    </ActionsPageTemplate>
  );
};
